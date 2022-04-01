import DarkModeButton from './DarkModeButton';
import HeaderMobileMenu from './HeaderMobileMenu';

const HeaderButtonSection = () => (
  <section className="flex">
    <DarkModeButton />
    <HeaderMobileMenu />
  </section>
);

export default HeaderButtonSection;
