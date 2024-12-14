'use client';

import { useAtomValue } from 'jotai';
import { motion } from 'motion/react';

import ArrowUpIcon from '@src/assets/svgs/arrow_up.svg';
import scrollAtom from '@src/atoms/scrollAtom';
import { createDynamicallyOpacityMotion } from '@src/lib/styles/motions';

const VISIBLE_TRANSITION_MS = 250;
const VISIBLE_PAGE_Y_PX = 500;

const ScrollToTopButton = () => {
  const { pageY } = useAtomValue(scrollAtom);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
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
        className="flex items-center justify-center w-10 h-10 transition-opacity duration-300 rounded-full primary-button drop-shadow-md justify-items-center hover:opacity-70"
      >
        <div className="w-4 h-4 main-font-color">
          <ArrowUpIcon />
        </div>
      </button>
    </motion.div>
  );
};

export default ScrollToTopButton;
