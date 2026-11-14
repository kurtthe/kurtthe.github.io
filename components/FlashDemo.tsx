'use client';
import { useState } from 'react';

type Pt = [number, number];
const W = 400, H = 240, PAD = 50, PAINT_OFFSET = 5;

/** Profile in millimetres: A goes down, B goes right, C leaves B at the bend angle. */
function profile(a: number, b: number, c: number, angle: number): Pt[] {
  const phi = ((180 - angle) * Math.PI) / 180;
  return [[0, 0], [0, a], [b, a], [b + Math.cos(phi) * c, a + Math.sin(phi) * c]];
}

/** Scale a profile to fit the drawing area, centred. */
function fit(P: Pt[]): Pt[] {
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((W - PAD * 2) / (maxX - minX || 1), (H - PAD * 2) / (maxY - minY || 1));
  const ox = (W - (maxX - minX) * k) / 2 - minX * k, oy = (H - (maxY - minY) * k) / 2 - minY * k;
  return P.map(([x, y]) => [ox + x * k, oy + y * k]);
}

/** The painted side: the same line offset along each segment's normal, mitred at the bends. */
function offset(S: Pt[], d: number): Pt[] {
  const N = S.slice(1).map((q, i) => {
    const dx = q[0] - S[i][0], dy = q[1] - S[i][1], L = Math.hypot(dx, dy) || 1;
    return [dy / L, -dx / L] as Pt;
  });
  return S.map((p, i) => {
    if (i === 0) return [p[0] + N[0][0] * d, p[1] + N[0][1] * d];
    if (i === S.length - 1) return [p[0] + N[i - 1][0] * d, p[1] + N[i - 1][1] * d];
    const m: Pt = [N[i - 1][0] + N[i][0], N[i - 1][1] + N[i][1]];
    const ml = Math.hypot(...m) || 1;
    const cos = (m[0] * N[i][0] + m[1] * N[i][1]) / ml;
    return [p[0] + (m[0] / ml) * (d / cos), p[1] + (m[1] / ml) * (d / cos)];
  });
}

const pts = (P: Pt[]) => P.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

const controls = [
  { id: 'a', label: 'A · upstand', min: 40, max: 200, unit: ' mm' },
  { id: 'b', label: 'B · base', min: 120, max: 400, unit: ' mm' },
  { id: 'c', label: 'C · drip', min: 20, max: 90, unit: ' mm' },
  { id: 't', label: 'C · bend angle', min: 45, max: 135, unit: '°' },
] as const;

/** A simplified version of the Flashing Designer drawing tool. */
export default function FlashDemo() {
  const [v, setV] = useState({ a: 150, b: 300, c: 50, t: 80 });
  const S = fit(profile(v.a, v.b, v.c, v.t));
  const [mA, mB, mC] = [mid(S[0], S[1]), mid(S[1], S[2]), mid(S[2], S[3])];

  return (
    <div className="flash-demo">
      <div className="flash-canvas">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="flash-desc">
          <title id="flash-desc">{`Flashing profile: A ${v.a} mm, B ${v.b} mm, C ${v.c} mm at ${v.t} degrees`}</title>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".12" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" />
          <polyline className="paint" fill="none" points={pts(offset(S, PAINT_OFFSET))} />
          <polyline className="shape" fill="none" points={pts(S)} />
          <g className="labels mono">
            <text x={mA[0] - 14} y={mA[1] + 4} textAnchor="end" className="dim">A {v.a}</text>
            <text x={mB[0]} y={mB[1] + 22} textAnchor="middle" className="dim">B {v.b}</text>
            <text x={mC[0] + 12} y={mC[1] + 4} className="dim">C {v.c}</text>
            <text x={S[1][0] + 10} y={S[1][1] - 10}>90°</text>
            <text x={S[2][0] - 10} y={S[2][1] - 10} textAnchor="end">{v.t}°</text>
            <circle cx={S[0][0]} cy={S[0][1]} r={4} />
            <circle cx={S[3][0]} cy={S[3][1]} r={4} />
          </g>
        </svg>
      </div>
      <div className="flash-controls">
        <p className="flash-intro mono">Try it: a simplified version of the drawing tool</p>
        {controls.map(c => (
          <div className="ctl" key={c.id}>
            <label htmlFor={`f-${c.id}`}>{c.label}</label>
            <output htmlFor={`f-${c.id}`}>{v[c.id]}{c.unit}</output>
            <input
              type="range" id={`f-${c.id}`} min={c.min} max={c.max} step={5} value={v[c.id]}
              onChange={e => setV(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
            />
          </div>
        ))}
        <dl className="flash-out mono" aria-live="polite">
          <div><dt>Girth</dt><dd>{v.a + v.b + v.c} mm</dd></div>
          <div><dt>Bends</dt><dd>2</dd></div>
        </dl>
      </div>
    </div>
  );
}
