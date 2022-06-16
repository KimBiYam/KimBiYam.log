import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import favicon from '../../assets/favicon/favicon-32x32.png';

const Logo = () => (
  <Link href="/" passHref>
    <a className="w-6 h-6">
      <Image
        priority
        src={favicon}
        alt="logo"
        quality={100}
        width={24}
        height={24}
      />
    </a>
  </Link>
);

export default memo(Logo);
