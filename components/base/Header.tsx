import { memo } from "react";
import Link from "next/link";
import HeaderItem from "./HeaderItem";
import HeaderMenu from "./HeaderMenu";
import DarkModeButton from "./DarkModeButton";
import Image from "next/image";
import favicon from "../../assets/favicon/favicon-192x192.png";

const Header = () => {
  return (
    <header className="fixed w-full h-12 z-50 flex items-center transition-container">
      <div className="container max-w-screen-md px-8 flex justify-between items-center text-black dark:text-warmGray-400">
        <Link href="/" passHref>
          <button type="button" className="p-2 flex">
            <Image
              src={favicon}
              alt="logo"
              width="24px"
              height="24px"
              quality={100}
              className=" cursor-pointer"
            />
          </button>
        </Link>
        <nav className="flex flex-1 items-center justify-end">
          <div className="ml-4 hidden md:block font-bold">
            <HeaderItem href="/introduce" label="Introduce" />
          </div>
        </nav>
        <div className="flex">
          <DarkModeButton />
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
