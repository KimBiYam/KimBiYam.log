/* eslint-disable react/no-unstable-nested-components */
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import NextImage from 'next/image';
import { Element } from 'react-markdown/lib/rehype-filter';
import useMediumZoom from '../../hooks/useMediumZoom';
import useHeadingLink from '../../hooks/useHeadingLink';

interface MarkdownViewProps {
  contentHtml: string;
}

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  // useMediumZoom(markdownRef);
  useHeadingLink(markdownRef);

  return (
    <div
      className="w-full max-w-full prose xs:prose-sm sm:prose-sm dark:prose-dark"
      ref={markdownRef}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');

            return !inline && match ? (
              <SyntaxHighlighter
                showLineNumbers
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={tomorrow as any}
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          p({ node, children }) {
            const firstNode = node.children[0];

            if (firstNode.type !== 'element' || firstNode.tagName !== 'img') {
              return <p>{children}</p>;
            }

            const image = node.children[0] as Element;

            return (
              <div className="relative w-full h-[360px] md:h-[480px]">
                <NextImage
                  src={image.properties?.src as string}
                  alt={image.properties?.alt as string}
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                />
              </div>
            );
          },
        }}
      >
        {contentHtml}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
