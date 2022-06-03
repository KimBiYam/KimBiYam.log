import { TableOfContentHeading } from './TableOfContents';

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
  const { id, title } = heading;

  return (
    <li className="my-1 overflow-hidden text-ellipsis whitespace-nowrap">
      <a
        href={`#${id}`}
        className={activeId === id ? 'opacity-100' : `opacity-70`}
      >
        {title}
      </a>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
