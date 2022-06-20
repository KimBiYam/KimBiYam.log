import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import favicon from '../../assets/favicon/apple-icon-57x57.png';

const Logo = () => (
  <Link href="/" passHref>
    <a className="absolute w-6 h-6">
      <Image priority src={favicon} alt="logo" layout="fill" quality={100} />
    </a>
  </Link>
);

export default memo(Logo);
