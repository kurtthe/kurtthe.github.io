(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  document.body.classList.toggle("motion", !reduce.matches);

  /* ---------- Mobile menu ---------- */
  const header = document.querySelector(".site-header");
  const menu = header.querySelector(".menu");
  const nav = header.querySelector("#navigation");
  const mobile = matchMedia("(max-width: 800px)");
  const setMenuLabel = (open) => {
    menu.firstChild.textContent = open ? "Close " : "Menu ";
    menu.lastElementChild.textContent = open ? "×" : "+";
  };
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    nav.hidden = mobile.matches;
    setMenuLabel(false);
  };
  const syncMenu = () => {
    menu.hidden = !mobile.matches;
    closeMenu();
  };
  header.classList.add("enhanced");
  syncMenu();
  mobile.addEventListener("change", syncMenu);
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));
    nav.hidden = open;
    setMenuLabel(!open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a") && mobile.matches) closeMenu();
  });
  header.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobile.matches && !nav.hidden) {
      closeMenu();
      menu.focus();
    }
  });

  /* ---------- Brisbane clock (AEST, no daylight saving) ---------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Australia/Brisbane",
    });
    const tick = () => {
      clock.textContent = fmt.format(new Date());
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Scroll progress ---------- */
  const bar = document.querySelector(".progress span");
  let ticking = false;
  const updateProgress = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.setProperty(
      "--p",
      max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0,
    );
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true },
  );
  updateProgress();

  /* ---------- Decode effect for mono labels ---------- */
  const glyphs = "01/<>_—#=+*ABCDEFGHJKLMNPRSTUVXYZ";
  const decode = (el) => {
    const final = el.dataset.final;
    const visual = el.querySelector("[aria-hidden]");
    let frame = 0;
    const total = 18;
    const step = () => {
      frame++;
      const revealed = Math.floor((frame / total) * final.length);
      visual.textContent = final
        .split("")
        .map((ch, i) => {
          if (i < revealed || ch === " ") return ch;
          return glyphs[(Math.random() * glyphs.length) | 0];
        })
        .join("");
      if (frame < total) requestAnimationFrame(() => setTimeout(step, 28));
      else visual.textContent = final;
    };
    step();
  };
  const decodeEls = [...document.querySelectorAll("[data-decode]")];
  decodeEls.forEach((el) => {
    const text = el.textContent;
    el.dataset.final = text;
    el.textContent = "";
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    vis.textContent = text;
    el.append(sr, vis);
  });

  /* ---------- Count-up numbers ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1100;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  /* ---------- Reveal on scroll, active nav ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-heading, .split > div, .project, .timeline > li, .credentials > div, .why-intro, .why li, .portrait",
  );
  revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll("a")];
    const navObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-15% 0px -45% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((s) => navObserver.observe(s));

    const once = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          once.unobserve(el);
          if (el.hasAttribute("data-reveal")) {
            const siblings = [...el.parentElement.children].filter((c) =>
              c.hasAttribute("data-reveal"),
            );
            el.style.transitionDelay =
              Math.min(siblings.indexOf(el), 4) * 70 + "ms";
            el.classList.add("in");
          }
          if (!reduce.matches && el.dataset.final) decode(el);
          if (!reduce.matches && el.dataset.count) countUp(el);
        });
      },
      { threshold: 0.12 },
    );
    revealTargets.forEach((el) => once.observe(el));
    decodeEls.forEach((el) => once.observe(el));
    document.querySelectorAll("[data-count]").forEach((el) => once.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Hero dot field ---------- */
  const canvas = document.querySelector(".field");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;
    const gap = 26;
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      visible = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const radius = 170;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x,
            dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const k = Math.max(0, 1 - d / radius);
          const px = x + (k ? (dx / (d || 1)) * k * 6 : 0);
          const py = y + (k ? (dy / (d || 1)) * k * 6 : 0);
          ctx.fillStyle = k
            ? `rgba(80,97,58,${0.18 + k * 0.7})`
            : "rgba(23,25,22,0.10)";
          const r = 0.9 + k * 1.6;
          ctx.fillRect(px - r / 2, py - r / 2, r, r);
        }
      }
    };
    const loop = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.16;
      mouse.y += (mouse.ty - mouse.y) * 0.16;
      draw();
      if (
        Math.abs(mouse.tx - mouse.x) > 0.5 ||
        Math.abs(mouse.ty - mouse.y) > 0.5
      )
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    if (!reduce.matches && finePointer.matches) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        if (mouse.tx < -900) {
          mouse.x = e.clientX - r.left;
          mouse.y = e.clientY - r.top;
        }
        mouse.tx = e.clientX - r.left;
        mouse.ty = e.clientY - r.top;
        kick();
      });
      hero.addEventListener("pointerleave", () => {
        mouse.tx = mouse.ty = -999;
        mouse.x = mouse.y = -999;
        draw();
      });
      if ("IntersectionObserver" in window)
        new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
        }).observe(hero);
    }
    let resizeTimer;
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(size, 120);
    });
    size();
  }

  /* ---------- Role fit tabs (ARIA tabs pattern) ---------- */
  const tabsRoot = document.querySelector("[data-tabs]");
  if (tabsRoot) {
    const tablist = tabsRoot.querySelector('[role="tablist"]');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) =>
      document.getElementById(t.getAttribute("aria-controls")),
    );
    tablist.hidden = false;
    tabsRoot.classList.add("enhanced");
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        let n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
    panels.forEach((p) => (p.tabIndex = 0));
    select(0);

    /* Filter chips */
    const chips = tabsRoot.querySelector(".chips");
    const items = [...tabsRoot.querySelectorAll(".reqs > li")];
    const out = {
      count: tabsRoot.querySelector("[data-fit-count]"),
      direct: tabsRoot.querySelector("[data-fit-direct]"),
      transfer: tabsRoot.querySelector("[data-fit-transfer]"),
    };
    const applyFilter = (f) => {
      let shown = 0,
        direct = 0,
        transfer = 0;
      items.forEach((li) => {
        const show = f === "all" || li.dataset.type === f;
        li.hidden = !show;
        if (show) {
          shown++;
          li.dataset.status === "direct" ? direct++ : transfer++;
        }
      });
      out.count.textContent = shown;
      out.direct.textContent = direct;
      out.transfer.textContent = transfer;
    };
    chips.hidden = false;
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      chips
        .querySelectorAll("button")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      applyFilter(b.dataset.filter);
    });
    applyFilter("all");
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.querySelector("[data-copy]");
  const copyStatus = document.querySelector(".copy-status");
  if (copyBtn) {
    copyBtn.hidden = false;
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyStatus.textContent = "Email address copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector(".email"));
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyStatus.textContent = "Address selected. Press Ctrl+C or ⌘C to copy";
      }
      setTimeout(() => {
        copyStatus.textContent = "";
      }, 3500);
    });
  }

  /* ---------- Print as résumé: open every disclosure, then restore ---------- */
  const printBtn = document.querySelector("[data-print]");
  let reopened = [];
  addEventListener("beforeprint", () => {
    reopened = [...document.querySelectorAll("details:not([open])")];
    reopened.forEach((d) => (d.open = true));
  });
  addEventListener("afterprint", () => {
    reopened.forEach((d) => (d.open = false));
    reopened = [];
  });
  if (printBtn) {
    printBtn.hidden = false;
    printBtn.addEventListener("click", () => print());
  }
})();
