import { motion } from 'framer-motion';
import { memo } from 'react';
import MoonIcon from '../../assets/svgs/moon.svg';
import SunIcon from '../../assets/svgs/sun.svg';
import { Theme } from '../../constants';
import useThemeStorage from '../../hooks/useThemeStorage';

const DarkModeButton = () => {
  const { theme, toggleTheme } = useThemeStorage();

  return (
    <div
      className="relative flex justify-center items-center cursor-pointer"
      onClick={toggleTheme}
    >
      <div className="flex justify-between items-center w-14 h-6 bg-black rounded-full">
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
