import { stack } from '@/data/content';

export default function Marquee() {
  const items = stack.map(s => <li key={s}>{s}</li>);
  return (
    <div className="marquee mono" aria-label="Technologies I work with">
      <div className="marquee-track">
        <ul>{items}</ul>
        <ul aria-hidden="true">{items}</ul>
      </div>
    </div>
  );
}
