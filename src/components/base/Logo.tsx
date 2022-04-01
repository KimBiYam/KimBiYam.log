import Image from 'next/image';
import Link from 'next/link';
import favicon from '../../assets/favicon/favicon-192x192.png';

const Logo = () => (
  <Link href="/" passHref>
    <Image
      src={favicon}
      alt="logo"
      width="24px"
      height="24px"
      quality={100}
      className="cursor-pointer"
    />
  </Link>
);

export default Logo;
