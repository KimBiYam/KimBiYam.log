export type TagBadgeProps = {
  tag: string;
};

const TagBadge = ({ tag }: TagBadgeProps) => (
  <p className="inline-block px-2 py-1 text-xs md:text-sm font-semibold bg-gray-300 dark:bg-gray-600 rounded-xl">
    {tag.toUpperCase()}
  </p>
);

export default TagBadge;
