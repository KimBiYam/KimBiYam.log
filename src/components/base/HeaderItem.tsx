import Link from 'next/link';
import { memo } from 'react';

export interface HeaderItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const HeaderItem = ({ href, label, onClick }: HeaderItemProps) => (
  <Link href={href}>
    <a
      onClick={onClick}
      className="flex px-2 py-2 my-1 text-sm font-bold transition-colors rounded-md primary-button-hover"
    >
      {label}
    </a>
  </Link>
);

export default memo(HeaderItem);
