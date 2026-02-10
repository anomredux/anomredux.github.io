export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: string; // supports png, jpg, webp, gif
  link?: string;
  // Detail page content — each section becomes a full-width block
  sections?: ProjectSection[];
}

export interface ProjectSection {
  type: 'text' | 'image' | 'feature';
  heading?: string;
  body?: string;
  image?: string; // supports gif
  imageAlt?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
  link?: string;
  sections?: ProjectSection[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  current?: boolean;
}

export interface Skill {
  name: string;
  category: string;
}

// ─── Profile ────────────────────────────────────────────
export const profile = {
  name: 'Mingi Hong',
  nameKo: '홍민기',
  role: 'Machine Learning Engineer',
  tagline:
    'Shipping ML to production. Pipelines, infrastructure, and everything in between.',
  emails: ['me@mghong.dev', 'mghong@hanyang.ac.kr'],
  github: 'https://github.com/anomredux',
} as const;

// ─── Skills ─────────────────────────────────────────────
export const skills: Skill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'PyTorch', category: 'ML/DL' },
  { name: 'Go', category: 'Backend' },
  { name: 'Docker', category: 'Infrastructure' },
  { name: 'Kubernetes', category: 'Infrastructure' },
];

// ─── Experience ─────────────────────────────────────────
// TODO: 실제 경력으로 교체
export const experiences: Experience[] = [
  {
    id: 'mtsco',
    role: 'Machine Learning Engineer',
    company: 'MTSCO',
    period: '2025.06 — Present',
    description:
      'Developing and deploying AI systems for computational pathology, building production-grade pipelines for whole-slide image analysis.',
    highlights: [
      // TODO: 실제 업무 내용으로 교체
      'Lorem ipsum dolor sit amet — built and deployed pathology AI models for whole-slide image (WSI) analysis.',
      'Lorem ipsum dolor sit amet — designed training pipelines for histopathological tissue classification and segmentation.',
      'Lorem ipsum dolor sit amet — optimized inference performance for gigapixel-scale pathology images.',
      'Lorem ipsum dolor sit amet — implemented CI/CD and monitoring for model deployment on Kubernetes.',
      'Lorem ipsum dolor sit amet — collaborated with pathologists to validate model outputs and improve diagnostic accuracy.',
    ],
    current: true,
  },
  {
    id: 'grad-research',
    role: 'M.S. in Artificial Intelligence',
    company: 'Hanyang University, Department of Artificial Intelligence',
    period: '2022 — 2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Conducted research on generative models and concept erasure methods in text-to-image diffusion models. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

// ─── Projects ───────────────────────────────────────────
// TODO: 실제 프로젝트 내용으로 교체
export const projects: Project[] = [
  {
    id: 'concept-erasure',
    title: 'Concept Erasure in Diffusion Models',
    subtitle: 'Text-to-Image Safety Research',
    description:
      'Research on methodology for erasing specific concepts from text-to-image diffusion models, conducted during graduate studies.',
    tags: ['PyTorch', 'Diffusion Models', 'Research'],
    link: 'https://github.com/anomredux', // TODO: 실제 repo URL로 교체
    sections: [
      {
        type: 'text',
        heading: 'Problem',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Text-to-image diffusion models can generate harmful or copyrighted content. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      },
      {
        type: 'image',
        image: '',
        imageAlt: 'Diagram showing the concept erasure pipeline',
      },
      {
        type: 'feature',
        heading: 'Approach',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proposed a novel fine-tuning method that selectively removes target concepts while preserving generation quality. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'feature',
        heading: 'Results',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Achieved X% concept removal rate with minimal impact on FID scores. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
    ],
  },
  {
    id: 'ml-pipeline',
    title: 'Production ML Pipeline',
    subtitle: 'End-to-End MLOps Infrastructure',
    description:
      'Lorem ipsum dolor sit amet. Designed and deployed a scalable ML pipeline handling real-time inference with automated retraining and monitoring.',
    tags: ['Python', 'Kubernetes', 'Docker', 'MLOps'],
    link: 'https://github.com/anomredux', // TODO: 실제 repo URL로 교체
    sections: [
      {
        type: 'text',
        heading: 'Overview',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Built an end-to-end pipeline covering data ingestion, feature engineering, model training, evaluation, and deployment. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        type: 'feature',
        heading: 'Architecture',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Microservice-based architecture orchestrated with Kubernetes, automated CI/CD for model deployment. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'image',
        image: '',
        imageAlt: 'Architecture diagram of the ML pipeline',
      },
      {
        type: 'feature',
        heading: 'Impact',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reduced model deployment time from days to hours, improved inference latency by X%. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
    ],
  },
  {
    id: 'go-inference-server',
    title: 'High-Performance Inference Server',
    subtitle: 'Low-Latency Model Serving in Go',
    description:
      'Lorem ipsum dolor sit amet. A Go-based inference server optimized for low-latency, high-throughput ML model serving in production.',
    tags: ['Go', 'gRPC', 'Docker', 'Performance'],
    link: 'https://github.com/anomredux', // TODO: 실제 repo URL로 교체
    sections: [
      {
        type: 'text',
        heading: 'Motivation',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Python-based serving solutions introduced unacceptable latency for real-time applications. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        type: 'feature',
        heading: 'Implementation',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Built a gRPC server in Go with connection pooling, batched inference, and graceful degradation. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      },
      {
        type: 'feature',
        heading: 'Benchmarks',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Achieved Xms p99 latency at Y requests per second, a Z% improvement over the previous Python implementation. Duis aute irure dolor in reprehenderit.',
      },
    ],
  },
];

// ─── Awards ─────────────────────────────────────────────
// TODO: 실제 수상 내역으로 교체
export const awards: Award[] = [
  {
    id: 'award-competition',
    title: 'Award Title Here',
    organization: 'Organization / Competition Name',
    year: '2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placed Xth in a national-level ML competition. Sed do eiusmod tempor incididunt.',
    sections: [
      {
        type: 'text',
        heading: 'Challenge',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The competition required participants to build a model that achieves maximum accuracy on a constrained dataset. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        type: 'feature',
        heading: 'Our Approach',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ensemble of fine-tuned models with custom data augmentation pipeline. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'image',
        image: '',
        imageAlt: 'Leaderboard screenshot or results chart',
      },
    ],
  },
  {
    id: 'award-scholarship',
    title: 'Scholarship / Academic Award Title',
    organization: 'University or Foundation Name',
    year: '2023',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recognized for academic excellence and research contributions. Ut enim ad minim veniam.',
    sections: [
      {
        type: 'text',
        heading: 'Background',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Awarded for outstanding research output during the graduate program. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      },
    ],
  },
];
