import useHeadingSmoothScroll from '../../hooks/useHeadingSmoothScroll';
import { TableOfContentHeading } from '../../hooks/useTableOfContents';

export interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  children?: React.ReactNode;
  activeId: string;
}

const TableOfContentsItem = ({
  heading,
  children,
  activeId,
}: TableOfContentsItemProps) => {
  const handleClick = useHeadingSmoothScroll();

  const { id, title } = heading;

  return (
    <li className="my-1 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
      <a
        href={`#${id}`}
        className={activeId === id ? 'opacity-100 font-bold' : `opacity-70`}
        onClick={(e) => handleClick(e, id)}
      >
        {title}
      </a>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
