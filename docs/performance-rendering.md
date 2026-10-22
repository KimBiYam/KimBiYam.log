# 첫 화면과 이미지·Pretendard 로딩

글 목록을 서버 HTML부터 정상 불투명도로 표시해 JavaScript·IntersectionObserver를 기다리는 표시 지연을 없앴다. 기존 hover 효과, 태그 전환과 무한스크롤은 유지한다.

실제 상단 이미지가 있는 Electron 게시글에 `priorityImage` 메타데이터를 지정한다. 서버 이미지 크기 맵에 우선순위를 전달해 해당 이미지만 eager/high로 요청하고, 본문 컨테이너 폭에 맞는 sizes를 제공한다. 나머지 이미지는 lazy를 유지한다. 로고는 24px, 프로필은 64px 요청으로 맞추고 품질은 75를 사용한다. 프로필 preload는 목록 상단에서만 활성화한다.

Pretendard 1.3.9의 원본 WOFF2 동적 서브셋을 자체 호스팅한다. 사용 굵기 400/500/600/700, unicode-range, swap, OFL 라이선스를 유지했다. 368개 파일 합계는 약 4.7MB지만 브라우저는 필요한 글리프 조각만 요청한다. 버전 경로에 immutable 1년 캐시를 지정하고 공통 Regular 91 조각만 preload한다. 전체 한글 가변 폰트로 교체하거나 모든 조각을 preload하지 않는다.

재생성: 저장소 루트에서 `python3 scripts/vendor-pretendard.py`. 고정 버전 npm 아카이브의 SHA-256을 검증한 뒤 폰트·라이선스·CSS를 만들고 프로젝트 Prettier로 CSS를 정리한다.

## 로컬 검증

- `pnpm lint`, `pnpm build`, `git diff --check` 통과.
- 368개 폰트·라이선스의 원본 바이트와 CSS 범위/굵기 일치 확인. 실제 폰트 응답의 immutable 캐시 헤더 확인.
- JavaScript 없이 초기 목록 10개 표시. LCP 이미지 eager/high 및 sizes, 하단 프로필 lazy, 홈 프로필 preload, 로고 실제 선택 크기 확인.
- 라이트/다크, 태그·뒤로가기, 무한스크롤 10→20개, 본문 코드 span 394개, 확대, 데스크톱 목차 확인.
- 모바일 Lighthouse 각 URL 3회 중앙값: 홈 70점/LCP 5.40초/TBT 224.5ms, 게시글 72점/LCP 4.94초/TBT 317ms. 최대 CLS 약 0.00025. Lighthouse 12.6.1, Chrome 155, 기본 모바일 simulated throttling.

`8dbddde` 기준 독립 변경이다. 이 브랜치만으로는 Prism의 기존 클라이언트 유입이나 동기 Replay 초기화가 제거되지 않는다. 폰트 파일 수 감소 또는 안정적인 90점 달성을 주장하지 않으며, 로컬 점수는 운영 PSI나 실사용 p75를 보장하지 않는다.
