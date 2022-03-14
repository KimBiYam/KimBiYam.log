import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import smoothscroll from 'smoothscroll-polyfill';
import { useEffect } from 'react';
import ArrowUpIcon from '../../assets/svgs/arrow_up.svg';
import scrollUpState from '../../atoms/scrollUpState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';

const VISIBLE_TRANSITION_MS = 250;

const ScrollToTopButton = () => {
  const isScrollUp = useRecoilValue(scrollUpState);

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      className="fixed z-50 right-4 bottom-12 md:right-8 lg:right-16"
      {...createDynamicallyOpacityMotion(!isScrollUp, VISIBLE_TRANSITION_MS)}
    >
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center w-10 h-10 transition-opacity duration-300 rounded-full drop-shadow-md
        bg-blueGray-200 justify-items-center dark:bg-gray-700 hover:opacity-70`}
      >
        <div className="w-4 h-4 main-font-color">
          <ArrowUpIcon />
        </div>
      </button>
    </motion.div>
  );
};

export default ScrollToTopButton;
