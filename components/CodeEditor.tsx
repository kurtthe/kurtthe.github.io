'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

type Token = [cls: string, text: string];

// The snippet, as syntax-highlighted tokens.
const tokens: Token[] = [
  ['k', 'const'], ['', ' '], ['f', 'Jefferson'], ['', ' = () => (\n  <'], ['t', 'Developer'],
  ['', '\n    '], ['a', 'role'], ['', '='], ['s', '"Front End"'],
  ['', '\n    '], ['a', 'city'], ['', '='], ['s', '"Brisbane"'],
  ['', '\n    '], ['a', 'stack'], ['', '={['], ['s', "'React'"], ['', ', '], ['s', "'Next.js'"], ['', ', '], ['s', "'RN'"], ['', ']}'],
  ['', '\n    '], ['a', 'a11y'], ['', '='], ['s', '"WCAG"'],
  ['', '\n  />\n);'],
];
const source = tokens.map(t => t[1]).join('');

// Each preview element appears once its prop has been typed.
const marks: Record<string, string> = {
  role: 'role="Front End"', city: 'city="Brisbane"', react: "'React'", next: "'Next.js'", rn: "'RN'", wcag: 'a11y="WCAG"',
};

export default function CodeEditor() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.4);
  const [count, setCount] = useState(source.length); // fully typed on the server and without JS
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setCount(0);
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let i = 0, timer = 0;
    setTyping(true);
    const tick = () => {
      i++;
      setCount(i);
      if (i < source.length) timer = window.setTimeout(tick, source[i - 1] === '\n' ? 140 : 18 + Math.random() * 30);
      else timer = window.setTimeout(() => setTyping(false), 2400);
    };
    timer = window.setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [inView]);

  const typed = source.slice(0, count);
  const pending = (key: string) => (typed.includes(marks[key]) ? undefined : 'pending');

  let used = 0;
  const rendered = tokens.map(([cls, text], i) => {
    const part = text.slice(0, Math.max(0, count - used));
    used += text.length;
    if (!part) return null;
    return cls ? <span key={i} className={cls}>{part}</span> : part;
  });

  return (
    <figure ref={ref} className="editor" aria-hidden="true">
      <div className="editor-bar mono"><i /><i /><i /><span>Jefferson.tsx</span><span className="editor-status">● live</span></div>
      <pre className="code mono"><code>{rendered}{typing && <span className="caret" />}</code></pre>
      <div className="preview">
        <span className="preview-label mono">Rendered output</span>
        <div className="dev-card">
          <b data-p className={pending('role')}>Front End Developer</b>
          <span data-p className={`mono ${pending('city') ?? ''}`}>Brisbane, QLD · 5+ yrs</span>
          <ul className="mono">
            <li data-p className={pending('react')}>React</li>
            <li data-p className={pending('next')}>Next.js</li>
            <li data-p className={pending('rn')}>React Native</li>
            <li data-p className={pending('wcag')}>WCAG</li>
          </ul>
        </div>
      </div>
    </figure>
  );
}
