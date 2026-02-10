import { Hero } from '../sections/hero';
import { About } from '../sections/about';
import { Skills } from '../sections/skills';
import { Experience } from '../sections/experience';
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
      <Projects />
      <Awards />
      <Contact />
      <Footer />
    </>
  );
}
