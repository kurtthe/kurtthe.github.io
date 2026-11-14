'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Screen } from '@/data/content';
import { asset } from '@/lib/asset';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

export default function Gallery({ label, screens }: { label: string; screens: Screen[] }) {
  const list = useRef<HTMLUListElement>(null);
  const inView = useInView(list, 0.15);
  const [nav, setNav] = useState({ overflow: false, start: true, end: false });

  const sync = useCallback(() => {
    const g = list.current;
    if (!g || !g.lastElementChild) return;
    const last = g.lastElementChild as HTMLElement;
    setNav({
      overflow: last.offsetLeft + last.offsetWidth - g.offsetLeft > g.clientWidth + 4,
      start: g.scrollLeft < 4,
      end: g.scrollLeft > g.scrollWidth - g.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    sync();
    addEventListener('resize', sync);
    addEventListener('load', sync);
    return () => { removeEventListener('resize', sync); removeEventListener('load', sync); };
  }, [sync]);

  const scroll = (dir: number) => {
    const g = list.current!;
    const step = (g.firstElementChild as HTMLElement).getBoundingClientRect().width + 18;
    g.scrollBy({ left: step * dir, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className="gallery-wrap">
      <ul ref={list} className={inView ? 'gallery in' : 'gallery'} role="list" tabIndex={0} aria-label={label} onScroll={() => requestAnimationFrame(sync)}>
        {screens.map(s => (
          <li key={s.file}>
            <img src={asset(`/assets/work/${s.file}.webp`)} alt={s.alt} width={520} height={1133} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <div className="gallery-nav mono" hidden={!nav.overflow}>
        <button type="button" aria-label="Previous screens" disabled={nav.start} onClick={() => scroll(-1)}>←</button>
        <button type="button" aria-label="Next screens" disabled={nav.end} onClick={() => scroll(1)}>→</button>
      </div>
    </div>
  );
}
