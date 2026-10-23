interface PostReadingTimeProps {
  minutes: number;
}

const PostReadingTime = ({ minutes }: PostReadingTimeProps) => (
  <span className="font-mono text-xs text-muted">{minutes} min read</span>
);

export default PostReadingTime;
