import { memo } from "react";
import MoonIcon from "../../assets/svgs/moon.svg";
import useThemeStorage from "../../hooks/useThemeStorage";

export type DarkModeButtonProps = {};

const DarkModeButton = () => {
  const { toggleTheme } = useThemeStorage();

  return (
    <button type="button" className="flex w-6" onClick={toggleTheme}>
      <MoonIcon />
    </button>
  );
};

export default memo(DarkModeButton);
