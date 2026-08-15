import { ImageResponse } from 'next/og';

import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import { getAllPostPaths, getPostDetail } from '@src/features/post/server';
import type { PostPath } from '@src/features/post/types';

export const dynamicParams = false;

export const generateStaticParams = async () => getAllPostPaths();

export const GET = async (
  _request: Request,
  { params }: { params: Promise<PostPath> },
) => {
  const { id, subdirectory } = await params;
  const { tag, title } = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'flex-start',
          background: '#171717',
          color: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 80px',
          width: '100%',
        }}
      >
        <div style={{ color: '#a3a3a3', display: 'flex', fontSize: 32 }}>
          {tag.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '-2px',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 30 }}>KimBiYam.log</div>
      </div>
    ),
    { height: 630, width: 1200 },
  );
};
