'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { Theme } from '@src/shared/constants';
import useTheme from '@src/shared/hooks/useTheme';

const ORIGIN = 'https://utteranc.es';
const getTheme = (theme: Theme) =>
  theme === Theme.dark ? 'github-dark' : 'github-light';

const CommentThread = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
    ref.current
      ?.querySelector<HTMLIFrameElement>('iframe.utterances-frame')
      ?.contentWindow?.postMessage(
        { type: 'set-theme', theme: getTheme(theme) },
        ORIGIN,
      );
  }, [theme]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let active = true;
    let loaded = false;
    let frame: HTMLIFrameElement | null = null;
    const syncTheme = () => {
      if (!active) return;
      frame?.contentWindow?.postMessage(
        { type: 'set-theme', theme: getTheme(themeRef.current) },
        ORIGIN,
      );
    };
    const mutations = new MutationObserver(() => {
      const nextFrame = container.querySelector<HTMLIFrameElement>(
        'iframe.utterances-frame',
      );
      if (nextFrame === frame) return;
      frame?.removeEventListener('load', syncTheme);
      frame = nextFrame;
      frame?.addEventListener('load', syncTheme);
      syncTheme();
    });
    mutations.observe(container, { childList: true, subtree: true });

    const load = () => {
      if (loaded || !active) return;
      loaded = true;
      const script = document.createElement('script');
      const config = {
        src: `${ORIGIN}/client.js`,
        repo: 'KimBiYam/KimBiYam.log',
        branch: 'master',
        theme: getTheme(themeRef.current),
        label: 'comment',
        'issue-term': 'pathname',
        crossorigin: 'anonymous',
      };
      for (const [key, value] of Object.entries(config))
        script.setAttribute(key, value);
      script.async = true;
      container.appendChild(script);
    };
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                observer?.disconnect();
                load();
              }
            },
            { rootMargin: '600px 0px' },
          )
        : null;
    if (observer) observer.observe(container);
    else load();

    return () => {
      active = false;
      observer?.disconnect();
      mutations.disconnect();
      frame?.removeEventListener('load', syncTheme);
      container.replaceChildren();
    };
  }, []);

  return <div className="min-h-64" ref={ref} />;
};

const Utterances = () => {
  const pathname = usePathname();
  return <CommentThread key={pathname} />;
};

export default Utterances;
