import Link from "next/link";

export type HeaderMenuItemProps = {
  href: string;
  label: string;
};

const HeaderMenuItem = ({ href, label }: HeaderMenuItemProps) => {
  return (
    <li>
      <Link href={href}>
        <a className="flex text-sm font-bold py-2 hover:bg-gray-300">{label}</a>
      </Link>
    </li>
  );
};

export default HeaderMenuItem;
