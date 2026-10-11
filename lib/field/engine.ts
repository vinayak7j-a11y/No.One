import * as THREE from "three";
import { FIELD_FORMS, WORDMARK_UNITS } from "@/config/field";
import type { FieldAnchorRect } from "@/lib/field/anchor";
import { buildForm } from "@/lib/field/forms";
import { fieldFragmentShader, fieldVertexShader } from "@/lib/field/shaders";
import type { FieldFormId, FieldSide } from "@/types/field";

/** How long a full morph takes. Particles stagger inside this window. */
const MORPH_SECONDS = 1.9;

export interface FieldFrame {
  dt: number;
  time: number;
  pointer: { x: number; y: number; active: boolean };
  /** Visible half-size of the world at the origin plane. */
  halfW: number;
  halfH: number;
  /** Canvas size in CSS pixels. */
  width: number;
  height: number;
  dpr: number;
  scrollY: number;
  anchor: FieldAnchorRect | null;
  reduced: boolean;
  /** 0 to 1. Lower on content-heavy pages so copy stays readable. */
  dim: number;
}

interface Layout {
  x: number;
  y: number;
  s: number;
  rx: number;
  rz: number;
}

type Theme = "dark" | "light";

/**
 * The living field, kept as a plain class so the physics lives outside
 * React. The canvas component creates one, calls `setTarget` when
 * attention changes, and calls `update` once per frame. Everything that
 * moves (morphing, layout, colour, pointer, scroll, the burst spring) is
 * damped here, so a change of mind mid-morph never produces a jump.
 */
export class FieldEngine {
  /** Add this to the scene. Holds the moving body and the far dust. */
  readonly group = new THREE.Group();
  /** The morphing particle form; moved and scaled by the layout. */
  private readonly body = new THREE.Group();
  private readonly dust: THREE.Points;
  private readonly dustMaterial: THREE.PointsMaterial;
  /** Assign to `scene.background`; eased toward the theme background. */
  readonly background = new THREE.Color("#000000");
  readonly count: number;

  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly aFrom: THREE.BufferAttribute;
  private readonly aTo: THREE.BufferAttribute;
  private readonly cache = new Map<FieldFormId, Float32Array>();

  private fromArr: Float32Array;
  private toArr: Float32Array;
  private toForm: FieldFormId = "rest";
  private toSide: FieldSide | null = null;
  private progress = 1;

  private theme: Theme = "dark";
  private readonly backgroundTarget = new THREE.Color("#000000");
  private readonly colA = new THREE.Color();
  private readonly colB = new THREE.Color();
  private readonly colTargetA = new THREE.Color();
  private readonly colTargetB = new THREE.Color();

  private readonly lay: Layout = { x: 0, y: 0, s: 1, rx: 0, rz: 0 };
  private spinRate = 0;
  private autoRot = 0;
  private jitter = 1;
  private flow = 1;
  private size = 1;
  private dim = 1;

  private burst = 0;
  private burstVel = 0;

  private mx = 0;
  private my = 0;
  private sx = 0;
  private sy = 0;

  private scrollPrev = 0;
  private agitate = 0;
  private started = false;
  private lightBoost = 1;

  constructor(count: number) {
    this.count = count;
    this.fromArr = this.positionsFor("rest");
    this.toArr = this.fromArr;

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    this.aFrom = new THREE.BufferAttribute(this.fromArr, 3);
    this.aTo = new THREE.BufferAttribute(this.toArr, 3);
    this.geometry.setAttribute("aFrom", this.aFrom);
    this.geometry.setAttribute("aTo", this.aTo);
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    this.geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));

    this.material = new THREE.ShaderMaterial({
      vertexShader: fieldVertexShader,
      fragmentShader: fieldFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uT: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 1.9 },
        uPx: { value: 1 },
        uBurst: { value: 0 },
        uJitter: { value: 1 },
        uFlow: { value: 1 },
        uAgitate: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, -7) },
        uColA: { value: new THREE.Color() },
        uColB: { value: new THREE.Color() },
        uAlpha: { value: 0.5 },
        uDim: { value: 1 },
        uLight: { value: 0 },
      },
    });

    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.body.add(points);

    // A thin shell of far dust that never morphs. It drifts against the
    // form with its own parallax, which is what makes the space read as deep.
    const dustCount = Math.min(2600, Math.round(count / 12));
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 9 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      dustPos[i * 3 + 2] = r * Math.cos(phi) - 6;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    // A tiny soft disc so dust reads as round glints, never squares.
    const disc = document.createElement("canvas");
    disc.width = disc.height = 32;
    const dctx = disc.getContext("2d");
    if (dctx) {
      const g = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      dctx.fillStyle = g;
      dctx.fillRect(0, 0, 32, 32);
    }
    this.dustMaterial = new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(disc),
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
      color: new THREE.Color("#a1a1aa"),
      blending: THREE.AdditiveBlending,
    });
    this.dust = new THREE.Points(dustGeometry, this.dustMaterial);
    this.dust.frustumCulled = false;

    this.group.add(this.dust);
    this.group.add(this.body);
  }

  /** Kick the intro: particles start flung outward and fall into place. */
  intro(strength = 2.6) {
    this.burst = strength;
    this.burstVel = 0;
  }

  setTheme(theme: Theme, background: string) {
    this.theme = theme;
    this.backgroundTarget.set(background);
    const dark = theme === "dark";
    this.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.material.needsUpdate = true;
    const u = this.material.uniforms;
    u.uLight.value = dark ? 0 : 1;
    // Light theme paints dark ink on white, which reads thinner than light
    // on black, so it gets more opacity and a slightly bolder point.
    u.uAlpha.value =
      (dark ? 0.5 : 0.9) * Math.pow(36000 / this.count, 0.6);
    this.lightBoost = dark ? 1 : 1.25;
    this.dustMaterial.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.dustMaterial.color.set(dark ? "#a1a1aa" : "#52525b");
    this.dustMaterial.needsUpdate = true;
  }

  /** Ask the field to take a form. Safe to call mid-morph. */
  setTarget(form: FieldFormId, side: FieldSide | null, reduced: boolean) {
    if (form === this.toForm && side === this.toSide) return;
    this.beginMorph(form, side, reduced);
  }

  /** Provide the sampled wordmark once the font has loaded. */
  setWordmark(positions: Float32Array) {
    this.cache.set("wordmark", positions);
    if (this.toForm === "wordmark") {
      this.beginMorph("wordmark", this.toSide, false);
    }
  }

  /** A shockwave. 1 is a firm shove, 2 a hard one. */
  pulse(strength: number) {
    this.burstVel += strength * 8;
  }

  /** Last-resort performance lever: draw only part of the cloud. */
  setDrawFraction(fraction: number) {
    this.geometry.setDrawRange(0, Math.floor(this.count * fraction));
  }

  update(f: FieldFrame) {
    const dt = f.dt;
    const damp = (rate: number) => (f.reduced ? 1 : 1 - Math.exp(-dt * rate));
    const cfg = FIELD_FORMS[this.toForm];

    this.progress = f.reduced
      ? 1
      : Math.min(1, this.progress + dt / MORPH_SECONDS);

    // Layout: damped toward wherever the target form belongs on screen.
    const target = this.layoutFor(this.toForm, this.toSide, f);
    if (!this.started) Object.assign(this.lay, target);
    const lr = damp(this.toForm === "wordmark" ? 10 : 3.2);
    this.lay.x += (target.x - this.lay.x) * lr;
    this.lay.y += (target.y - this.lay.y) * lr;
    this.lay.s += (target.s - this.lay.s) * lr;
    this.lay.rx += (target.rx - this.lay.rx) * lr;
    this.lay.rz += (target.rz - this.lay.rz) * lr;

    this.spinRate += (cfg.spin - this.spinRate) * damp(2);
    if (!f.reduced) this.autoRot += dt * this.spinRate;

    // Look: shimmer, flow, size and dimming ease toward the form's values.
    const lk = damp(2.5);
    this.jitter += ((f.reduced ? 0 : cfg.jitter) - this.jitter) * lk;
    this.flow += ((f.reduced ? 0 : cfg.flow) - this.flow) * lk;
    this.size += (cfg.size - this.size) * lk;
    this.dim += (f.dim - this.dim) * lk;

    // Colour and background.
    const palette = cfg[this.theme];
    this.colTargetA.set(palette[0]);
    this.colTargetB.set(palette[1]);
    if (!this.started) {
      this.colA.copy(this.colTargetA);
      this.colB.copy(this.colTargetB);
      this.background.copy(this.backgroundTarget);
    }
    const ck = damp(2.2);
    this.colA.lerp(this.colTargetA, ck);
    this.colB.lerp(this.colTargetB, ck);
    this.background.lerp(this.backgroundTarget, damp(6));

    // The burst is an under-damped spring, so it overshoots and settles.
    if (f.reduced) {
      this.burst = 0;
      this.burstVel = 0;
    } else {
      this.burstVel += (-34 * this.burst - 5.5 * this.burstVel) * dt;
      this.burst += this.burstVel * dt;
    }

    // Pointer: a fast copy drives the shader, a slow copy tilts the form.
    const active = f.pointer.active && !f.reduced;
    if (active) {
      this.mx += (f.pointer.x - this.mx) * damp(14);
      this.my += (f.pointer.y - this.my) * damp(14);
    }
    this.sx += ((active ? f.pointer.x : 0) - this.sx) * damp(3);
    this.sy += ((active ? f.pointer.y : 0) - this.sy) * damp(3);

    // Scroll speed shakes the field and pulls the camera back a little.
    const speed = Math.abs(f.scrollY - this.scrollPrev) / Math.max(dt, 0.001);
    this.scrollPrev = f.scrollY;
    const agitateTarget = f.reduced ? 0 : Math.min(speed / 2500, 1.4);
    this.agitate +=
      (agitateTarget - this.agitate) *
      damp(agitateTarget > this.agitate ? 8 : 2.5);

    const parallax = cfg.parallax;
    this.body.position.set(this.lay.x, this.lay.y, -this.agitate * 0.9);
    this.body.scale.setScalar(this.lay.s);
    this.body.rotation.set(
      this.lay.rx - this.sy * 0.12 * parallax,
      this.autoRot + f.scrollY * 0.0003 * parallax + this.sx * 0.25 * parallax,
      this.lay.rz,
    );

    const u = this.material.uniforms;
    u.uT.value = this.progress;
    u.uTime.value = f.time;
    u.uPx.value = f.dpr;
    u.uSize.value =
      1.9 *
      this.lightBoost *
      this.size *
      Math.max(0.75, Math.min(1.35, f.height / 900));
    u.uBurst.value = this.burst;
    u.uJitter.value = this.jitter;
    u.uFlow.value = this.flow;
    u.uAgitate.value = this.agitate;
    u.uDim.value = this.dim;
    (u.uMouse.value as THREE.Vector3).set(
      active ? this.mx * f.halfW : 99,
      active ? this.my * f.halfH : 99,
      -7,
    );
    (u.uColA.value as THREE.Color).copy(this.colA);
    (u.uColB.value as THREE.Color).copy(this.colB);

    // Dust: slow orbit, opposite parallax to the form, and a scroll drift.
    if (!f.reduced) this.dust.rotation.y += dt * 0.012;
    this.dust.rotation.x = this.sy * 0.05;
    this.dust.position.x = -this.sx * 0.5;
    this.dust.position.y = (f.scrollY / Math.max(f.height, 1)) * 0.35;
    this.dustMaterial.opacity =
      (this.theme === "dark" ? 0.5 : 0.35) * (0.4 + 0.6 * this.dim);

    this.started = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.dust.geometry.dispose();
    this.dustMaterial.map?.dispose();
    this.dustMaterial.dispose();
    this.cache.clear();
  }

  private beginMorph(
    form: FieldFormId,
    side: FieldSide | null,
    reduced: boolean,
  ) {
    // Whatever is most visible right now becomes the origin of the next
    // morph, so changing your mind mid-flight never rewinds.
    const settled = this.progress > 0.5;
    this.fromArr = settled ? this.toArr : this.fromArr;
    this.toArr = this.positionsFor(form);
    this.toForm = form;
    this.toSide = side;
    this.aFrom.array = this.fromArr;
    this.aTo.array = this.toArr;
    this.aFrom.needsUpdate = true;
    this.aTo.needsUpdate = true;
    this.progress = reduced ? 1 : 0;
  }

  private positionsFor(form: FieldFormId): Float32Array {
    const cached = this.cache.get(form);
    if (cached) return cached;
    const built = buildForm(form, this.count);
    if (built) {
      this.cache.set(form, built);
      return built;
    }
    // The wordmark needs the loaded font; stand in with the idle cloud
    // until setWordmark provides the real thing.
    return this.positionsFor("rest");
  }

  private layoutFor(
    form: FieldFormId,
    side: FieldSide | null,
    f: FieldFrame,
  ): Layout {
    const cfg = FIELD_FORMS[form];

    if (form === "wordmark" && f.anchor) {
      // Land exactly over the real heading.
      const perPx = (2 * f.halfH) / f.height;
      return {
        x: (f.anchor.cx - f.width / 2) * perPx,
        y: -(f.anchor.cy - f.scrollY - f.height / 2) * perPx,
        s: (f.anchor.w * perPx) / WORDMARK_UNITS,
        rx: 0,
        rz: 0,
      };
    }

    const placement = side ?? cfg.side;
    const wide = f.width / f.height > 1.15;
    const [ex, ey] = cfg.extent;
    let allowX: number;
    let allowY: number;
    let x = 0;
    let y = 0;
    if (wide) {
      allowX = placement === 0 ? f.halfW * 0.9 : f.halfW * 0.55;
      allowY = f.halfH * 0.9;
      x = placement * f.halfW * 0.43;
    } else {
      allowX = f.halfW * 0.88;
      allowY = placement === 0 ? f.halfH * 0.8 : f.halfH * 0.55;
      y = placement === 0 ? 0 : f.halfH * 0.3;
    }
    return {
      x,
      y,
      s: Math.min(cfg.scale, allowX / ex, allowY / ey),
      rx: cfg.tilt.x,
      rz: cfg.tilt.z,
    };
  }
}
