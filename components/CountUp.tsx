'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

export default function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.5);
  const [n, setN] = useState(to);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const start = performance.now(), dur = 1100;
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{n}</span>;
}
