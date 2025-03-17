export function mergeRefs<T>(...inputRefs: Array<React.Ref<T> | undefined>) {
  if (inputRefs.length <= 1) {
    return inputRefs[0] ?? null;
  }

  return function mergedRefs(ref: T) {
    for (const inputRef of inputRefs) {
      if (typeof inputRef === 'function') {
        inputRef(ref);
      } else if (inputRef) {
        (inputRef as React.MutableRefObject<T | null>).current = ref;
      }
    }
  };
}
