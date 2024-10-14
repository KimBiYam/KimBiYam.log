const customViewportCorrectionVariable = 'vh';

function setViewportProperty(document) {
  let prevClientHeight;
  const customVar = `--${customViewportCorrectionVariable || 'vh'}`;
  (function handleResize() {
    const { clientHeight } = document;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(() => {
      document.style.setProperty(customVar, `${clientHeight * 0.01}px`);
      prevClientHeight = clientHeight;
    });
  })();
}
window.addEventListener(
  'resize',
  setViewportProperty(document.documentElement),
);
