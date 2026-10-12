import { FIELD_CAMERA_Z, FIELD_FORMS, FIELD_FOV, WORDMARK_UNITS } from "@/config/field";
import type { FieldAnchorRect } from "@/lib/field/anchor";
import { buildForm } from "@/lib/field/forms";
import {
  compile,
  lerpRgb,
  modelView,
  parseHex,
  perspective,
  uniformMap,
  type Rgb,
} from "@/lib/field/gl";
import {
  dustFragmentShader,
  dustVertexShader,
  fieldFragmentShader,
  fieldVertexShader,
} from "@/lib/field/shaders";
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
  /** 0 (cloud drifting apart) to 1 (shape fully gathered). */
  assemble: number;
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
 * The living field, written directly against WebGL2 so the whole thing
 * costs a few kilobytes instead of a rendering library. Kept as a plain
 * class so the physics lives outside React: the canvas component creates
 * one, calls `setTarget` when attention changes, and calls `update` then
 * `draw` each frame. Everything that moves (morphing, layout, colour,
 * pointer, scroll, the burst spring) is damped here, so a change of mind
 * mid-morph never produces a jump.
 */
export class FieldEngine {
  readonly count: number;

  private readonly gl: WebGL2RenderingContext;
  private readonly canvas: HTMLCanvasElement;

  private readonly program: WebGLProgram;
  private readonly loc: (name: string) => WebGLUniformLocation | null;
  private readonly vao: WebGLVertexArrayObject;
  private readonly bufFrom: WebGLBuffer;
  private readonly bufTo: WebGLBuffer;
  private readonly bufRand: WebGLBuffer;

  private readonly dustProgram: WebGLProgram;
  private readonly dustLoc: (name: string) => WebGLUniformLocation | null;
  private readonly dustVao: WebGLVertexArrayObject;
  private readonly dustBuf: WebGLBuffer;
  private readonly dustCount: number;

  private readonly cache = new Map<FieldFormId, Float32Array>();
  private fromArr: Float32Array;
  private toArr: Float32Array;
  private toForm: FieldFormId = "rest";
  private toSide: FieldSide | null = null;
  private progress = 1;

  private theme: Theme = "dark";
  private readonly background: Rgb = [0, 0, 0];
  private readonly backgroundTarget: Rgb = [0, 0, 0];
  private readonly colA: Rgb = [1, 1, 1];
  private readonly colB: Rgb = [1, 1, 1];
  private colTargetA: Rgb = [1, 1, 1];
  private colTargetB: Rgb = [1, 1, 1];
  private dustColor: Rgb = [0.63, 0.63, 0.67];

  private readonly lay: Layout = { x: 0, y: 0, s: 1, rx: 0, rz: 0 };
  private spinRate = 0;
  private autoRot = 0;
  private jitter = 1;
  private flow = 1;
  private size = 1;
  private dim = 1;
  private assemble = 1;

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
  private drawCount: number;

  // Per-frame values handed from update() to draw().
  private readonly proj = new Float32Array(16);
  private readonly mvBody = new Float32Array(16);
  private readonly mvDust = new Float32Array(16);
  private uSize = 1;
  private uPx = 1;
  private uTime = 0;
  private uMouse: [number, number] = [99, 99];
  private dustAlpha = 0.5;
  private uAlpha = 0.5;

  constructor(canvas: HTMLCanvasElement, count: number) {
    this.canvas = canvas;
    this.count = count;
    this.drawCount = count;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 is not available");
    this.gl = gl;

    // --- Particles -------------------------------------------------------
    this.program = compile(gl, fieldVertexShader, fieldFragmentShader);
    this.loc = uniformMap(gl, this.program);

    this.fromArr = this.positionsFor("rest");
    this.toArr = this.fromArr;

    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();

    const vao = gl.createVertexArray();
    const bufFrom = gl.createBuffer();
    const bufTo = gl.createBuffer();
    const bufRand = gl.createBuffer();
    if (!vao || !bufFrom || !bufTo || !bufRand) {
      throw new Error("Could not allocate WebGL buffers");
    }
    this.vao = vao;
    this.bufFrom = bufFrom;
    this.bufTo = bufTo;
    this.bufRand = bufRand;

    gl.bindVertexArray(vao);
    this.bindAttribute(this.program, "aFrom", bufFrom, 3, this.fromArr);
    this.bindAttribute(this.program, "aTo", bufTo, 3, this.toArr);
    this.bindAttribute(this.program, "aRand", bufRand, 4, rand);

    // --- Far dust --------------------------------------------------------
    this.dustCount = Math.min(2000, Math.round(count / 14));
    const dust = new Float32Array(this.dustCount * 3);
    for (let i = 0; i < this.dustCount; i++) {
      const r = 9 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dust[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dust[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      dust[i * 3 + 2] = r * Math.cos(phi) - 6;
    }
    this.dustProgram = compile(gl, dustVertexShader, dustFragmentShader);
    this.dustLoc = uniformMap(gl, this.dustProgram);
    const dustVao = gl.createVertexArray();
    const dustBuf = gl.createBuffer();
    if (!dustVao || !dustBuf) throw new Error("Could not allocate WebGL buffers");
    this.dustVao = dustVao;
    this.dustBuf = dustBuf;
    gl.bindVertexArray(dustVao);
    this.bindAttribute(this.dustProgram, "aPos", dustBuf, 3, dust);
    gl.bindVertexArray(null);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    this.setBlend(true);
  }

  /** Kick the intro: particles start flung outward and fall into place. */
  intro(strength = 2.6) {
    this.burst = strength;
    this.burstVel = 0;
  }

  /** Size the drawing buffer. Call on resize and when the pixel ratio changes. */
  resize(cssWidth: number, cssHeight: number, dpr: number) {
    const w = Math.max(1, Math.floor(cssWidth * dpr));
    const h = Math.max(1, Math.floor(cssHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
    this.uPx = dpr;
    perspective(this.proj, (FIELD_FOV * Math.PI) / 180, cssWidth / cssHeight, 0.1, 60);
  }

  setTheme(theme: Theme, background: string) {
    this.theme = theme;
    const bg = parseHex(background);
    this.backgroundTarget[0] = bg[0];
    this.backgroundTarget[1] = bg[1];
    this.backgroundTarget[2] = bg[2];
    const dark = theme === "dark";
    this.setBlend(dark);
    // Light theme paints dark ink on white, which reads thinner than light
    // on black, so it gets more opacity and a slightly bolder point.
    this.uAlpha = (dark ? 0.5 : 0.9) * Math.pow(36000 / this.count, 0.6);
    this.lightBoost = dark ? 1 : 1.25;
    this.dustColor = parseHex(dark ? "#a1a1aa" : "#52525b");
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
    this.drawCount = Math.max(1, Math.floor(this.count * fraction));
  }

  /** True when nothing is moving, so the loop can idle at a lower rate. */
  isSettled() {
    return (
      this.progress >= 1 &&
      Math.abs(this.burst) < 0.004 &&
      Math.abs(this.burstVel) < 0.02 &&
      this.agitate < 0.02
    );
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
    this.assemble += (f.assemble - this.assemble) * damp(5);

    // Colour and background.
    const palette = cfg[this.theme];
    this.colTargetA = parseHex(palette[0]);
    this.colTargetB = parseHex(palette[1]);
    if (!this.started) {
      for (let i = 0; i < 3; i++) {
        this.colA[i] = this.colTargetA[i];
        this.colB[i] = this.colTargetB[i];
        this.background[i] = this.backgroundTarget[i];
      }
    }
    const ck = damp(2.2);
    lerpRgb(this.colA, this.colTargetA, ck);
    lerpRgb(this.colB, this.colTargetB, ck);
    lerpRgb(this.background, this.backgroundTarget, damp(6));

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
    modelView(
      this.mvBody,
      this.lay.x,
      this.lay.y,
      -this.agitate * 0.9 - FIELD_CAMERA_Z,
      this.lay.rx - this.sy * 0.12 * parallax,
      this.autoRot + f.scrollY * 0.0003 * parallax + this.sx * 0.25 * parallax,
      this.lay.rz,
      this.lay.s,
    );

    // Dust: slow orbit, opposite parallax to the form, and a scroll drift.
    const dustSpin = f.reduced ? 0 : f.time * 0.012;
    modelView(
      this.mvDust,
      -this.sx * 0.5,
      (f.scrollY / Math.max(f.height, 1)) * 0.35,
      -FIELD_CAMERA_Z,
      this.sy * 0.05,
      dustSpin,
      0,
      1,
    );
    this.dustAlpha = (this.theme === "dark" ? 0.5 : 0.35) * (0.4 + 0.6 * this.dim);

    this.uTime = f.time;
    this.uSize =
      1.65 *
      this.lightBoost *
      this.size *
      Math.max(0.75, Math.min(1.35, f.height / 900));
    this.uMouse = active ? [this.mx * f.halfW, this.my * f.halfH] : [99, 99];

    this.started = true;
  }

  draw() {
    const gl = this.gl;
    gl.clearColor(this.background[0], this.background[1], this.background[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Far dust first, so the form always draws over it.
    gl.useProgram(this.dustProgram);
    gl.bindVertexArray(this.dustVao);
    const dl = this.dustLoc;
    gl.uniformMatrix4fv(dl("uProj"), false, this.proj);
    gl.uniformMatrix4fv(dl("uMV"), false, this.mvDust);
    gl.uniform1f(dl("uSize"), 5);
    gl.uniform1f(dl("uPx"), this.uPx);
    gl.uniform3f(dl("uColor"), this.dustColor[0], this.dustColor[1], this.dustColor[2]);
    gl.uniform1f(dl("uAlpha"), this.dustAlpha);
    gl.drawArrays(gl.POINTS, 0, this.dustCount);

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    const l = this.loc;
    gl.uniformMatrix4fv(l("uProj"), false, this.proj);
    gl.uniformMatrix4fv(l("uMV"), false, this.mvBody);
    gl.uniform1f(l("uT"), this.progress);
    gl.uniform1f(l("uTime"), this.uTime);
    gl.uniform1f(l("uSize"), this.uSize);
    gl.uniform1f(l("uPx"), this.uPx);
    gl.uniform1f(l("uBurst"), this.burst);
    gl.uniform1f(l("uJitter"), this.jitter);
    gl.uniform1f(l("uFlow"), this.flow);
    gl.uniform1f(l("uAgitate"), this.agitate);
    gl.uniform1f(l("uAssemble"), this.assemble);
    gl.uniform3f(l("uMouse"), this.uMouse[0], this.uMouse[1], -7);
    gl.uniform3f(l("uColA"), this.colA[0], this.colA[1], this.colA[2]);
    gl.uniform3f(l("uColB"), this.colB[0], this.colB[1], this.colB[2]);
    gl.uniform1f(l("uAlpha"), this.uAlpha);
    gl.uniform1f(l("uDim"), this.dim);
    gl.uniform1f(l("uLight"), this.theme === "dark" ? 0 : 1);
    gl.drawArrays(gl.POINTS, 0, this.drawCount);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteBuffer(this.bufFrom);
    gl.deleteBuffer(this.bufTo);
    gl.deleteBuffer(this.bufRand);
    gl.deleteBuffer(this.dustBuf);
    gl.deleteVertexArray(this.vao);
    gl.deleteVertexArray(this.dustVao);
    gl.deleteProgram(this.program);
    gl.deleteProgram(this.dustProgram);
    // No loseContext(): Strict Mode re-mounts on the same canvas.
    this.cache.clear();
  }

  private setBlend(additive: boolean) {
    const gl = this.gl;
    if (additive) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  private bindAttribute(
    program: WebGLProgram,
    name: string,
    buffer: WebGLBuffer,
    size: number,
    data: Float32Array,
  ) {
    const gl = this.gl;
    const location = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  private upload(buffer: WebGLBuffer, data: Float32Array) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
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
    this.upload(this.bufFrom, this.fromArr);
    this.upload(this.bufTo, this.toArr);
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

  /**
   * Where the form belongs on screen: over the real heading for the
   * wordmark, otherwise fitted into the part of the screen the copy leaves
   * free.
   */
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
        y: -(f.anchor.cy + f.anchor.dy - f.scrollY - f.height / 2) * perPx,
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
