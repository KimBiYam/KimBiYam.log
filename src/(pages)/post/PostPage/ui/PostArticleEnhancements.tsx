'use client';

import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

import { POST_CONTENT_ID } from '@src/features/post/client';
import { Theme, THEME_COLOR, useTheme } from '@src/shared';

const PostArticleEnhancements = () => {
  const { theme } = useTheme();
  const zoomBackground =
    theme === Theme.dark ? THEME_COLOR.dark : THEME_COLOR.light;

  useEffect(() => {
    const content = document.getElementById(POST_CONTENT_ID);
    if (!content) return;

    const zoom = mediumZoom(content.querySelectorAll('img'), {
      background: zoomBackground,
      margin: 24,
    });

    return () => {
      zoom.detach();
    };
  }, [zoomBackground]);

  return null;
};

export default PostArticleEnhancements;
