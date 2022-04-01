import Image from 'next/image';
import Link from 'next/link';
import favicon from '../../assets/favicon/favicon-192x192.png';

const Logo = () => (
  <Link href="/" passHref>
    <a className="w-6 h-6">
      <Image
        src={favicon}
        alt="logo"
        quality={100}
        className="cursor-pointer"
      />
    </a>
  </Link>
);

export default Logo;
