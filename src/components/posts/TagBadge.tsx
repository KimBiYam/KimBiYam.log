export type TagBadgeProps = {
  tag: string;
};

const TagBadge = ({ tag }: TagBadgeProps) => (
  <p className="inline-block px-2 py-1 text-xs font-semibold bg-gray-300 md:text-sm dark:bg-gray-600 rounded-xl">
    {tag.toUpperCase()}
  </p>
);

export default TagBadge;