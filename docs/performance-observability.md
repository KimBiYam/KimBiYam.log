# Replay와 댓글 초기 로딩 분리

Sentry 기본 오류 수집은 즉시 초기화하고, Replay는 별도 청크로 로드한다. 문서 load 이후 idle, 첫 키보드·포인터·스크롤 입력 또는 오류가 로딩을 시작한다. load/idle이 지연되더라도 3초 deadline으로 시작하며, 청크 실패는 한 번 재시도한다. 오류 전송은 Replay 다운로드를 기다리지 않는다.

기존 tracing 1, 세션 Replay 0.1, 오류 Replay 1 및 텍스트·미디어 마스킹을 유지한다. Replay 설치 이전의 DOM 기록은 없으며, 이때 이미 전송된 오류에는 Replay ID가 연결되지 않을 수 있다. 오류를 다시 전송해 인위적으로 연결하지 않는다.

Utterances는 댓글 영역 600px 근처에서 로드한다. 댓글 컨테이너별 iframe을 사용하고, 현재 테마 동기화와 라우트 전환 시 observer·iframe 정리를 수행한다. 최소 높이를 예약해 로딩 시 레이아웃 이동을 줄인다.

## 로컬 검증

- `pnpm lint`, `pnpm build`, `git diff --check` 통과.
- 초기 HTML script 목록에서 Replay 구현 청크가 제외됐음을 확인.
- gzip 초기 JS: 홈 527.6 → 490.7KiB, 게시글 561.8 → 524.4KiB. 외부 GA와 이후 동적 로딩은 제외한 파일 합계이며 Replay를 삭제한 수치는 아니다.
- 브라우저 확인: idle 로딩, idle 지연 시 deadline, 첫 입력, 오류의 독립 전송, 단회 재시도, 영구 실패 시 오류 수집, 댓글 진입·테마·라우트 정리. 동일 오류 이벤트의 중복 전송 없음.
- 모바일 Lighthouse 각 URL 3회 중앙값: 홈 63점/LCP 6.71초/TBT 479ms, 게시글 60점/LCP 6.12초/TBT 724ms. Lighthouse 12.6.1, Chrome 155, 기본 모바일 simulated throttling.

이 브랜치는 `8dbddde` 기준의 독립 변경이다. Prism·렌더링·폰트 개선을 포함하지 않으며, 로컬 점수를 운영 PSI 또는 실사용 p75의 개선 보장으로 해석하지 않는다.
