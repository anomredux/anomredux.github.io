# Local Development Guide

로컬에서 프로필 사이트를 실행하고 수정하는 방법입니다.

## Prerequisites

- **Node.js 22+** ([download](https://nodejs.org/))
- **npm** (Node.js와 함께 설치됨)
- Git

## Quick Start

```bash
# 1. 레포 클론
git clone https://github.com/anomredux/anomredux.github.io.git
cd anomredux.github.io

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:5173** 접속하면 사이트를 볼 수 있습니다.
파일을 수정하면 자동으로 반영됩니다 (HMR).

## Available Commands

| 명령어            | 설명                                |
| ----------------- | ----------------------------------- |
| `npm run dev`     | 개발 서버 실행 (HMR)                |
| `npm run build`   | 프로덕션 빌드 (`dist/` 폴더에 출력) |
| `npm run preview` | 빌드 결과물 로컬 프리뷰             |
| `npm run lint`    | ESLint 실행                         |
| `npm run format`  | Prettier 포매팅                     |

## Content Editing

모든 프로필 콘텐츠는 **`src/data/profile.ts`** 한 파일에 있습니다.

### Profile 기본 정보

```ts
export const profile = {
  name: 'Mingi Hong',
  role: 'Machine Learning Engineer',
  tagline: 'Shipping ML to production...',
  emails: ['me@mghong.dev', 'mghong@hanyang.ac.kr'],
  github: 'https://github.com/anomredux',
}
```

### Project 추가

`projects` 배열에 새 항목을 추가하면 됩니다:

```ts
{
  id: 'my-project',           // URL 경로에 사용됨 (/projects/my-project)
  title: 'Project Title',
  subtitle: 'One-line summary',
  description: 'Full description...',
  tags: ['Python', 'PyTorch'],
  link: 'https://github.com/anomredux/repo-name',  // GitHub 링크
  image: '/images/project-thumb.webp',              // 썸네일 (optional)
  sections: [                  // 상세 페이지 콘텐츠 블록
    { type: 'text', heading: 'Problem', body: '...' },
    { type: 'image', image: '/images/diagram.gif', imageAlt: 'description' },
    { type: 'feature', heading: 'Results', body: '...' },
  ],
}
```

### Award 추가

`awards` 배열에 동일 패턴으로 추가:

```ts
{
  id: 'award-name',
  title: 'Award Title',
  organization: 'Organization',
  year: '2024',
  description: 'Description...',
  sections: [
    { type: 'text', heading: 'Challenge', body: '...' },
  ],
}
```

### Experience 추가

`experiences` 배열에 추가:

```ts
{
  id: 'company-role',
  role: 'Job Title',
  company: 'Company Name',
  period: '2025.06 — Present',
  description: 'Summary...',
  highlights: [
    'What you did #1',
    'What you did #2',
  ],
  current: true,  // 현재 재직중이면 true (파란 dot 표시)
}
```

## Adding Images & GIFs

1. 이미지를 `public/images/` 폴더에 넣기 (없으면 생성)
2. 데이터에서 경로 참조: `image: '/images/my-image.webp'`
3. GIF도 동일: `image: '/images/demo.gif'`

추천 포맷:

- 사진: **WebP** 또는 **AVIF** (가볍고 품질 좋음)
- 애니메이션: **GIF** 또는 **WebP animated**
- 크기: 가로 최대 1800px 정도면 충분

## Project Structure

```
src/
├── data/profile.ts        ← 콘텐츠 수정은 여기서
├── sections/              ← 메인 페이지 섹션 컴포넌트
├── pages/                 ← 상세 페이지 + 홈
├── components/            ← 재사용 컴포넌트
├── hooks/                 ← GSAP 애니메이션 훅
└── styles/global.css      ← 전역 스타일, CSS 변수
```

## Build & Deploy

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 확인
npm run preview
```

GitHub에 push하면 GitHub Actions가 자동으로 빌드 + 배포합니다.
`main` 브랜치에 merge되면 https://anomredux.github.io/ 에 반영됩니다.

## Troubleshooting

**`npm run dev` 포트 충돌 시:**

```bash
npm run dev -- --port 3000
```

**TypeScript 에러 시:**

```bash
# 타입 체크만 실행
npx tsc --noEmit
```

**의존성 문제 시:**

```bash
rm -rf node_modules package-lock.json
npm install
```
