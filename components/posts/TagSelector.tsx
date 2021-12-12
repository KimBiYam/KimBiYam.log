export type TagSelectorProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

const TagSelector = ({ tags, onTagClick }: TagSelectorProps) => {
  return (
    <div>
      {tags.map((tag) => (
        <button key={tag} type="button" onClick={() => onTagClick(tag)}>
          {tag.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
