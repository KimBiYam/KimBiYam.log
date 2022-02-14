import { memo } from 'react';

const Footer = () => (
  <footer className="flex justify-center pb-3 text-sm main-container">
    <p>
      <span>© 2021</span>
      <a
        href="https://github.com/KimBiYam"
        className="ml-1 font-bold underline"
      >
        KimBiYam
      </a>
    </p>
  </footer>
);

export default memo(Footer);
