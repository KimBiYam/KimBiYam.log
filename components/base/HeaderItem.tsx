import Link from "next/link";

export type HeaderItemProps = {
  href: string;
  label: string;
};

const HeaderItem = ({ href, label }: HeaderItemProps) => {
  return (
    <Link href={href}>
      <a className="block text-sm mr-4 px-2 py-1 hover:bg-warmGray-300 rounded-md transition-colors">
        {label}
      </a>
    </Link>
  );
};

export default HeaderItem;
