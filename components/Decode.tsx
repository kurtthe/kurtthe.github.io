'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const glyphs = '01/<>_—#=+*ABCDEFGHJKLMNPRSTUVXYZ';

/** Mono label that "decodes" into place. Screen readers get the real text only. */
export default function Decode({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.5);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let frame = 0, timer = 0;
    const total = 18;
    const step = () => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length);
      setShown(text.split('').map((ch, i) => (i < revealed || ch === ' ' ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join(''));
      if (frame < total) timer = window.setTimeout(step, 32); else setShown(text);
    };
    step();
    return () => clearTimeout(timer);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
