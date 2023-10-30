import LinkIcon from '@src/assets/svgs/link_icon.svg';

type HeadingLinkProps = {
  href: string;
  text: string | null;
};

const HeadingLink = ({ href, text }: HeadingLinkProps) => (
  <a
    href={href}
    className="flex items-center no-underline hover:underline group"
  >
    {text}
    <LinkIcon className="hidden w-4 h-4 ml-1 group-hover:block opacity-60" />
  </a>
);

export default HeadingLink;
