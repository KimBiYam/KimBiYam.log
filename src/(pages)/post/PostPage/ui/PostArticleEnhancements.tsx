'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import mediumZoom from 'medium-zoom';
import { useMediaQuery } from 'react-responsive';

import { Theme, useMounted, useTheme } from '@src/shared';
import breakPoints from '@src/shared/styles/breakPoints.json';

import { theme as tailwindTheme } from '../../../../../tailwind.config';

const DynamicTableOfContents = dynamic(
  () => import('@src/features/post/ui/TableOfContents'),
);

const PostArticleEnhancements = () => {
  const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
  const mounted = useMounted();
  const { theme } = useTheme();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });
  const zoomBackground =
    theme === Theme.dark
      ? tailwindTheme.colors.neutral[900]
      : tailwindTheme.colors.white;

  useEffect(() => {
    const content = document.getElementById('post-content');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContentElement(content);

    if (!content) return;

    const zoom = mediumZoom(content.querySelectorAll('img'), {
      background: zoomBackground,
      margin: 24,
    });

    return () => {
      zoom.detach();
    };
  }, [zoomBackground]);

  if (!mounted || !isUpExtraLargeScreen) return null;

  return <DynamicTableOfContents targetElement={contentElement} />;
};

export default PostArticleEnhancements;
