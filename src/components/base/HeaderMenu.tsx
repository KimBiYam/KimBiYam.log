import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import HeaderItem from './HeaderItem';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import MenuButton from './MenuButton';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import breakPoints from '../../lib/styles/breakPoints';

const VISIBLE_TRANSITION_MS = 300;

const HeaderMenu = () => {
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonRef);

  const isMediumScreen = useMediaQuery({ minWidth: breakPoints.md });

  useEffect(() => {
    if (isMediumScreen) {
      setIsMenuOpen(false);
    }
  }, [isMediumScreen]);

  const toggleMenu = () => {
    setIsMenuOpen((prevDropdownOpen) => !prevDropdownOpen);
  };

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className="relative w-6 h-6 ml-4 drop-shadow-md md:hidden"
      ref={menuButtonRef}
    >
      <MenuButton onClick={toggleMenu} />
      <motion.ul
        className="absolute right-0 w-32 p-2 rounded-md bg-blueGray-200 dark:bg-gray-700"
        {...createDynamicallyOpacityMotion(isMenuOpen, VISIBLE_TRANSITION_MS)}
      >
        <li>
          <HeaderItem href="/" label="Posts" onClick={handleItemClick} />
        </li>
        <li>
          <HeaderItem
            href="/contact"
            label="Contact"
            onClick={handleItemClick}
          />
        </li>
      </motion.ul>
    </div>
  );
};

export default HeaderMenu;
