'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { Fira_Code } from 'next/font/google';

import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify/lib';
import remarkGfm from 'remark-gfm';

import useCreateHeadingLink from '@src/hooks/useCreateHeadingLink';
import useMediumZoom from '@src/hooks/useMediumZoom';

const firaCode = Fira_Code({
  weight: '500',
  preload: false,
  display: 'swap',
  variable: '--font-fira-code',
});

interface MarkdownViewProps {
  contentHtml: string;
}

export default function MarkdownView({ contentHtml }: MarkdownViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { attach } = useMediumZoom();
  useCreateHeadingLink(ref);

  useEffect(() => {
    const images = ref.current?.querySelectorAll('img');
    if (!images) return;

    const paragraphChildImages = Array.from(images).filter(
      (el) => el.parentElement?.tagName === 'P',
    );

    attach?.(paragraphChildImages);
  }, [attach, ref]);

  return (
    <div className="w-full max-w-full prose dark:prose-dark" ref={ref}>
      <ReactMarkdown
        className={firaCode.variable}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism, rehypeSlug, rehypeStringify]}
      >
        {contentHtml}
      </ReactMarkdown>
    </div>
  );
}
