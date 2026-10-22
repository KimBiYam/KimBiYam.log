'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import useMediaQuery from '@src/shared/hooks/useMediaQuery';
import breakPoints from '@src/shared/styles/breakPoints.json';

import type { Zoom } from 'medium-zoom';

import '@src/(pages)/post/PostPage/ui/postZoom.css';

const DynamicTableOfContents = dynamic(
  () => import('@src/features/post/ui/TableOfContents'),
);

const PostArticleEnhancements = () => {
  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null,
  );
  const isUpExtraLargeScreen = useMediaQuery(`(min-width: ${breakPoints.xl})`);

  useEffect(() => {
    const content = document.getElementById('post-content');

    setContentElement(content);
    if (!content) return;

    let disposed = false;
    let zoom: Zoom | undefined;
    let loading: Promise<Zoom | undefined> | undefined;
    const loadZoom = () => {
      loading ??= import('medium-zoom')
        .then(({ default: mediumZoom }) => {
          if (disposed) return;
          zoom = mediumZoom(content.querySelectorAll('img'), {
            background: 'var(--post-zoom-background)',
            margin: 24,
          });
          return zoom;
        })
        .catch(() => {
          // Keep the original image usable; a later click can retry the chunk.
          loading = undefined;
          return undefined;
        });
      return loading;
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLImageElement) || zoom) return;
      const target = event.target;
      void loadZoom().then((loadedZoom) => {
        if (!disposed && target.isConnected) void loadedZoom?.open({ target });
      });
    };
    content.addEventListener('click', handleClick, true);
    const idle = window.requestIdleCallback?.(() => void loadZoom(), {
      timeout: 1500,
    });
    const timer =
      idle === undefined ? window.setTimeout(loadZoom, 0) : undefined;

    return () => {
      disposed = true;
      content.removeEventListener('click', handleClick, true);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      if (!zoom) return;
      const instance = zoom;
      if (!instance.getZoomedImage()) {
        instance.detach();
        return;
      }
      // close() is ignored during opening/HD loading. Retry once opened,
      // then detach after the library has cleared its active image state.
      const closeAfterOpen = () => void instance.close();
      const detachAfterClose = () => {
        queueMicrotask(() => {
          instance.off('opened', closeAfterOpen);
          instance.off('closed', detachAfterClose);
          instance.detach();
        });
      };
      instance.on('opened', closeAfterOpen, { once: true });
      instance.on('closed', detachAfterClose, { once: true });
      void instance.close();
    };
  }, []);

  if (!isUpExtraLargeScreen) return null;
  return <DynamicTableOfContents targetElement={contentElement} />;
};

export default PostArticleEnhancements;
