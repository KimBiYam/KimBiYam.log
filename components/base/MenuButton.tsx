import MenuIcon from '../../assets/svgs/menu.svg';

type MenuButtonProps = {
  onClick: () => void;
};

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <button
      className="w-full h-full md:hidden flex items-center"
      onClick={onClick}
      aria-label="MenuButton"
    >
      <MenuIcon />
    </button>
  );
};

export default MenuButton;
