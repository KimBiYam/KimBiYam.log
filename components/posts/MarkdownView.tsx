import { useRef } from 'react';
import useMediumZoom from '../../hooks/useMediumZoom';

export type MarkdownViewProps = {
  contentHtml: string;
};

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);
  useMediumZoom(markdownRef);

  return (
    <div className="flex justify-center">
      <div
        className="w-full prose xs:prose-sm sm:prose-sm dark:prose-dark"
        ref={markdownRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
};

export default MarkdownView;
