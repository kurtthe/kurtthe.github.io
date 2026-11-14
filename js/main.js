/* Progressive enhancement only: every piece of content works without this file. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  document.body.classList.toggle('motion', !reduce.matches);

  /* ---------- Mobile menu ---------- */
  const header = document.querySelector('.site-header');
  const menu = header.querySelector('.menu');
  const nav = header.querySelector('#navigation');
  const mobile = matchMedia('(max-width: 800px)');
  const setMenuLabel = open => { menu.firstChild.textContent = open ? 'Close ' : 'Menu '; menu.lastElementChild.textContent = open ? '×' : '+'; };
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.hidden = mobile.matches; setMenuLabel(false); };
  const syncMenu = () => { menu.hidden = !mobile.matches; closeMenu(); };
  header.classList.add('enhanced');
  syncMenu();
  mobile.addEventListener('change', syncMenu);
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
    setMenuLabel(!open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a') && mobile.matches) closeMenu(); });
  header.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile.matches && !nav.hidden) { closeMenu(); menu.focus(); } });

  /* ---------- Brisbane clock (AEST, no daylight saving) ---------- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Brisbane' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Scroll progress ---------- */
  const bar = document.querySelector('.progress span');
  let ticking = false;
  const updateProgress = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();

  /* ---------- Decode effect for mono labels ---------- */
  const glyphs = '01/<>_—#=+*ABCDEFGHJKLMNPRSTUVXYZ';
  const decode = el => {
    const final = el.dataset.final;
    const visual = el.querySelector('[aria-hidden]');
    let frame = 0;
    const total = 18;
    const step = () => {
      frame++;
      const revealed = Math.floor((frame / total) * final.length);
      visual.textContent = final.split('').map((ch, i) => {
        if (i < revealed || ch === ' ') return ch;
        return glyphs[(Math.random() * glyphs.length) | 0];
      }).join('');
      if (frame < total) requestAnimationFrame(() => setTimeout(step, 28));
      else visual.textContent = final;
    };
    step();
  };
  const decodeEls = [...document.querySelectorAll('[data-decode]')];
  decodeEls.forEach(el => {
    const text = el.textContent;
    el.dataset.final = text;
    el.textContent = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
    const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true'); vis.textContent = text;
    el.append(sr, vis);
  });

  /* ---------- Count-up numbers ---------- */
  const countUp = el => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1100;
    const frame = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  /* ---------- Reveal on scroll, active nav ---------- */
  const revealTargets = document.querySelectorAll('.section-heading, .split > div, .project, .timeline > li, .credentials > div, .why-intro, .why li');
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('a')];
    const navObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -45% 0px' });
    document.querySelectorAll('main > section[id]').forEach(s => navObserver.observe(s));

    const once = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        once.unobserve(el);
        if (el.hasAttribute('data-reveal')) {
          const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
          el.style.transitionDelay = Math.min(siblings.indexOf(el), 4) * 70 + 'ms';
          el.classList.add('in');
        }
        if (!reduce.matches && el.dataset.final) decode(el);
        if (!reduce.matches && el.dataset.count) countUp(el);
      });
    }, { threshold: .12 });
    revealTargets.forEach(el => once.observe(el));
    decodeEls.forEach(el => once.observe(el));
    document.querySelectorAll('[data-count]').forEach(el => once.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  /* ---------- Hero dot field ---------- */
  const canvas = document.querySelector('.field');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const gap = 26;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const radius = 170;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const k = Math.max(0, 1 - d / radius);
          const px = x + (k ? (dx / (d || 1)) * k * 6 : 0);
          const py = y + (k ? (dy / (d || 1)) * k * 6 : 0);
          ctx.fillStyle = k ? `rgba(80,97,58,${0.18 + k * 0.7})` : 'rgba(23,25,22,0.10)';
          const r = 0.9 + k * 1.6;
          ctx.fillRect(px - r / 2, py - r / 2, r, r);
        }
      }
    };
    const loop = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.16;
      mouse.y += (mouse.ty - mouse.y) * 0.16;
      draw();
      if (Math.abs(mouse.tx - mouse.x) > 0.5 || Math.abs(mouse.ty - mouse.y) > 0.5) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };

    if (!reduce.matches && finePointer.matches) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        if (mouse.tx < -900) { mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }
        mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
        kick();
      });
      hero.addEventListener('pointerleave', () => { mouse.tx = mouse.ty = -999; mouse.x = mouse.y = -999; draw(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    }
    let resizeTimer;
    addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(size, 120); });
    size();
  }

  /* ---------- Role fit tabs (ARIA tabs pattern) ---------- */
  const tabsRoot = document.querySelector('[data-tabs]');
  if (tabsRoot) {
    const tablist = tabsRoot.querySelector('[role="tablist"]');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    tablist.hidden = false;
    tabsRoot.classList.add('enhanced');
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    panels.forEach(p => p.tabIndex = 0);
    select(0);

    /* Filter chips */
    const chips = tabsRoot.querySelector('.chips');
    const items = [...tabsRoot.querySelectorAll('.reqs > li')];
    const out = {
      count: tabsRoot.querySelector('[data-fit-count]'),
      direct: tabsRoot.querySelector('[data-fit-direct]'),
      transfer: tabsRoot.querySelector('[data-fit-transfer]')
    };
    const applyFilter = f => {
      let shown = 0, direct = 0, transfer = 0;
      items.forEach(li => {
        const show = f === 'all' || li.dataset.type === f;
        li.hidden = !show;
        if (show) { shown++; li.dataset.status === 'direct' ? direct++ : transfer++; }
      });
      out.count.textContent = shown; out.direct.textContent = direct; out.transfer.textContent = transfer;
    };
    chips.hidden = false;
    chips.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      chips.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      applyFilter(b.dataset.filter);
    });
    applyFilter('all');
  }

  /* ---------- Helper: run once when an element scrolls into view ---------- */
  const whenVisible = (el, fn, threshold = .3) => {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold });
    io.observe(el);
  };

  /* ---------- Hero code editor: types the snippet, then the preview fills in ---------- */
  const editor = document.querySelector('[data-editor]');
  if (editor && !reduce.matches) {
    const code = editor.querySelector('code');
    const tokens = [...code.childNodes].map(n => ({ cls: n.nodeType === 1 ? n.className : '', text: n.textContent }));
    const marks = [['role="Front End"', 'role'], ['city="Brisbane"', 'city'], ["'React'", 'react'], ["'Next.js'", 'next'], ["'RN'", 'rn'], ['a11y="WCAG"', 'wcag']];
    const parts = editor.querySelectorAll('.dev-card [data-p]');
    parts.forEach(el => el.classList.add('pending'));
    code.textContent = '';
    const caret = document.createElement('span'); caret.className = 'caret';
    code.append(caret);
    let typed = '';
    const type = () => {
      let t = 0, i = 0, node = null;
      const tick = () => {
        if (t >= tokens.length) return;
        const tok = tokens[t];
        if (!node) { node = tok.cls ? Object.assign(document.createElement('span'), { className: tok.cls }) : document.createTextNode(''); code.insertBefore(node, caret); }
        const ch = tok.text[i++];
        node.textContent += ch; typed += ch;
        marks.forEach(([m, key]) => { if (typed.endsWith(m)) editor.querySelector(`[data-p="${key}"]`).classList.remove('pending'); });
        if (i >= tok.text.length) { t++; i = 0; node = null; }
        if (t < tokens.length) setTimeout(tick, ch === '\n' ? 140 : 18 + Math.random() * 30);
        else setTimeout(() => caret.remove(), 2400);
      };
      tick();
    };
    whenVisible(editor, () => setTimeout(type, 500), .4);
  }

  /* ---------- Screen galleries: reveal + prev/next buttons ---------- */
  document.querySelectorAll('.gallery-wrap').forEach(wrap => {
    const g = wrap.querySelector('.gallery');
    whenVisible(g, () => g.classList.add('in'), .15);
    const nav = wrap.querySelector('.gallery-nav');
    const btns = nav.querySelectorAll('button');
    const sync = () => {
      const last = g.lastElementChild;
      const overflow = last.offsetLeft + last.offsetWidth - g.offsetLeft > g.clientWidth + 4;
      nav.hidden = !overflow;
      btns[0].disabled = g.scrollLeft < 4;
      btns[1].disabled = g.scrollLeft > g.scrollWidth - g.clientWidth - 4;
    };
    btns.forEach(b => b.addEventListener('click', () => {
      const step = g.querySelector('li').getBoundingClientRect().width + 18;
      g.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduce.matches ? 'auto' : 'smooth' });
    }));
    g.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync);
    if (document.readyState === 'complete') sync(); else addEventListener('load', sync);
    sync();
  });

  /* ---------- Trak release pipeline ---------- */
  const pipe = document.querySelector('[data-pipeline]');
  if (pipe) {
    const run = pipe.querySelector('.run');
    const play = () => { pipe.classList.remove('running'); void pipe.offsetWidth; pipe.classList.add('running'); };
    if (!reduce.matches) {
      run.hidden = false;
      run.addEventListener('click', play);
      whenVisible(pipe, play, .6);
    }
  }

  /* ---------- Flashing Designer sketch ---------- */
  const flash = document.querySelector('[data-flash]');
  if (flash) {
    flash.hidden = false;
    const svg = flash.querySelector('svg');
    const shape = svg.querySelector('.shape'), paint = svg.querySelector('.paint'), labels = svg.querySelector('.labels');
    const inputs = { a: flash.querySelector('#fA'), b: flash.querySelector('#fB'), c: flash.querySelector('#fC'), t: flash.querySelector('#fT') };
    const out = k => flash.querySelector(`[data-o="${k}"]`);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, text) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; };
    const draw = () => {
      const a = +inputs.a.value, b = +inputs.b.value, c = +inputs.c.value, t = +inputs.t.value;
      const phi = (180 - t) * Math.PI / 180;
      // Profile in millimetres: A goes down, B goes right, C leaves B at the chosen bend angle.
      const P = [[0, 0], [0, a], [b, a], [b + Math.cos(phi) * c, a + Math.sin(phi) * c]];
      const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const W = 400, H = 240, pad = 50;
      const k = Math.min((W - pad * 2) / (maxX - minX || 1), (H - pad * 2) / (maxY - minY || 1));
      const ox = (W - (maxX - minX) * k) / 2 - minX * k, oy = (H - (maxY - minY) * k) / 2 - minY * k;
      const S = P.map(([x, y]) => [ox + x * k, oy + y * k]);
      shape.setAttribute('points', S.map(p => p.join(',')).join(' '));
      // Painted side: the same profile offset 5px along each segment's normal, mitred at the bends.
      const N = S.slice(1).map((q, i) => { const dx = q[0] - S[i][0], dy = q[1] - S[i][1], L = Math.hypot(dx, dy) || 1; return [dy / L, -dx / L]; });
      const off = 5;
      const O = S.map((p, i) => {
        if (i === 0) return [p[0] + N[0][0] * off, p[1] + N[0][1] * off];
        if (i === S.length - 1) return [p[0] + N[i - 1][0] * off, p[1] + N[i - 1][1] * off];
        const m = [N[i - 1][0] + N[i][0], N[i - 1][1] + N[i][1]], ml = Math.hypot(...m) || 1;
        const cos = (m[0] * N[i][0] + m[1] * N[i][1]) / ml;
        return [p[0] + m[0] / ml * off / cos, p[1] + m[1] / ml * off / cos];
      });
      paint.setAttribute('points', O.map(p => p.join(',')).join(' '));
      labels.replaceChildren();
      const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const [mA, mB, mC] = [mid(S[0], S[1]), mid(S[1], S[2]), mid(S[2], S[3])];
      labels.append(
        el('text', { x: mA[0] - 14, y: mA[1] + 4, 'text-anchor': 'end', class: 'dim' }, `A ${a}`),
        el('text', { x: mB[0], y: mB[1] + 22, 'text-anchor': 'middle', class: 'dim' }, `B ${b}`),
        el('text', { x: mC[0] + 12, y: mC[1] + 4, class: 'dim' }, `C ${c}`),
        el('text', { x: S[1][0] + 10, y: S[1][1] - 10 }, '90°'),
        el('text', { x: S[2][0] - 10, y: S[2][1] - 10, 'text-anchor': 'end' }, `${t}°`),
        el('circle', { cx: S[0][0], cy: S[0][1], r: 4 }),
        el('circle', { cx: S[3][0], cy: S[3][1], r: 4 })
      );
      out('a').textContent = `${a} mm`; out('b').textContent = `${b} mm`; out('c').textContent = `${c} mm`; out('t').textContent = `${t}°`;
      out('girth').textContent = `${a + b + c} mm`;
    };
    Object.values(inputs).forEach(i => i.addEventListener('input', draw));
    draw();
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.querySelector('[data-copy]');
  const copyStatus = document.querySelector('.copy-status');
  if (copyBtn) {
    copyBtn.hidden = false;
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyStatus.textContent = 'Email address copied';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('.email'));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        copyStatus.textContent = 'Address selected. Press Ctrl+C or ⌘C to copy';
      }
      setTimeout(() => { copyStatus.textContent = ''; }, 3500);
    });
  }

  /* ---------- Print as résumé: open every disclosure, then restore ---------- */
  const printBtn = document.querySelector('[data-print]');
  let reopened = [];
  addEventListener('beforeprint', () => {
    reopened = [...document.querySelectorAll('details:not([open])')];
    reopened.forEach(d => d.open = true);
  });
  addEventListener('afterprint', () => { reopened.forEach(d => d.open = false); reopened = []; });
  if (printBtn) { printBtn.hidden = false; printBtn.addEventListener('click', () => print()); }
})();
