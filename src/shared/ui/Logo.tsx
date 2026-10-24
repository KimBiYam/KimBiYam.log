import Link from 'next/link';

const Logo = () => (
  <Link
    href="/"
    className="shrink-0 text-[17px] font-extrabold tracking-[-0.02em] rounded-md focus-ring"
  >
    KimBiYam<span className="text-gradient-accent">.log</span>
  </Link>
);

export default Logo;
