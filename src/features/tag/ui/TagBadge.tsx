import Link from 'next/link';

interface TagBadgeProps {
  href?: string;
  tag: string;
}

const TagBadge = ({ href, tag }: TagBadgeProps) => {
  const content = (
    <span className="text-xs primary-button font-semibold px-2.5 py-0.5 rounded">
    {tag.toUpperCase()}
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

export default TagBadge;
