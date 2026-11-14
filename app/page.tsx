import Effects from '@/components/Effects';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import RoleFit from '@/components/RoleFit';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Effects />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <RoleFit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
