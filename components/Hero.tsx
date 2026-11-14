import { asset } from "@/lib/asset";
import CodeEditor from "./CodeEditor";
import CountUp from "./CountUp";
import Decode from "./Decode";
import HeroField from "./HeroField";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroField />
      <div className="hero-inner">
        <div className="eyebrow hero-meta mono">
          <Decode text="FRONT END WEB DEVELOPER" />
          <span>
            <i className="dot" /> <Decode text="BRISBANE, AUSTRALIA" />
          </span>
        </div>
        <div className="hero-top">
          <h1 id="hero-title">
            <span className="line">
              <span>JEFFERSON</span>
            </span>
            <span className="line surname">
              <span>
                <b aria-hidden="true">/</b> SOLANO.
              </span>
            </span>
          </h1>
          <figure className="portrait">
            <div className="frame">
              <img
                src={asset("/assets/profile-placeholder.jpeg")}
                alt="Portrait of Jefferson Solano"
                width={400}
                height={500}
              />
            </div>
            <figcaption className="mono">
              <span>FIG. 01</span>
              <span>BRISBANE, QLD</span>
            </figcaption>
          </figure>
        </div>
        <div className="hero-bottom">
          <CodeEditor />
          <div>
            <h2>
              I build digital experiences
              <br />
              that work for people.
            </h2>
            <p>
              Five years turning complex requirements into clear, accessible web
              and mobile products.
            </p>
            <div className="actions">
              <a className="button" href="#work">
                Explore my work <span aria-hidden="true">↘</span>
              </a>
              <a className="text-link" href="#fit">
                See how I match the role <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <dl className="stats">
          <div>
            <dt className="mono">Years in frontend</dt>
            <dd>
              <CountUp to={5} />+
            </dd>
          </div>
          <div>
            <dt className="mono">Eligible mobile release</dt>
            <dd>
              ~<CountUp to={10} /> min
            </dd>
            <dd className="was mono">previously 1–2 days</dd>
          </div>
          <div>
            <dt className="mono">Channels per product</dt>
            <dd>
              <CountUp to={2} />
            </dd>
            <dd className="was mono">web + mobile</dd>
          </div>
          <div>
            <dt className="mono">Built with</dt>
            <dd>Next.js</dd>
            <dd className="was mono">static export · TypeScript</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
