import Link from "next/link";
import HeaderMenuItem from "./HeaderMenuItem";

export type HeaderMenuProps = {};

const HeaderMenu = () => {
  return (
    <ul className="absolute right-0 z-50 bg-white w-32 p-2">
      <HeaderMenuItem href="/" label="About" />
      <HeaderMenuItem href="/introduction" label="Introduction" />
      <HeaderMenuItem href="/contact    " label="Contact" />
    </ul>
  );
};

export default HeaderMenu;
