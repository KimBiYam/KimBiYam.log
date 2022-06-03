import { useRouter } from 'next/router';
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
  const router = useRouter();

  const { id, title } = heading;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();

    document
      .querySelector(`#${CSS.escape(id)}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    router.replace(`#${id}`);
  };

  return (
    <li className="my-1 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
      <a
        href={`#${id}`}
        className={activeId === id ? 'opacity-100 font-bold' : `opacity-70`}
        onClick={handleClick}
      >
        {title}
      </a>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
