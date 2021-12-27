import { memo } from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center pb-3 text-sm main-container">
      <p>
        <span>© 2021</span>
        <a
          href="https://github.com/KimBiYam"
          className="underline ml-1 font-bold"
        >
          KimBiYam
        </a>
      </p>
    </footer>
  );
};

export default memo(Footer);
