'use client';

import { forwardRef, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify/lib';
import remarkGfm from 'remark-gfm';

import useMediumZoom from '../../hooks/useMediumZoom';

interface MarkdownViewProps {
  contentHtml: string;
}

const MarkdownView = forwardRef(function MarkdownView(
  { contentHtml }: MarkdownViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ref = forwardedRef ?? innerRef;

  useMediumZoom(ref);

  return (
    <div className="w-full max-w-full prose dark:prose-dark" ref={ref}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism, rehypeSlug, rehypeStringify]}
      >
        {contentHtml}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownView;
