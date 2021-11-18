import HeaderMenuItem from "./HeaderMenuItem";
import MenuIcon from "../../assets/svgs/menu.svg";
import { useCallback, useEffect, useRef } from "react";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import { useMediaQuery } from "react-responsive";
import breakPoints from "../../lib/styles/breakPoints";

export type HeaderMenuProps = {};

const HeaderMenu = () => {
  const menuButtonref = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonref);

  const isMediumScreen = useMediaQuery({ minWidth: breakPoints.md });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevDropdownOpen) => !prevDropdownOpen);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (isMediumScreen) {
      setIsMenuOpen(false);
    }
  }, [isMediumScreen]);

  return (
    <div className="relative" ref={menuButtonref}>
      <button className="w-6 h-2 md:hidden" onClick={toggleMenu}>
        <MenuIcon />
      </button>
      {isMenuOpen && (
        <ul className="absolute right-0 z-50 bg-white w-32 p-2">
          <HeaderMenuItem href="/" label="About" />
          <HeaderMenuItem href="/introduction" label="Introduction" />
          <HeaderMenuItem href="/contact" label="Contact" />
        </ul>
      )}
    </div>
  );
};

export default HeaderMenu;
