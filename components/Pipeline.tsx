'use client';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const lanes = [
  { cls: 'store', name: 'App store', time: '1–2 days', dur: '6s', steps: ['Commit', 'Build', 'Store review', 'Users'] },
  { cls: 'ota', name: 'CodePush', time: '~10 min', dur: '1.4s', steps: ['Commit', 'Git verify', 'OTA push', 'Users'] },
];

/** Side-by-side release paths for Trak: store review vs. CodePush over-the-air. */
export default function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.6);
  const [running, setRunning] = useState(false);
  const [motion, setMotion] = useState(false);

  const play = () => { setRunning(false); requestAnimationFrame(() => requestAnimationFrame(() => setRunning(true))); };

  useEffect(() => { setMotion(!prefersReducedMotion()); }, []);
  useEffect(() => { if (inView && motion) play(); }, [inView, motion]);

  return (
    <div ref={ref} className={running ? 'pipeline running' : 'pipeline'}>
      <div className="pipe-head">
        <span className="mono">Release paths, side by side</span>
        <button className="run mono" type="button" hidden={!motion} onClick={play}>▶ Run a release</button>
      </div>
      {lanes.map(l => (
        <div key={l.cls} className={`lane ${l.cls}`} style={{ '--dur': l.dur } as CSSProperties}>
          <span className="lane-name mono">{l.name}</span>
          <div className="track">
            <ol className="steps mono">{l.steps.map(s => <li key={s}>{s}</li>)}</ol>
            <i className="packet" />
          </div>
          <span className="lane-time mono">{l.time}</span>
        </div>
      ))}
      <p className="pipe-note">Eligible JavaScript changes only. Native changes still follow the store process.</p>
    </div>
  );
}
