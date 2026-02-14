export type Locale = 'en' | 'ko'

const translations = {
  // ─── Nav ───────────────────────────────────────────────
  'nav.home': { en: 'Home', ko: '홈' },
  'nav.blog': { en: 'Blog', ko: '블로그' },
  'nav.contact': { en: 'Contact', ko: '연락처' },

  // ─── Hero ──────────────────────────────────────────────
  'hero.role': { en: 'Machine Learning Engineer', ko: 'Machine Learning Engineer' },
  'hero.tagline': {
    en: 'Shipping ML to production.\nFrom models to infrastructure.',
    ko: 'ML을 프로덕션으로.\n모델부터 인프라까지.',
  },
  'hero.scroll': { en: 'Scroll', ko: 'Scroll' },

  // ─── Section Labels ────────────────────────────────────
  'section.about': { en: 'About', ko: '소개' },
  'section.skills': { en: 'Skills', ko: '기술 스택' },
  'section.experience': { en: 'Experience', ko: '경력' },
  'section.publications': { en: 'Publications', ko: '논문' },
  'section.certifications': { en: 'Certifications', ko: '자격증' },
  'section.projects': { en: 'Projects', ko: '프로젝트' },
  'section.awards': { en: 'Awards', ko: '수상' },
  'section.github': { en: 'GitHub', ko: 'GitHub' },
  'section.contact': { en: 'Contact', ko: '연락처' },

  // ─── About ─────────────────────────────────────────────
  'about.headline': {
    en: 'Machine Learning Engineer\nbuilding systems that scale.',
    ko: 'Machine Learning Engineer.\n확장 가능한 시스템을 만듭니다.',
  },
  'about.body1': {
    en: 'I focus on the full lifecycle of ML — designing training pipelines, optimizing models, and deploying them into production environments that handle real-world traffic.',
    ko: '학습 파이프라인 설계부터 모델 최적화, 프로덕션 배포까지 ML의 전체 라이프사이클을 다룹니다.',
  },
  'about.body2': {
    en: 'Currently working as a Technical Research Personnel (전문연구요원), bridging research and engineering to ship reliable ML infrastructure.',
    ko: '현재 전문연구요원으로 근무하며 안정적인 ML 인프라를 구축하고 있습니다.',
  },

  // ─── Contact ───────────────────────────────────────────
  'contact.headline': { en: "Let\u2019s connect.", ko: '연락해 주세요.' },

  // ─── Footer ────────────────────────────────────────────
  'footer.copyright': { en: '\u00A9 2026 Mingi Hong', ko: '\u00A9 2026 홍민기' },

  // ─── Blog ──────────────────────────────────────────────
  'blog.title': { en: 'Blog', ko: '블로그' },
  'blog.subtitle': {
    en: 'Thoughts on ML engineering, systems, and building things.',
    ko: 'ML 엔지니어링과 시스템에 대한 기록.',
  },
  'blog.search': { en: 'Search posts...', ko: '글 검색...' },
  'blog.all': { en: 'All', ko: '전체' },
  'blog.empty': { en: 'No posts found.', ko: '글이 없습니다.' },
  'blog.minRead': { en: 'min read', ko: '분 소요' },
  'blog.back': { en: '\u2190 Back to blog', ko: '\u2190 블로그로 돌아가기' },

  // ─── 404 ───────────────────────────────────────────────
  'notFound.title': { en: '404', ko: '404' },
  'notFound.message': {
    en: "This page doesn\u2019t exist.",
    ko: '페이지를 찾을 수 없습니다.',
  },
  'notFound.back': { en: 'Back to home', ko: '홈으로 돌아가기' },

  // ─── Publications ──────────────────────────────────────
  'publication.preprint': { en: 'Preprint', ko: '프리프린트' },

  // ─── Experience periods (keep as-is, not translated) ──
  // These use profile data directly

  // ─── Skills categories ─────────────────────────────────
  'skill.ml': { en: 'Machine Learning & Deep Learning', ko: '머신러닝 & 딥러닝' },
  'skill.data': { en: 'Data & Experimentation', ko: '데이터 & 실험' },
  'skill.infra': { en: 'MLOps & Infrastructure', ko: 'MLOps & 인프라' },
} as const

export type TranslationKey = keyof typeof translations

export function getTranslation(key: TranslationKey, locale: Locale): string {
  return translations[key][locale]
}

export { translations }
