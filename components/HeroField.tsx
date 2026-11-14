'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/useInView';

/** Dot grid behind the hero. Dots near the pointer brighten and spread. */
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement!;
    if (!ctx) return;
    const gap = 26;
    let w = 0, h = 0, raf = 0, visible = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const k = Math.max(0, 1 - d / 170);
          const px = x + (k ? (dx / (d || 1)) * k * 6 : 0);
          const py = y + (k ? (dy / (d || 1)) * k * 6 : 0);
          ctx.fillStyle = k ? `rgba(80,97,58,${0.18 + k * 0.7})` : 'rgba(23,25,22,0.10)';
          const r = 0.9 + k * 1.6;
          ctx.fillRect(px - r / 2, py - r / 2, r, r);
        }
      }
    };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const loop = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.16;
      mouse.y += (mouse.ty - mouse.y) * 0.16;
      draw();
      raf = Math.abs(mouse.tx - mouse.x) > 0.5 || Math.abs(mouse.ty - mouse.y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      if (mouse.tx < -900) { mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { mouse.tx = mouse.ty = mouse.x = mouse.y = -999; draw(); };

    const interactive = !prefersReducedMotion() && matchMedia('(pointer: fine)').matches;
    let io: IntersectionObserver | undefined;
    if (interactive) {
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(hero);
    }
    let timer = 0;
    const onResize = () => { clearTimeout(timer); timer = window.setTimeout(size, 120); };
    addEventListener('resize', onResize);
    size();
    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      removeEventListener('resize', onResize);
      cancelAnimationFrame(raf); io?.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}
