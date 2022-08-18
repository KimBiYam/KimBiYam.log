import { TableOfContentHeading } from '../../hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  activeId: string | null;
}

const TableOfContentsItem = ({
  heading,
  onClick,
  children,
  activeId,
}: TableOfContentsItemProps) => {
  const { id, title } = heading;

  return (
    <li className="my-1 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
      <button
        type="button"
        onClick={() => onClick(id)}
        className={`
        hover:opacity-100
        transition-opacity
        duration-300
        ${activeId === id ? 'opacity-100 font-bold' : 'opacity-60'}`}
      >
        {title}
      </button>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
