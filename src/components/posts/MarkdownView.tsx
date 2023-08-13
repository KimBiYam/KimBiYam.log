'use client';
import { forwardRef, useRef } from 'react';

interface MarkdownViewProps {
  contentHtml: string;
}

const MarkdownView = forwardRef(function MarkdownView(
  { contentHtml }: MarkdownViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ref = forwardedRef ?? innerRef;

  return (
    <div
      className="w-full max-w-full prose dark:prose-dark"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
});

export default MarkdownView;
