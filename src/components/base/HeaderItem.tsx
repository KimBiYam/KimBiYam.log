import { memo } from 'react';

import NoScrollLink from './NoScrollLink';

interface HeaderItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const HeaderItem = ({ href, label, onClick }: HeaderItemProps) => (
  <NoScrollLink
    href={href}
    onClick={onClick}
    className="flex px-2 py-2 my-1 text-sm font-bold rounded-md primary-button-hover"
  >
    {label}
  </NoScrollLink>
);

export default memo(HeaderItem);
