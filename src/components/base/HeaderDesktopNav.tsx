import HeaderItem from './HeaderItem';

const HeaderDesktopNav = () => (
  <nav className="flex items-center justify-end flex-1 mr-4">
    <div className="hidden font-bold md:block">
      <HeaderItem href="/contact" label="CONTACT" />
    </div>
  </nav>
);

export default HeaderDesktopNav;
