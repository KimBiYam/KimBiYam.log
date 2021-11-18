import { memo, useCallback, useRef } from "react";
import Link from "next/link";
import HeaderItem from "./HeaderItem";
import MenuIcon from "../../assets/svgs/menu.svg";
import HeaderMenu from "./HeaderMenu";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";

export type HeaderProps = {};

const Header = () => {
  const menuButtonref = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useDetectOutsideClick(menuButtonref);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevDropdownOpen) => !prevDropdownOpen);
  }, [setIsMenuOpen]);

  return (
    <header className="fixed w-full h-8 flex items-center">
      <div className="container max-w-screen-md px-4 flex justify-between">
        <nav className="flex">
          <Link href="/">
            <a className="block lg:mt-0 font-bold">ChangHyun Kim</a>
          </Link>
          <div className="ml-10 hidden md:flex">
            <HeaderItem href="/introduction" label="Introduction" />
            <HeaderItem href="/contact" label="Contact" />
          </div>
        </nav>
        <div className="relative" ref={menuButtonref}>
          <button className="w-6 h-2 md:hidden" onClick={toggleMenu}>
            <MenuIcon />
          </button>
          {isMenuOpen && <HeaderMenu />}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
