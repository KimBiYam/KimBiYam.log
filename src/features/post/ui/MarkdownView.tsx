import 'server-only';

import React from 'react';
import { MarkdownAsync } from 'react-markdown';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

import '@src/shared/styles/code.css';

import MarkdownCodeBlock from './MarkdownCodeBlock';
import MarkdownHeading from './MarkdownHeading';
import MarkdownImage from './MarkdownImage';
import { POST_CONTENT_ID, POST_HEADING_TARGET_TAGS } from '../constants';
import { CODE_THEMES } from '../lib/codeTheme';
import { PostImageSize } from '../types';

interface MarkdownViewProps {
  contentHtml: string;
  imageSizes?: Record<string, PostImageSize>;
}

const MarkdownView = ({ contentHtml, imageSizes }: MarkdownViewProps) => (
  <div className="w-full max-w-full prose" id={POST_CONTENT_ID}>
    <MarkdownAsync
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        [
          rehypePrettyCode,
          {
            theme: CODE_THEMES,
            keepBackground: false,
            // Fences without a language (and unknown languages) render as plain text.
            defaultLang: { block: 'plaintext' },
          },
        ],
        rehypeSlug,
        rehypeStringify,
      ]}
      components={{
        ...POST_HEADING_TARGET_TAGS.reduce<
          Record<string, React.FC<{ id: string; children: React.ReactNode }>>
        >((acc, tag) => {
          acc[tag] = ({ id, children }) => (
            <MarkdownHeading id={id} tag={tag}>
              {children}
            </MarkdownHeading>
          );
          return acc;
        }, {}),
        figure: MarkdownCodeBlock,
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
    </MarkdownAsync>
  </div>
);

export default MarkdownView;
