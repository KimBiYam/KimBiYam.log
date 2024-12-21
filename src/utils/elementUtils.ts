export const findElementsByTags = (
  element: HTMLElement,
  targetTags: string[] | readonly string[],
): HTMLElement[] => {
  return Array.from(element.children).reduce<HTMLElement[]>(
    (results, child) => {
      if (!(child instanceof HTMLElement)) return results;

      const newResults = targetTags.includes(child.tagName.toLowerCase())
        ? [...results, child]
        : results;

      return [...newResults, ...findElementsByTags(child, targetTags)];
    },
    [],
  );
};
