export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: string; // path to image or gif
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
  link?: string;
}

export interface Skill {
  name: string;
  category: string;
  icon?: string;
}

export const profile = {
  name: 'Mingi Hong',
  nameKo: '홍민기',
  role: 'Machine Learning Engineer',
  tagline: 'Shipping ML to production. Pipelines, infrastructure, and everything in between.',
  emails: ['me@mghong.dev', 'mghong@hanyang.ac.kr'],
  github: 'https://github.com/anomredux',
} as const;

export const skills: Skill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'PyTorch', category: 'ML/DL' },
  { name: 'Go', category: 'Backend' },
  { name: 'Docker', category: 'Infrastructure' },
  { name: 'Kubernetes', category: 'Infrastructure' },
];

export const projects: Project[] = [
  {
    id: 'concept-erasure',
    title: 'Concept Erasure in Diffusion Models',
    subtitle: 'Text-to-Image Safety Research',
    description:
      'Research on methodology for erasing specific concepts from text-to-image diffusion models, conducted during graduate studies.',
    tags: ['PyTorch', 'Diffusion Models', 'Research'],
  },
  // Add more projects here — each entry automatically generates a card + detail page
];

export const awards: Award[] = [
  // Add awards here — same card + detail page structure as projects
  // Example:
  // {
  //   id: 'award-example',
  //   title: 'Example Award',
  //   organization: 'Organization Name',
  //   year: '2024',
  //   description: 'Description of the award.',
  // },
];
