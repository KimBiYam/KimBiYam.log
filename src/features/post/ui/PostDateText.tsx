interface PostDateTextProps {
  dateTime: string;
}

const PostDateText = ({ dateTime }: PostDateTextProps) => (
  <time
    className="text-sm text-zinc-400 dark:text-zinc-500"
    dateTime={dateTime}
  >
    {dateTime}
  </time>
);

export default PostDateText;
