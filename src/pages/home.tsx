import { Hero } from '../sections/hero';
import { About } from '../sections/about';
import { Skills } from '../sections/skills';
import { Experience } from '../sections/experience';
import { Publications } from '../sections/publications';
import { Certifications } from '../sections/certifications';
import { Projects } from '../sections/projects';
import { Awards } from '../sections/awards';
import { Contact } from '../sections/contact';
import { Footer } from '../components/footer';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Publications />
      <Certifications />
      <Projects />
      <Awards />
      <Contact />
      <Footer />
    </>
  );
}
