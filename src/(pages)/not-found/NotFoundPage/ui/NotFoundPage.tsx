import Link from 'next/link';

import { getSortedPostPreviews } from '@src/features/post/server';

const RECENT_POST_COUNT = 3;

interface NotFoundPageProps {
  message: string;
}

const actionClassName =
  'flex items-center justify-center px-5 border rounded-xl min-h-11 text-sm font-medium transition-colors duration-200 ease-out focus-ring';

const NotFoundPage = async ({ message }: NotFoundPageProps) => {
  const postPreviews = await getSortedPostPreviews();
  const recentPosts = postPreviews.slice(0, RECENT_POST_COUNT);

  return (
    <div className="max-w-xl pt-12 pb-16 mx-auto text-center md:pt-20">
      <p className="font-mono text-xs tracking-[0.04em] text-muted">
        PAGE NOT FOUND
      </p>
      <h1 className="mt-4 text-[96px] font-extrabold leading-none tracking-[-0.04em] md:text-[140px] text-gradient-accent">
        404
      </h1>
      <p className="mt-6 text-lg break-keep text-muted">{message}</p>
      <div className="flex justify-center gap-3 mt-8">
        <Link
          href="/"
          className={`${actionClassName} border-accent-violet/50 bg-accent-violet/15 text-foreground hover:bg-accent-violet/25`}
        >
          홈으로
        </Link>
      </div>
      {recentPosts.length > 0 && (
        <section aria-labelledby="not-found-recent-posts" className="mt-14">
          <h2
            id="not-found-recent-posts"
            className="font-mono text-xs tracking-[0.04em] text-left text-muted"
          >
            RECENT POSTS
          </h2>
          <ul className="mt-3 text-left">
            {recentPosts.map(({ id, title, date }) => (
              <li key={id}>
                <Link
                  href={`/posts/${id}`}
                  className="flex items-baseline justify-between gap-4 px-3 py-3 -mx-3 rounded-xl min-h-11 transition-colors duration-200 ease-out hover:bg-accent-violet/10 focus-ring"
                >
                  <span className="font-medium break-keep">{title}</span>
                  <time
                    dateTime={date}
                    className="font-mono text-xs shrink-0 text-muted"
                  >
                    {date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default NotFoundPage;
