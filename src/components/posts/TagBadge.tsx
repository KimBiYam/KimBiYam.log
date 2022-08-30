interface TagBadgeProps {
  tag: string;
}

const TagBadge = ({ tag }: TagBadgeProps) => (
  <span className="primary-button text-xs font-semibold px-2.5 py-0.5 rounded">
    {tag.toUpperCase()}
  </span>
);

export default TagBadge;
