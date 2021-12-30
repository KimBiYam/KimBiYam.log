import Link from 'next/link';

export type HeaderItemProps = {
  href: string;
  label: string;
};

const HeaderItem = ({ href, label }: HeaderItemProps) => {
  return (
    <Link href={href}>
      <a className="block text-sm mr-4 px-2 py-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors">
        {label}
      </a>
    </Link>
  );
};

export default HeaderItem;
