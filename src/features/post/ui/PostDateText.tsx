interface PostDateTextProps {
  dateTime: string;
  children: React.ReactNode;
}

const PostDateText = ({ dateTime, children }: PostDateTextProps) => (
  <time dateTime={dateTime} className="font-mono text-xs text-muted">
    {children}
  </time>
);

export default PostDateText;
