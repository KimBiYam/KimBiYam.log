import Link from "next/link";
import { memo } from "react";

export type HeaderMenuItemProps = {
  href: string;
  label: string;
  onClick: () => void;
};

const HeaderMenuItem = ({ href, label, onClick }: HeaderMenuItemProps) => {
  return (
    <li onClick={onClick}>
      <Link href={href}>
        <a className="flex text-sm font-bold px-1 py-2 my-1 rounded-md hover:bg-white dark:hover:bg-warmGray-800 transition-colors">
          {label}
        </a>
      </Link>
    </li>
  );
};

export default memo(HeaderMenuItem);
