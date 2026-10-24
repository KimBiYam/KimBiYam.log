import { FEED_PATH } from '@src/shared/constants/metadata';
import { PROFILE } from '@src/shared/constants/profile';

const footerLinkClassName =
  'rounded-sm transition-colors duration-300 hover:text-foreground focus-ring';

const Footer = () => (
  <footer className="border-t border-line">
    <div className="flex items-center justify-between max-w-[1040px] gap-4 px-6 py-7 mx-auto text-[13px] text-muted">
      {/* The year is rendered at build time, so tolerate a client mismatch. */}
      <p suppressHydrationWarning>
        © 2021–{new Date().getFullYear()} KimBiYam
      </p>
      <div className="flex gap-5">
        <a href={PROFILE.social.github} className={footerLinkClassName}>
          GitHub
        </a>
        <a href={FEED_PATH} className={footerLinkClassName}>
          RSS
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
