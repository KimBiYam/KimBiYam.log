# 서버 Markdown 경계와 게시글 번들 축소

클라이언트 공개 API가 서버 Markdown 렌더러까지 재수출하면서 Prism/refractor의 초기화 부수 효과가 홈과 게시글의 브라우저 번들에 남아 있었다. 클라이언트 API를 명시적으로 분리하고 Markdown 렌더러와 서버 진입점에 `server-only` 경계를 추가했다.

이미지 확대 배경색 때문에 클라이언트가 가져오던 Tailwind 빌드 설정을 전용 CSS 변수로 교체했다. 목차 화면 조건은 작은 matchMedia 구독으로 처리하고, 확대 라이브러리는 idle 또는 첫 이미지 클릭 시 동적으로 로드한다. 사용하지 않는 MediumZoom 재수출도 제거해 정적 import 경로를 닫았다. 공유 버튼에는 제목과 경로만 전달하고, Fira Code는 swap으로 표시한다.

## 로컬 검증

- `pnpm lint`, `pnpm build`, `git diff --check` 통과. 정적 페이지 97개 생성.
- 초기 JS gzip 합계: 홈 527.6 → 309.6KiB, 게시글 561.8 → 312.8KiB. 초기 HTML script 목록 기준이며 외부 GA와 이후 동적 로딩은 제외.
- 초기 JS에서 Prism 언어 문법·Tailwind Typography·medium-zoom 구현이 제외됨을 산출물에서 확인했다. 확대 구현은 약 9.7KB raw의 별도 청크다.
- 본문 텍스트와 코드 강조 span 394개 동일. 라이트/다크 확대, 열린 확대의 테마 전환, 첫 클릭, 1279/1280px 목차 경계, 목차 이동, 공유 URL, 태그·뒤로가기, 무한스크롤, 라우트 정리, 페이지 오류 0건 확인.
- 모바일 Lighthouse 각 URL 3회 중앙값: 홈 73점/LCP 6.01초/TBT 201ms, 게시글 80점/LCP 4.89초/TBT 141ms. 홈 점수 범위 62–78로 편차가 있다. Lighthouse 12.6.1, Chrome 155, 기본 모바일 simulated throttling.

`8dbddde` 기준 독립 변경이다. 목록·이미지·Pretendard 및 Replay 개선은 별도 브랜치다. 로컬 점수는 운영 PSI나 실사용 p75를 보장하지 않는다. 일반 테스트 프레임워크는 추가하지 않았다.
