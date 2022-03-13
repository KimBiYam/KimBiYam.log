const throttle = (callback: () => void, throttleTimeMs: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return () => {
    if (timeoutId) {
      return;
    }

    timeoutId = setTimeout(() => {
      callback();
      timeoutId = null;
    }, throttleTimeMs);
  };
};

export default throttle;
