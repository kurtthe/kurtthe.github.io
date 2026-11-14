'use client';
import { RefObject, useEffect, useState } from 'react';

/** True once the element has scrolled into view (and stays true). */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, inView]);
  return inView;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
