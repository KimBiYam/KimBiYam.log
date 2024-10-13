'use client';

import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { Fira_Code } from 'next/font/google';
import Image from 'next/image';

import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

import useCreateHeadingLink from '@src/hooks/useCreateHeadingLink';
import useMediumZoom from '@src/hooks/useMediumZoom';
import '@src/lib/styles/code.css';
import { PostImageSize } from '@src/types/post.types';

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

export default function MarkdownView({
  contentHtml,
  imageSizes,
}: MarkdownViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { attach } = useMediumZoom();

  useCreateHeadingLink(containerRef);

  const applyMediumZoom = (imageEl: HTMLImageElement | null) => {
    if (!imageEl || !attach) return;
    attach(imageEl);
  };

  return (
    <div className="w-full max-w-full prose dark:prose-dark" ref={containerRef}>
      <ReactMarkdown
        className={firaCode.variable}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism, rehypeSlug, rehypeStringify]}
        components={{
          img: (props) => {
            if (!props.src) return null;
            const imageSize = imageSizes?.[props.src];

            return imageSize ? (
              <Image
                ref={applyMediumZoom}
                src={props.src ?? ''}
                alt={props.alt ?? ''}
                width={imageSize?.width ?? 700}
                height={imageSize?.height ?? 400}
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={applyMediumZoom} src={props.src} alt={props.alt} />
            );
          },
        }}
      >
        {contentHtml}
      </ReactMarkdown>
    </div>
  );
}
