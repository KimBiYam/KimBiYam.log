import { useEffect, useRef } from 'react';
import mediumZoom from 'medium-zoom';

export type MarkdownViewProps = {
  contentHtml: string;
};

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const images = markdownRef.current?.querySelectorAll('img');
    mediumZoom(images);
  }, []);

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
