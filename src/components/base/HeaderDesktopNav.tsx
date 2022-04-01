import HeaderItem from './HeaderItem';

const HeaderDesktopNav = () => (
  <nav className="flex items-center justify-end flex-1">
    <div className="hidden ml-4 font-bold md:block">
      <HeaderItem href="/contact" label="Contact" />
    </div>
  </nav>
);

export default HeaderDesktopNav;
