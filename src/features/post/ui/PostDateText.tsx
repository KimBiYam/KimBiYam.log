interface PostDateTextProps {
  children: React.ReactNode;
}

const PostDateText = ({ children }: PostDateTextProps) => (
  <p className="text-sm text-zinc-400 dark:text-zinc-500">{children}</p>
);

export default PostDateText;
