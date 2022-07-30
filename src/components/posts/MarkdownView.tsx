import { motion } from 'framer-motion';
import { useRef } from 'react';
import useHeadingLink from '../../hooks/useHeadingLink';
import useMediumZoom from '../../hooks/useMediumZoom';
import { viewportOpacityMotion } from '../../lib/styles/motions';

interface MarkdownViewProps {
  contentHtml: string;
}

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  useMediumZoom(markdownRef);
  useHeadingLink(markdownRef);

  return (
    <motion.div
      {...viewportOpacityMotion}
      className="w-full max-w-full prose xs:prose-sm sm:prose-sm dark:prose-dark"
      ref={markdownRef}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default MarkdownView;
