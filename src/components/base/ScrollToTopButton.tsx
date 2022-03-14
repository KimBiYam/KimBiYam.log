import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import ArrowUpIcon from '../../assets/svgs/arrow_up.svg';
import scrollUpState from '../../atoms/scrollUpState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';

const VISIBLE_TRANSITION_MS = 250;

const ScrollToTopButton = () => {
  const isScrollUp = useRecoilValue(scrollUpState);

  return (
    <motion.div
      className="fixed z-50 right-4 bottom-12 md:right-8 lg:right-16"
      {...createDynamicallyOpacityMotion(!isScrollUp, VISIBLE_TRANSITION_MS)}
    >
      <button
        type="button"
        className="flex items-center justify-center w-10 h-10 rounded-full drop-shadow-md bg-blueGray-200 justify-items-center dark:bg-gray-700"
      >
        <div className="w-4 h-4 main-font-color">
          <ArrowUpIcon />
        </div>
      </button>
    </motion.div>
  );
};

export default ScrollToTopButton;
