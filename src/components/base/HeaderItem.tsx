import Link from 'next/link';

export type HeaderItemProps = {
  href: string;
  label: string;
};

const HeaderItem = ({ href, label }: HeaderItemProps) => (
  <Link href={href}>
    <a className="block px-2 py-1 mr-4 text-sm transition-colors rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
      {label}
    </a>
  </Link>
);

export default HeaderItem;
