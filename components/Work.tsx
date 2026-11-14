import { projects } from '@/data/content';
import Decode from './Decode';
import FlashDemo from './FlashDemo';
import Gallery from './Gallery';
import Pipeline from './Pipeline';

export default function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="section-heading">
        <div>
          <div className="label mono"><Decode text="02 / SELECTED WORK" /></div>
          <h2 id="work-title">THE WORK.<br />THE THINKING.</h2>
        </div>
        <p>Three products, shipped to real users.<br />Screens first, detail if you want it.</p>
      </div>

      {projects.map((p, i) => (
        <article className="project" aria-labelledby={`p-${p.id}`} key={p.id}>
          <header className="project-head">
            <span className="project-number mono">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="project-name" id={`p-${p.id}`}>{p.name}</h3>
              <p className="project-title mono">{p.meta}</p>
            </div>
            <a className="visit" href={p.link.href} target="_blank" rel="noopener">
              {p.link.label} <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span>
            </a>
          </header>
          <p className="project-line">{p.line}</p>
          <Gallery label={`${p.name.charAt(0)}${p.name.slice(1).toLowerCase()} screens`} screens={p.screens} />
          {p.demo === 'pipeline' && <Pipeline />}
          {p.demo === 'flashing' && <FlashDemo />}
          <details className="case">
            <summary>Read the case study <span aria-hidden="true">+</span></summary>
            <div className="case-grid">
              <div><h4>Challenge</h4><p>{p.caseStudy.challenge}</p></div>
              <div><h4>My contribution</h4><p>{p.caseStudy.contribution}</p></div>
              <div><h4>Approach</h4><p>{p.caseStudy.approach}</p></div>
              <div><h4>Outcome</h4><p>{p.caseStudy.outcome}</p></div>
            </div>
            <p className="tech mono">{p.tech.join(' / ')}</p>
          </details>
        </article>
      ))}
      <div className="work-foot mono"><span>REAL PRODUCTS. REAL USERS.</span><span>2020 — 2026</span></div>
    </section>
  );
}
