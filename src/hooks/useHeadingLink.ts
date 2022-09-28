import { useEffect } from 'react';

const LINK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
</svg>`;

const useHeadingLink = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const originalHeadingElements: Map<Element, string> = new Map();
    const headingElements = ref.current?.querySelectorAll('h2,h3');
    if (!headingElements) return;

    [...headingElements]?.forEach((headingEl) => {
      originalHeadingElements.set(headingEl, headingEl.innerHTML);

      headingEl.classList.add('flex');

      const anchorEl = document.createElement('a');
      anchorEl.href = `#${headingEl.id}`;
      anchorEl.innerHTML = headingEl.innerHTML;
      anchorEl.classList.add(
        'flex',
        'items-center',
        'no-underline',
        'hover:underline',
        'group',
      );

      const iconEl = document.createElement('span');
      iconEl.classList.add('hidden', 'group-hover:block', 'opacity-60', 'ml-1');
      iconEl.innerHTML = LINK_ICON_SVG;

      // eslint-disable-next-line no-param-reassign
      headingEl.innerHTML = '';
      anchorEl.appendChild(iconEl);
      headingEl.appendChild(anchorEl);
    });
  }, [ref]);
};

export default useHeadingLink;
