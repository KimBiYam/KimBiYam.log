import { memo } from "react";
import MoonIcon from "../../assets/svgs/moon.svg";
import SunIcon from "../../assets/svgs/sun.svg";
import useThemeStorage from "../../hooks/useThemeStorage";
import { Theme } from "../../lib/styles/theme";

export type DarkModeButtonProps = {};

const DarkModeButton = () => {
  const { theme, toggleTheme } = useThemeStorage();

  return (
    <label
      className="relative flex justify-center items-center cursor-pointer"
      onChange={toggleTheme}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={theme === Theme.dark}
        readOnly
      />
      <div className="flex justify-between items-center w-14 h-6 bg-black rounded-full">
        <div className="flex-1 p-1 text-violet-400">
          <MoonIcon />
        </div>
        <div className="flex-1 p-1 text-yellow-400">
          <SunIcon />
        </div>
      </div>
      <div className="w-5 h-5 absolute top-2/4 -translate-y-1/2 left-1 bg-white rounded-full peer-checked:translate-x-7 transition-transform duration-300" />
    </label>
  );
};

export default memo(DarkModeButton);
