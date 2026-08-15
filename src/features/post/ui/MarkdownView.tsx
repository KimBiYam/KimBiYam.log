import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Fira_Code } from 'next/font/google';
import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

import '@src/shared/styles/code.css';

import MarkdownHeading from './MarkdownHeading';
import MarkdownImage from './MarkdownImage';
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

const MarkdownView = ({ contentHtml, imageSizes }: MarkdownViewProps) => (
      <div
        className="w-full max-w-full prose dark:prose-dark"
        id="post-content"
      >
        <ReactMarkdown
          className={firaCode.variable}
          remarkPlugins={[remarkGfm]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins={[rehypePrism as any, rehypeSlug, rehypeStringify]}
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
                src={typeof props.src === 'string' ? props.src : undefined}
                imageSizes={imageSizes}
              />
            ),
          }}
        >
          {contentHtml}
        </ReactMarkdown>
      </div>
);

export default MarkdownView;
