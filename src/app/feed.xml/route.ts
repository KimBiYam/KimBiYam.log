import { getPostFeedXml } from '@src/features/post/server';

export const dynamic = 'force-static';

export const GET = async () => {
  const feedXml = await getPostFeedXml();

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
