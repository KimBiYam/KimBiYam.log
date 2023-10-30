import MenuIcon from '@src/assets/svgs/menu.svg';

type HeaderMenuButtonProps = {
  onClick: () => void;
};

const HeaderMenuButton = ({ onClick }: HeaderMenuButtonProps) => (
  <button
    className="p-2 ml-1 rounded-full md:hidden primary-button-hover"
    onClick={onClick}
    aria-label="MenuButton"
    type="button"
  >
    <div className="w-6 h-6">
      <MenuIcon />
    </div>
  </button>
);

export default HeaderMenuButton;
