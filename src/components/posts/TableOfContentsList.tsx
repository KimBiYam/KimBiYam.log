import { TableOfContentHeading } from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

export interface TableOfContentsListProps {
  level?: number;
  activeId: string;
  headings: TableOfContentHeading[];
  registerChildRef: (instance: HTMLElement | null, id: string) => void;
}

const TableOfContentsList = ({
  level = 0,
  activeId,
  headings,
  registerChildRef,
}: TableOfContentsListProps) => (
  <ul className={`ml-${3 * level}`}>
    {headings.map((heading) => (
      <TableOfContentsItem
        key={heading.id}
        heading={heading}
        activeId={activeId}
        ref={(instance) => registerChildRef(instance, heading.id)}
      >
        {Array.isArray(heading.items) && heading.items?.length > 0 && (
          <TableOfContentsList
            activeId={activeId}
            headings={heading.items}
            level={level + 1}
            registerChildRef={registerChildRef}
          />
        )}
      </TableOfContentsItem>
    ))}
  </ul>
);

export default TableOfContentsList;
