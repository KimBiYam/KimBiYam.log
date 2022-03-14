import ArrowUpIcon from '../../assets/svgs/arrow_up.svg';

const ScrollToTopButton = () => (
  <button
    type="button"
    className="fixed flex items-center justify-center w-10 h-10 rounded-full bg-blueGray-200 justify-items-center right-12 bottom-12 dark:bg-gray-700"
  >
    <div className="w-4 h-4 main-font-color">
      <ArrowUpIcon />
    </div>
  </button>
);

export default ScrollToTopButton;
