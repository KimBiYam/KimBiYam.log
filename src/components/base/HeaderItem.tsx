import { memo } from 'react';

import Link from 'next/link';

interface HeaderItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const HeaderItem = ({ href, label, onClick }: HeaderItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex px-2 py-2 my-1 text-sm font-bold rounded-md primary-button-hover"
  >
    {label}
  </Link>
);

export default memo(HeaderItem);
