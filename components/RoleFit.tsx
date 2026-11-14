'use client';
import { KeyboardEvent, useRef, useState } from 'react';
import { evidence, requirements, why } from '@/data/content';
import Decode from './Decode';

const tabs = [
  { id: 'tech', label: 'Technical' },
  { id: 'vision', label: 'Vision' },
  { id: 'results', label: 'Results' },
  { id: 'account', label: 'Accountability' },
] as const;
const evidenceByTab = { vision: evidence.vision, results: evidence.results, account: evidence.accountability };
type Filter = 'all' | 'required' | 'desirable';

export default function RoleFit() {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = requirements.filter(r => filter === 'all' || r.type === filter);
  const direct = shown.filter(r => r.status === 'direct').length;

  // ARIA tabs pattern: arrow keys, Home and End move between tabs.
  const onKey = (e: KeyboardEvent, i: number) => {
    const next = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="fit" className="section fit" aria-labelledby="fit-title">
      <div className="section-heading">
        <div>
          <div className="label mono"><Decode text="04 / ROLE FIT" /></div>
          <h2 id="fit-title">WHY QM.<br />WHY ME.</h2>
        </div>
        <p>Why I want to join Queensland Museum,<br />and how my experience maps to the AO6 brief.</p>
      </div>

      <div className="why-intro">
        <p className="lead">Queensland Museum looks after 15.2 million objects, specimens and stories, shared across four museums and online.</p>
        <p>The Digital Solutions team is moving to an API-driven platform with a headless CMS. I want to bring my web and mobile experience to work with a clear public purpose.</p>
      </div>
      <ul className="why">
        {why.map(w => <li key={w.n}><span className="n">{w.n}</span><h4>{w.title}</h4><p>{w.text}</p></li>)}
      </ul>

      <h3 className="brief-title">The brief, mapped to what I’ve done.</h3>
      <div className="tabs enhanced">
        <div className="tablist mono" role="tablist" aria-label="Assessment areas">
          {tabs.map((t, i) => (
            <button
              key={t.id} ref={el => { tabRefs.current[i] = el; }}
              type="button" role="tab" id={`tab-${t.id}`} aria-controls={`panel-${t.id}`}
              aria-selected={tab === i} tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)} onKeyDown={e => onKey(e, i)}
            >{t.label}</button>
          ))}
        </div>

        <div className="panel" id="panel-tech" role="tabpanel" aria-labelledby="tab-tech" tabIndex={0} hidden={tab !== 0}>
          <h3 className="panel-title">Technical proficiency</h3>
          <div className="fit-tools">
            <div className="chips mono" role="group" aria-label="Filter requirements">
              {(['all', 'required', 'desirable'] as Filter[]).map(f => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <p className="fit-summary mono" aria-live="polite">
              {shown.length} requirements · <b>{direct}</b> direct · <b>{shown.length - direct}</b> transferable
            </p>
          </div>
          <ul className="reqs">
            {shown.map(r => (
              <li key={r.title}>
                <details>
                  <summary><span className="req">{r.title}</span><span className={`badge ${r.status} mono`}>{r.status === 'direct' ? 'Direct' : 'Transferable'}</span></summary>
                  <p>{r.evidence}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>

        {tabs.slice(1).map((t, j) => (
          <div key={t.id} className="panel" id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} tabIndex={0} hidden={tab !== j + 1}>
            <h3 className="panel-title">{t.label}</h3>
            <div className="evidence">
              {evidenceByTab[t.id as keyof typeof evidenceByTab].map(e => <div key={e.label}><span className="mono">{e.label}</span><p>{e.text}</p></div>)}
            </div>
          </div>
        ))}
      </div>
      <p className="small-note">An independent personal portfolio, prepared for the Front End Web Developer (AO6) opportunity at Queensland Museum. No affiliation or endorsement is implied.</p>
    </section>
  );
}
