import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import HeaderItem from './HeaderItem';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import HeaderMenuButton from './HeaderMenuButton';
import { createDynamicallyOpacityMotion } from '../../lib/styles/motions';
import breakPoints from '../../lib/styles/breakPoints';

const VISIBLE_TRANSITION_MS = 300;

const HeaderMobileMenu = () => {
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonRef);

  const isUpMediumScreen = useMediaQuery({ minWidth: breakPoints.md });

  useEffect(() => {
    if (isUpMediumScreen) setIsMenuOpen(false);
  }, [isUpMediumScreen]);

  const toggleMenu = () => {
    setIsMenuOpen((prevDropdownOpen) => !prevDropdownOpen);
  };

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative md:hidden" ref={menuButtonRef}>
      <HeaderMenuButton onClick={toggleMenu} />
      <motion.ul
        className="absolute right-0 w-32 p-2 rounded-md drop-shadow-md bg-gray-50 dark:bg-neutral-700"
        {...createDynamicallyOpacityMotion(isMenuOpen, VISIBLE_TRANSITION_MS)}
      >
        <li>
          <HeaderItem href="/" label="POSTS" onClick={handleItemClick} />
        </li>
        <li>
          <HeaderItem
            href="/contact"
            label="CONTACT"
            onClick={handleItemClick}
          />
        </li>
      </motion.ul>
    </div>
  );
};

export default HeaderMobileMenu;
