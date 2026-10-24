import Link from 'next/link';

interface TagBadgeProps {
  href?: string;
  tag: string;
}

const TagBadge = ({ href, tag }: TagBadgeProps) => {
  const content = (
    <span className="px-3 py-1.5 font-mono text-xs border rounded-full border-accent-cyan/35 bg-accent-cyan/[0.08] text-accent-cyan">
      {tag}
    </span>
  );

  return href ? (
    <Link
      href={href}
      className="self-start inline-flex items-center rounded-full min-h-11 -my-2.5 focus-ring"
    >
      {content}
    </Link>
  ) : (
    content
  );
};

export default TagBadge;
