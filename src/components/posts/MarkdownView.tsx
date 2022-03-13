import { useRef } from 'react';
import useMediumZoom from '../../hooks/useMediumZoom';

export type MarkdownViewProps = {
  contentHtml: string;
};

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);
  useMediumZoom(markdownRef);

  return (
    <div
      className="w-full max-w-full prose xs:prose-sm sm:prose-sm dark:prose-dark"
      ref={markdownRef}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default MarkdownView;
