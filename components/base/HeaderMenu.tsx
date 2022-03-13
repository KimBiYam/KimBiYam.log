import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import HeaderMenuItem from './HeaderMenuItem';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import breakPoints from '../../lib/styles/breakPoints';
import { generateDialogMotion } from '../../lib/styles/motions';
import MenuButton from './MenuButton';

const VISIBLE_TRANSITION_MS = 300;

const HeaderMenu = () => {
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonRef);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const isMediumScreen = useMediaQuery({ minWidth: breakPoints.md });

  const toggleMenu = () => {
    setIsMenuOpen((prevDropdownOpen) => !prevDropdownOpen);
  };

  const handleClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMediumScreen) {
      setIsMenuOpen(false);
    }
  }, [isMediumScreen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMenuOpen) {
      setIsMenuVisible(true);
    } else {
      timeoutId = setTimeout(
        () => setIsMenuVisible(false),
        VISIBLE_TRANSITION_MS,
      );
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMenuOpen, setIsMenuVisible]);

  return (
    <div className="relative w-6 h-6 ml-4 drop-shadow-md" ref={menuButtonRef}>
      <MenuButton onClick={toggleMenu} />
      {isMenuVisible && (
        <motion.ul
          className="absolute right-0 w-32 p-2 rounded-md bg-blueGray-200 dark:bg-gray-700"
          {...generateDialogMotion(isMenuOpen, VISIBLE_TRANSITION_MS / 1000)}
        >
          <HeaderMenuItem href="/" label="Posts" onClick={handleClick} />
          <HeaderMenuItem
            href="/contact"
            label="Contact"
            onClick={handleClick}
          />
        </motion.ul>
      )}
    </div>
  );
};

export default HeaderMenu;
