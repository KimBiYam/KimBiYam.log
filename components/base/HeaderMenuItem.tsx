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
        <a className="flex text-sm font-bold py-2 hover:bg-gray-300">{label}</a>
      </Link>
    </li>
  );
};

export default memo(HeaderMenuItem);
