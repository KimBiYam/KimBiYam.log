import { forwardRef, useRef } from 'react';

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
    <div
      className="w-full max-w-full prose dark:prose-dark"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
});

export default MarkdownView;
