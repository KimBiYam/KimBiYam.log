import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import favicon from '../../assets/favicon/apple-icon-57x57.png';

const Logo = () => (
  <Link href="/" passHref className="w-6 h-6">
    <Image priority src={favicon} alt="logo" quality={100} />
  </Link>
);

export default memo(Logo);
