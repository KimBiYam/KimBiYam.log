import Link from "next/link";

export type HeaderItemProps = {
  href: string;
  label: string;
};

const HeaderItem = ({ href, label }: HeaderItemProps) => {
  return (
    <Link href={href}>
      <a className="block lg:mt-0 mr-4">{label}</a>
    </Link>
  );
};

export default HeaderItem;
