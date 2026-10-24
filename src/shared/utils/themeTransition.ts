import { flushSync } from 'react-dom';

export interface TransitionOrigin {
  x: number;
  y: number;
}

const REVEAL_DURATION_MS = 500;
const REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const canUseViewTransition = () =>
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a synchronous state update inside a View Transition that reveals the
 * new state as a circle growing from `origin`. Falls back to an immediate
 * update when the API is unsupported or the user prefers reduced motion.
 */
export const runCircularTransition = (
  origin: TransitionOrigin,
  update: () => void,
) => {
  if (!canUseViewTransition()) {
    update();
    return;
  }

  const root = document.documentElement;
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  // Element transitions would animate under the snapshot and blend two themes.
  root.dataset.viewTransition = 'circular';

  // flushSync commits the update (including next-themes' class toggle effect)
  // before the browser captures the new snapshot.
  const transition = document.startViewTransition(() => flushSync(update));

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: REVEAL_DURATION_MS,
          easing: REVEAL_EASING,
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {
      // Skipped transitions reject `ready`; the update has already applied.
    });

  transition.finished.finally(() => {
    delete root.dataset.viewTransition;
  });
};
