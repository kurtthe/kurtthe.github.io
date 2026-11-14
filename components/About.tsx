import Decode from './Decode';

export default function About() {
  return (
    <section id="about" className="section split" aria-labelledby="about-title">
      <div className="label mono"><Decode text="01 / ABOUT" /></div>
      <div>
        <h2 id="about-title">MORE THAN<br />CODE.</h2>
        <p className="lead">I like making complicated things feel simple.</p>
        <p>I’m Jefferson, a frontend developer with 5+ years building web and mobile products with React.js, Next.js and React Native. I turn complex requirements into clear, accessible interfaces, working closely with designers, content teams and specialists.</p>
      </div>
    </section>
  );
}
