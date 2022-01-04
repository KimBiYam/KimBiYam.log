import MenuIcon from '../../assets/svgs/menu.svg';

type MenuButtonProps = {
  onClick: () => void;
};

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <button
      className="w-6 h-6 md:hidden"
      onClick={onClick}
      aria-label="MenuButton"
    >
      <MenuIcon />
    </button>
  );
};

export default MenuButton;
