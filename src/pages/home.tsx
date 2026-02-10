import { Hero } from '../sections/hero';
import { About } from '../sections/about';
import { Skills } from '../sections/skills';
import { Projects } from '../sections/projects';
import { Awards } from '../sections/awards';
import { Contact } from '../sections/contact';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Awards />
      <Contact />
    </>
  );
}
