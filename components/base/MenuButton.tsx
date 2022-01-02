import MenuIcon from './MenuIcon';

type MenuButtonProps = {
  onClick: () => void;
  isMenuOpen: boolean;
};

const MenuButton = ({ onClick, isMenuOpen }: MenuButtonProps) => {
  return (
    <button
      className="w-full h-full md:hidden flex items-center"
      onClick={onClick}
      aria-label="MenuButton"
    >
      <MenuIcon isOpen={isMenuOpen} />
    </button>
  );
};

export default MenuButton;
