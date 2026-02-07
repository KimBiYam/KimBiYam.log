'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';

import { Fira_Code } from 'next/font/google';

import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

import { Theme, useTheme } from '@src/shared';
import '@src/shared/styles/code.css';

import MarkdownHeading from './MarkdownHeading';
import MarkdownImage from './MarkdownImage';
import { theme as tailwindTheme } from '../../../../tailwind.config';
import { POST_HEADING_TARGET_TAGS } from '../constants';
import { PostImageSize } from '../types';

const firaCode = Fira_Code({
  weight: '500',
  preload: false,
  display: 'block',
  variable: '--font-fira-code',
});

interface MarkdownViewProps {
  contentHtml: string;
  imageSizes?: Record<string, PostImageSize>;
}

export default React.forwardRef<HTMLDivElement, MarkdownViewProps>(
  function MarkdownView({ contentHtml, imageSizes }, ref) {
    const { theme } = useTheme();

    const mediumZoomBackground =
      theme === Theme.dark
        ? tailwindTheme.colors.neutral[900]
        : tailwindTheme.colors.white;

    return (
      <div className="w-full max-w-full prose dark:prose-dark" ref={ref}>
        <ReactMarkdown
          className={firaCode.variable}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypePrism as PluggableList[number],
            rehypeSlug,
            rehypeStringify,
          ]}
          components={{
            ...POST_HEADING_TARGET_TAGS.reduce<
              Record<
                string,
                React.FC<{ id: string; children: React.ReactNode }>
              >
            >((acc, tag) => {
              acc[tag] = ({ id, children }) => (
                <MarkdownHeading id={id} tag={tag}>
                  {children}
                </MarkdownHeading>
              );
              return acc;
            }, {}),
            img: (props) => (
              <MarkdownImage
                {...props}
                imageSizes={imageSizes}
                mediumZoomBackground={mediumZoomBackground}
              />
            ),
          }}
        >
          {contentHtml}
        </ReactMarkdown>
      </div>
    );
  },
);
