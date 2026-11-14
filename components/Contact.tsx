'use client';
import { useRef, useState } from 'react';
import { contact } from '@/data/content';
import Decode from './Decode';

export default function Contact() {
  const [status, setStatus] = useState('');
  const emailRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setStatus('Email address copied');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailRef.current!);
      const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(range);
      setStatus('Address selected. Press Ctrl+C or ⌘C to copy');
    }
    setTimeout(() => setStatus(''), 3500);
  };

  // Open every disclosure while printing, then restore.
  const printPage = () => {
    const closed = [...document.querySelectorAll('details:not([open])')] as HTMLDetailsElement[];
    closed.forEach(d => (d.open = true));
    print();
    closed.forEach(d => (d.open = false));
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="label mono"><Decode text="05 / THE NEXT CONVERSATION" /></div>
      <h2 id="contact-title">LET’S BUILD<br />SOMETHING<br /><span>MEANINGFUL.</span></h2>
      <div className="contact-bottom">
        <div>
          <p>Jefferson Solano<br />Front End Web Developer · Brisbane, Australia</p>
          <a ref={emailRef} className="email" href={`mailto:${contact.email}`}>{contact.email}</a>
          <button type="button" className="copy mono" onClick={copy}>Copy email</button>
          <span className="copy-status mono" role="status">{status}</span>
        </div>
        <div className="actions">
          <a className="button" href={`mailto:${contact.email}`}>Email me <span aria-hidden="true">↗</span></a>
          <a className="text-link" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
        </div>
      </div>
      <aside id="cv" aria-labelledby="cv-title">
        <h3 id="cv-title">Résumé and referees</h3>
        <p>My full résumé, two recent referees and statement of suitability are included with my SmartJobs application. Need another copy? Email me and I’ll send it the same day.</p>
        <button type="button" className="text-link print" onClick={printPage}>Print this page as a résumé ↓</button>
      </aside>
    </section>
  );
}
