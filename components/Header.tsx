import { memo } from "react";
import Link from "next/link";

export type HeaderProps = {};

const Header = () => {
  return (
    <header className="fixed w-full h-8 flex items-center">
      <div className="container mx-auto flex justify-between">
        <div className="flex">
          <Link href="/">
            <a className="block lg:mt-0 mr-4">Main</a>
          </Link>
          <Link href="/introduction">
            <a className="block lg:mt-0 mr-4">Introduction</a>
          </Link>
          <Link href="/contact">
            <a className="block lg:mt-0 mr-4">Contact</a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
