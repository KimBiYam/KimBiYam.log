import MenuIcon from '../../assets/svgs/menu.svg';

type MenuButtonProps = {
  onClick: () => void;
};

const MenuButton = ({ onClick }: MenuButtonProps) => (
  <button
    className="p-2 rounded-full md:hidden primary-button-hover"
    onClick={onClick}
    aria-label="MenuButton"
    type="button"
  >
    <div className="w-6 h-6">
      <MenuIcon />
    </div>
  </button>
);

export default MenuButton;
