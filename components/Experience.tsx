import { certifications, education, experience, toolkit } from '@/data/content';
import Decode from './Decode';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="section-heading">
        <div>
          <div className="label mono"><Decode text="03 / EXPERIENCE" /></div>
          <h2 id="exp-title">THE PATH<br />SO FAR.</h2>
        </div>
        <p>Two product teams, one constant:<br />web and mobile built side by side.</p>
      </div>
      <ol className="timeline">
        {experience.map(job => (
          <li key={job.company}>
            <div className="when mono">{job.when}</div>
            <div>
              <h3>
                {job.role}{' '}
                <span>· {job.companyUrl ? <a href={job.companyUrl} target="_blank" rel="noopener">{job.company}</a> : job.company}, {job.place}</span>
              </h3>
              <ul>{job.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="credentials">
        <div>
          <h3 className="mono">Education</h3>
          <ul>{education.map(e => <li key={e.name}><span>{e.name}</span><span className="mono">{e.year}</span></li>)}</ul>
        </div>
        <div>
          <h3 className="mono">Certifications</h3>
          <ul>{certifications.map(c => <li key={c.name}><span>{c.name}</span><span className="mono">{c.year}</span></li>)}</ul>
        </div>
        <div>
          <h3 className="mono">Toolkit</h3>
          <ul className="tags">{toolkit.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
