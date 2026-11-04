import type { Locator } from '@playwright/test';

const HYDRATION_TIMEOUT_MS = 10_000;

/**
 * React 가 요소에 props 를 붙일 때까지(하이드레이션 완료) 기다린다.
 * React 내부 키인 `__reactProps$*` 에 의존하므로 React 업그레이드 시 확인이 필요하다.
 * 제한 시간 안에 끝나지 않으면 명확한 메시지와 함께 실패한다.
 */
export const waitForHydration = async (
  locator: Locator,
  timeout = HYDRATION_TIMEOUT_MS,
) => {
  await locator.waitFor();
  await locator.evaluate(
    (element, limit) =>
      new Promise<void>((resolve, reject) => {
        const startedAt = performance.now();
        const check = () => {
          if (
            Object.keys(element).some((key) => key.startsWith('__reactProps$'))
          ) {
            resolve();
          } else if (performance.now() - startedAt > limit) {
            reject(
              new Error(
                `하이드레이션이 ${limit}ms 안에 완료되지 않음 (__reactProps$ 키 없음)`,
              ),
            );
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      }),
    timeout,
  );
};
