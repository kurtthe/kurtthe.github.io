'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/useInView';

/** Page-wide enhancements: scroll progress bar and staggered reveal of content blocks. */
export default function Effects() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    document.body.classList.toggle('motion', !reduce);

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : '0');
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    update();

    const targets = document.querySelectorAll<HTMLElement>('.section-heading, .split > div, .project, .timeline > li, .credentials > div, .why-intro, .why li');
    targets.forEach(el => el.setAttribute('data-reveal', ''));
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io!.unobserve(el);
          const siblings = [...(el.parentElement?.children ?? [])].filter(c => c.hasAttribute('data-reveal'));
          el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 70}ms`;
          el.classList.add('in');
        });
      }, { threshold: 0.12 });
      targets.forEach(el => io!.observe(el));
    } else targets.forEach(el => el.classList.add('in'));

    return () => { removeEventListener('scroll', onScroll); io?.disconnect(); };
  }, []);

  return <div className="progress" aria-hidden="true"><span ref={bar} /></div>;
}
