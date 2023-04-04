import { useRef } from 'react';

import useCreateHeadingLink from '../../hooks/useHeadingLink';
import useMediumZoom from '../../hooks/useMediumZoom';

interface MarkdownViewProps {
  contentHtml: string;
}

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  useMediumZoom(markdownRef);
  useCreateHeadingLink(markdownRef);

  return (
    <div
      className="w-full max-w-full prose dark:prose-dark"
      ref={markdownRef}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default MarkdownView;
