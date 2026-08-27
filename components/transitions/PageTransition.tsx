"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PAGE_ORDER = ["/", ...NAV_ITEMS.map((item) => item.href)];
const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  ...Object.fromEntries(NAV_ITEMS.map((item) => [item.href, item.label])),
};

const SWIPE_THRESHOLD = 60;
const WHEEL_THRESHOLD = 35;
const TRANSITION_LOCK_MS = 650;
const LABEL_DURATION_MS = 600;

type Direction = 1 | -1;

const pageVariants: Variants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    y: direction === 1 ? 48 : -48,
    scale: 0.97,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 150, damping: 20, mass: 0.9 },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    y: direction === 1 ? -32 : 32,
    scale: 0.96,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  }),
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const [direction, setDirection] = useState<Direction>(1);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef<{
    y: number;
    atTop: boolean;
    atBottom: boolean;
  } | null>(null);

  function atTop() {
    return window.scrollY <= 2;
  }

  function atBottom() {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    );
  }

  function navigate(nextDirection: Direction) {
    const currentIndex = PAGE_ORDER.indexOf(pathname);
    if (currentIndex === -1) return;
    const nextIndex = currentIndex + nextDirection;
    if (nextIndex < 0 || nextIndex >= PAGE_ORDER.length) return;

    const nextHref = PAGE_ORDER[nextIndex];
    isTransitioningRef.current = true;
    setDirection(nextDirection);
    setPendingLabel(PAGE_LABELS[nextHref] ?? null);
    router.push(nextHref);

    window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, TRANSITION_LOCK_MS);

    window.setTimeout(() => {
      setPendingLabel(null);
    }, LABEL_DURATION_MS);
  }

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (isTransitioningRef.current) return;
      // MobileMenu and SearchPalette both lock body scroll this way
      // while open. Reusing that same flag here means a wheel scroll
      // over an open overlay can't trigger a navigation underneath it.
      if (document.body.style.overflow === "hidden") return;
      if (e.deltaY > WHEEL_THRESHOLD && atBottom()) {
        navigate(1);
      } else if (e.deltaY < -WHEEL_THRESHOLD && atTop()) {
        navigate(-1);
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        atTop: atTop(),
        atBottom: atBottom(),
      };
    }

    function handleTouchEnd(e: TouchEvent) {
      if (isTransitioningRef.current || !touchStartRef.current) return;
      if (document.body.style.overflow === "hidden") return;
      const endY = e.changedTouches[0].clientY;
      const delta = touchStartRef.current.y - endY;

      if (delta > SWIPE_THRESHOLD && touchStartRef.current.atBottom) {
        navigate(1);
      } else if (delta < -SWIPE_THRESHOLD && touchStartRef.current.atTop) {
        navigate(-1);
      }
      touchStartRef.current = null;
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const targetY =
      direction === 1 ? 0 : document.documentElement.scrollHeight;
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: "auto" });
    });
  }, [pathname, direction]);

  const currentIndex = PAGE_ORDER.indexOf(pathname);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {PAGE_ORDER.map((href, index) => (
          <div key={href} className="relative h-2 w-2">
            {index === currentIndex && (
              <motion.div
                layoutId="activePageDot"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div
              className={`absolute inset-0 rounded-full border ${
                index === currentIndex
                  ? "border-transparent"
                  : "border-foreground/30"
              }`}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {pendingLabel && (
          <motion.div
            key="page-label"
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <span
              className="font-semibold tracking-tight text-foreground/90"
              style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
            >
              {pendingLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative flex flex-1 flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
