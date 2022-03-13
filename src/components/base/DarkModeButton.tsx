import { motion } from 'framer-motion';
import { memo } from 'react';
import MoonIcon from '../../assets/svgs/moon.svg';
import SunIcon from '../../assets/svgs/sun.svg';
import { Theme } from '../../constants';
import useTheme from '../../hooks/useTheme';

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      onClick={toggleTheme}
    >
      <div className="flex items-center justify-between h-6 bg-black rounded-full w-14">
        <div className="flex-1 p-1 text-violet-400">
          <MoonIcon />
        </div>
        <div className="flex-1 p-1 text-yellow-400">
          <SunIcon />
        </div>
      </div>
      <div
        className={`absolute w-full px-1 flex justify-start ${
          theme === Theme.dark && 'justify-end'
        }`}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full"
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28,
          }}
        />
      </div>
    </div>
  );
};

export default memo(DarkModeButton);
