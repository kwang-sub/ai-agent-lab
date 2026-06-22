# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
이 저장소는 Next.js 15 App Router 기반의 암호화폐 순위 대시보드입니다. 화면 진입점은 `app/page.tsx`, 전역 레이아웃과 스타일은 `app/layout.tsx`, `app/globals.css`에 있습니다. 공통 UI 컴포넌트는 `components/ui/`, 공유 훅은 `hooks/`, 작은 유틸은 `lib/`에 둡니다. 정적 자산은 `public/` 아래에 있으며, 코인 이미지는 `public/coin/`에 저장합니다. 핵심 대시보드 UI는 루트의 `crypto-ranking-board.tsx`에 있습니다.

## 빌드, 테스트, 개발 명령
이 프로젝트는 `pnpm`을 사용합니다.

- `pnpm dev` - 개발 서버를 실행합니다.
- `pnpm build` - 프로덕션 빌드를 생성합니다.
- `pnpm start` - 빌드 결과를 프로덕션 모드로 실행합니다.
- `pnpm lint` - Next.js 린트를 실행합니다.

PowerShell에서 스크립트 실행 정책 때문에 `pnpm`이 막히면 `pnpm.cmd`를 사용하세요.

## 코드 스타일 및 명명 규칙
기존 코드 스타일을 그대로 따릅니다. 들여쓰기는 2칸, 컴포넌트는 함수형 컴포넌트를 기본으로 하며, 헬퍼 함수는 사용하는 컴포넌트 가까이에 둡니다. React 컴포넌트와 인터페이스는 `PascalCase`, 함수와 변수, 훅은 `camelCase`를 사용합니다. 내부 경로는 가능하면 `@/` 별칭을 사용하고, 파일명은 기존 관례에 맞춰 간결하게 유지합니다.

## 테스트 가이드
`jest.config.mjs`와 `jest.setup.js`는 준비되어 있지만, 아직 정식 테스트 스위트는 없습니다. 기능을 확장할 때는 `*.test.tsx` 또는 `__tests__/` 아래에 테스트를 추가하세요. 숫자 포맷, 테이블 렌더링, 데이터 헬퍼처럼 범위가 분명한 부분부터 커버하는 것이 좋습니다. PR 전에는 추가한 테스트와 함께 빌드가 유지되는지 확인하세요.
새 테스트를 넣을 때는 파일 이름이 기능을 드러내도록 하세요. 예: `crypto-ranking-board.test.tsx`.

## 커밋 및 PR 가이드
최근 히스토리는 `feat(vibe-coding-claude-code-guide): 기본 프로젝트 생성`, `docs(vibe-coding-claude-code-guide): add study directory`처럼 `type(scope): summary` 형식을 따릅니다. 새 커밋도 `feat`, `fix`, `docs`, `chore` 같은 접두사를 유지하되, `summary`는 반드시 한글로 작성하세요. scope는 `vibe-coding-claude-code-guide`처럼 변경 범위를 짧게 적습니다.

메시지는 현재형 명령문으로 간결하게 쓰고, 한 커밋에는 한 가지 목적만 담는 편이 좋습니다. 예: `fix(ui): 차트 툴팁 정렬 수정`, `docs: 테스트 안내 문구 보강`.

PR에는 변경 요약, 화면 변경 여부, 관련 이슈를 적어 주세요. UI가 바뀌면 스크린샷을, 동작이 바뀌면 검증 방법을 함께 남기면 리뷰가 훨씬 수월합니다.

## 설정 참고
`next.config.mjs`에서는 현재 TypeScript와 ESLint 오류가 빌드에서 무시되도록 설정되어 있습니다. 이는 임시 상태로 보고, 새 작업에서는 가능한 한 문제를 바로잡는 쪽으로 진행하세요. 이미지 자산은 `public/coin/`에 두고 `/coin/bitcoin.png` 같은 루트 기준 경로로 참조합니다.
