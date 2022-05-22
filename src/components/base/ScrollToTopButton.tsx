import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import ArrowUpIcon from '../../assets/svgs/arrow_up.svg';
import scrollState from '../../atoms/scrollState';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';

const VISIBLE_TRANSITION_MS = 250;
const VISIBLE_PAGE_Y_PX = 500;

const ScrollToTopButton = () => {
  const { pageY } = useRecoilValue(scrollState);

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
        className={`flex items-center justify-center w-10 h-10 transition-opacity duration-300 rounded-full drop-shadow-md
        bg-blueGray-200 justify-items-center dark:bg-neutral-700 hover:opacity-70`}
      >
        <div className="w-4 h-4 main-font-color">
          <ArrowUpIcon />
        </div>
      </button>
    </motion.div>
  );
};

export default ScrollToTopButton;
