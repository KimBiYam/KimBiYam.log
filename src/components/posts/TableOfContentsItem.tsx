import { TableOfContentHeading } from './TableOfContents';

export interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  children?: React.ReactNode;
}

const TableOfContentsItem = ({
  heading,
  children,
}: TableOfContentsItemProps) => {
  const { id, title } = heading;

  return (
    <li className="overflow-hidden text-ellipsis whitespace-nowrap">
      <a href={`#${id}`}>{title}</a>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
