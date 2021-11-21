import HeaderMenuItem from "./HeaderMenuItem";
import MenuIcon from "../../assets/svgs/menu.svg";
import { useEffect, useRef } from "react";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import { useMediaQuery } from "react-responsive";
import breakPoints from "../../lib/styles/breakPoints";

export type HeaderMenuProps = {};

const HeaderMenu = () => {
  const menuButtonref = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonref);

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

  return (
    <div className="relative ml-4" ref={menuButtonref}>
      <button className="w-6 h-2 md:hidden" onClick={toggleMenu}>
        <MenuIcon />
      </button>
      <ul
        className={`${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        } absolute right-0 transition-all duration-200 ease-in-out z-50 bg-white w-32 p-2`}
      >
        <HeaderMenuItem href="/" label="About" onClick={handleClick} />
        <HeaderMenuItem
          href="/introduction"
          label="Introduction"
          onClick={handleClick}
        />
        <HeaderMenuItem href="/contact" label="Contact" onClick={handleClick} />
      </ul>
    </div>
  );
};

export default HeaderMenu;
