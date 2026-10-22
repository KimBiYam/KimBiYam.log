let loading: Promise<void> | undefined;
let hadEarlyError = false;
let ready = false;
let attempts = 0;
let cleanup: (() => void) | undefined;
let scheduled = false;

export const loadReplay = (onError = false): Promise<void> => {
  if (ready) return Promise.resolve();
  hadEarlyError ||= onError;
  if (loading) return loading;
  if (attempts >= 2) return Promise.resolve();
  loading ??= (async () => {
    attempts += 1;
    try {
      const { startReplay } = await import('@src/_app/lib/replay');
      const replay = startReplay();
      ready = true;
      cleanup?.();
      // The original error is sent immediately by Sentry. Only the DOM from
      // installation onward is available; never recapture the error to link it.
      if (hadEarlyError) {
        try {
          await replay.flush();
        } catch {
          console.warn('The deferred Session Replay could not be flushed.');
        }
      }
    } catch {
      loading = undefined;
      if (attempts < 2) window.setTimeout(() => void loadReplay(), 1000);
      else {
        cleanup?.();
        console.warn(
          'Session Replay could not be loaded; error monitoring remains active.',
        );
      }
    }
  })();
  return loading;
};

export const scheduleReplay = () => {
  if (scheduled || ready || attempts >= 2) return;
  scheduled = true;
  let idle: number | undefined;
  // Bound the wait even if window.load never arrives (e.g. a stalled resource).
  const deadline = window.setTimeout(() => void loadReplay(), 3000);
  const onInteraction = () => {
    void loadReplay();
  };
  const onLoad = () => {
    if (window.requestIdleCallback) {
      idle = window.requestIdleCallback(() => void loadReplay(), {
        timeout: 1500,
      });
    } else {
      void loadReplay();
    }
  };
  cleanup = () => {
    window.clearTimeout(deadline);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    window.removeEventListener('load', onLoad);
    window.removeEventListener('pointerdown', onInteraction, true);
    window.removeEventListener('keydown', onInteraction, true);
    window.removeEventListener('scroll', onInteraction, true);
  };
  window.addEventListener('pointerdown', onInteraction, {
    capture: true,
    passive: true,
  });
  window.addEventListener('keydown', onInteraction, {
    capture: true,
    passive: true,
  });
  window.addEventListener('scroll', onInteraction, {
    capture: true,
    passive: true,
  });
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
};
