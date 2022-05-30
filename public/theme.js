(() => {
  const OS_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const THEME_STORAGE_KEY = 'theme';

  function getStorageTheme() {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);

    if (theme === null && window.matchMedia(OS_DARK_MODE_QUERY).matches) {
      return DARK_THEME;
    }

    if (theme === null) {
      return LIGHT_THEME;
    }

    return theme;
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  function changeTheme(theme) {
    if (theme === DARK_THEME) {
      document.documentElement.classList.add(DARK_THEME);
    } else {
      document.documentElement.classList.remove(DARK_THEME);
    }
  }

  const theme = getStorageTheme();
  setTheme(theme);
  changeTheme(theme);
})();
