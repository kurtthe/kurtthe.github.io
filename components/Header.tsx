'use client';
import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work', sup: '03' },
  { href: '#experience', label: 'Experience' },
  { href: '#fit', label: 'Role fit' },
  { href: '#contact', label: 'Let’s talk ↗' },
];

const brisbaneTime = new Intl.DateTimeFormat('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Brisbane' });

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('--:--');
  const [active, setActive] = useState('');
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = matchMedia('(max-width: 800px)');
    const sync = () => { setMobile(mq.matches); setOpen(false); };
    sync();
    mq.addEventListener('change', sync);
    const tick = () => setTime(brisbaneTime.format(new Date()));
    tick();
    const t = setInterval(tick, 15000);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); });
    }, { rootMargin: '-15% 0px -45% 0px' });
    document.querySelectorAll('main > section[id]').forEach(s => io.observe(s));
    return () => { mq.removeEventListener('change', sync); clearInterval(t); io.disconnect(); };
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className="site-header enhanced"
      onKeyDown={e => { if (e.key === 'Escape' && mobile && open) { close(); menuBtn.current?.focus(); } }}
    >
      <a className="brand" href="#top" aria-label="Jefferson Solano, back to top">JS<span>®</span></a>
      <span className="edition">BEYOND THE CV<br />A DIGITAL EXHIBITION</span>
      <span className="clock mono" aria-hidden="true"><i className="dot" />BNE <time>{time}</time> AEST</span>
      <button
        ref={menuBtn}
        className="menu"
        type="button"
        aria-expanded={open}
        aria-controls="navigation"
        hidden={!mobile}
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Close ' : 'Menu '}<span aria-hidden="true">{open ? '×' : '+'}</span>
      </button>
      <nav id="navigation" aria-label="Main navigation" hidden={mobile && !open}>
        {links.map(l => (
          <a key={l.href} href={l.href} aria-current={active === l.href ? 'location' : undefined} onClick={() => mobile && close()}>
            {l.label}{l.sup && <> <sup>{l.sup}</sup></>}
          </a>
        ))}
      </nav>
    </header>
  );
}
