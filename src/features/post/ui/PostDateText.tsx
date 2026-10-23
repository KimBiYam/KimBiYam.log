interface PostDateTextProps {
  dateTime: string;
  children: React.ReactNode;
}

const PostDateText = ({ dateTime, children }: PostDateTextProps) => (
  <time
    dateTime={dateTime}
    className="text-sm text-zinc-400 dark:text-zinc-500"
  >
    {children}
  </time>
);

export default PostDateText;
