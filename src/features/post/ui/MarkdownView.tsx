/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';

import { Fira_Code } from 'next/font/google';
import Image from 'next/image';

import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

import { MediumZoom, Theme, useTheme } from '@src/shared';
import '@src/shared/styles/code.css';

import HeadingLink from './HeadingLink';
import { theme as tailwindTheme } from '../../../../tailwind.config';
import { POST_HEADING_TARGET_TAGS } from '../constants';
import { PostImageSize } from '../types';

type HeadingComponent = (props: {
  id: string;
  children: React.ReactNode;
}) => React.ReactNode;

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
              Record<string, HeadingComponent>
            >((acc, tag) => {
              const HeadingComponent: HeadingComponent = ({ children, id }) => (
                <HeadingLink id={id} tag={tag}>
                  {children}
                </HeadingLink>
              );

              acc[tag] = HeadingComponent;
              return acc;
            }, {}),
            img: (props) => {
              if (!props.src) return null;
              const imageSize = imageSizes?.[props.src];

              return imageSize ? (
                <MediumZoom margin={24} background={mediumZoomBackground}>
                  <Image
                    src={props.src}
                    alt={props.alt ?? 'Blog post image'}
                    width={imageSize?.width ?? 700}
                    height={imageSize?.height ?? 400}
                    /**
                     * set loading strategy to "eager" to temporally fix safari flickering issue
                     * https://github.com/vercel/next.js/discussions/20991
                     */
                    loading="eager"
                  />
                </MediumZoom>
              ) : (
                <MediumZoom margin={24} background={mediumZoomBackground}>
                  <img src={props.src} alt={props.alt ?? 'Blog post image'} />
                </MediumZoom>
              );
            },
          }}
        >
          {contentHtml}
        </ReactMarkdown>
      </div>
    );
  },
);
