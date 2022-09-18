import { m } from 'framer-motion';
import { useAtomValue } from 'jotai';

import ArrowUpIcon from '../../assets/svgs/arrow_up.svg';
import scrollAtom from '../../atoms/scrollAtom';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';

const VISIBLE_TRANSITION_MS = 250;
const VISIBLE_PAGE_Y_PX = 500;

const ScrollToTopButton = () => {
  const { pageY } = useAtomValue(scrollAtom);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <m.div
      className="fixed z-50 right-4 bottom-12 md:right-8 lg:right-16"
      {...createDynamicallyOpacityMotion(
        pageY > VISIBLE_PAGE_Y_PX,
        VISIBLE_TRANSITION_MS,
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="scroll-to-top-button"
        className="flex items-center justify-center w-10 h-10 rounded-full transition-opacity duration-300 primary-button drop-shadow-md justify-items-center hover:opacity-70"
      >
        <div className="w-4 h-4 main-font-color">
          <ArrowUpIcon />
        </div>
      </button>
    </m.div>
  );
};

export default ScrollToTopButton;
