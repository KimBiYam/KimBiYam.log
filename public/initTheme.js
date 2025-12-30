/* eslint-disable no-undef */
const getTheme = () => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const applyTheme = () => {
  const theme = getTheme();

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

applyTheme();

document.addEventListener('astro:before-swap', (event) => {
  const theme = getTheme();

  if (theme === 'dark') {
    event.newDocument.documentElement.classList.add('dark');
  } else {
    event.newDocument.documentElement.classList.remove('dark');
  }
});
