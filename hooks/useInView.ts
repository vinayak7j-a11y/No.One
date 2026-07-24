"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number;
  /** Once true, stop observing — an artifact that has arrived stays
   *  arrived rather than flickering back to rest on re-scroll. */
  once?: boolean;
}

/**
 * Reports whether an element has entered the viewport. This is the
 * mechanism behind No.One's "Arrival" state (Law of Attention): artifacts
 * stay at rest until intent — here, scroll proximity — brings them into
 * view. Deliberately generic so any future module's artifacts can use
 * the same primitive rather than each reimplementing scroll-reveal.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = "0px",
  threshold = 0.15,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, isInView };
}
