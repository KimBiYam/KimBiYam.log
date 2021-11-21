import HeaderMenuItem from "./HeaderMenuItem";
import MenuIcon from "../../assets/svgs/menu.svg";
import { useEffect, useRef, useState } from "react";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import { useMediaQuery } from "react-responsive";
import breakPoints from "../../lib/styles/breakPoints";

export type HeaderMenuProps = {};

const HeaderMenu = () => {
  const menuButtonref = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonref);
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
    const VISIBLE_TRANSITION_MS = 200;
    let timeoutId: NodeJS.Timeout;

    if (isMenuOpen) {
      setIsMenuVisible(true);
    } else {
      timeoutId = setTimeout(
        () => setIsMenuVisible(false),
        VISIBLE_TRANSITION_MS
      );
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMenuOpen, setIsMenuVisible]);

  return (
    <div className="relative ml-4" ref={menuButtonref}>
      <button className="w-6 h-2 md:hidden" onClick={toggleMenu}>
        <MenuIcon />
      </button>
      {isMenuVisible && (
        <ul
          className={`${
            isMenuOpen
              ? "visible animate-fade-in"
              : "invisible animate-fade-out"
          } absolute right-0 transition-all z-50 rounded-md bg-white w-32 p-2`}
        >
          <HeaderMenuItem href="/" label="About" onClick={handleClick} />
          <HeaderMenuItem
            href="/introduction"
            label="Introduction"
            onClick={handleClick}
          />
          <HeaderMenuItem
            href="/contact"
            label="Contact"
            onClick={handleClick}
          />
        </ul>
      )}
    </div>
  );
};

export default HeaderMenu;
