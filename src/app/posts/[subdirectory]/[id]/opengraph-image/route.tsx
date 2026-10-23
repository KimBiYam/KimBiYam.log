import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import { getAllPostPaths, getPostDetail } from '@src/features/post/server';
import type { PostPath } from '@src/features/post/types';

export const dynamicParams = false;

export const generateStaticParams = async () => getAllPostPaths();

// Colors mirror the dark tokens in src/shared/styles/global.css.
const COLORS = {
  background: '#070711',
  foreground: '#f1f1f8',
  muted: '#a5a6bc',
  violet: '#a78bfa',
  cyan: '#5eead4',
};

// The default OG font has no Hangul glyphs, so load Pretendard explicitly.
const loadFont = (weight: 'Medium' | 'Bold') =>
  readFile(
    path.join(
      process.cwd(),
      `node_modules/pretendard/dist/public/static/Pretendard-${weight}.otf`,
    ),
  );

export const GET = async (
  _request: Request,
  { params }: { params: Promise<PostPath> },
) => {
  const { id, subdirectory } = await params;
  const [{ tag, title }, mediumFont, boldFont] = await Promise.all([
    getPostDetail(`${POST_DIRECTORY}/${subdirectory}`, id),
    loadFont('Medium'),
    loadFont('Bold'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: COLORS.background,
          backgroundImage: [
            'radial-gradient(circle at 12% 0%, rgba(139, 92, 246, 0.45), rgba(7, 7, 17, 0) 55%)',
            'radial-gradient(circle at 100% 100%, rgba(34, 211, 238, 0.28), rgba(7, 7, 17, 0) 50%)',
          ].join(', '),
          color: COLORS.foreground,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Pretendard',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 80px',
          width: '100%',
        }}
      >
        <div
          style={{
            alignSelf: 'flex-start',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 999,
            color: COLORS.violet,
            display: 'flex',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.04em',
            padding: '10px 24px',
          }}
        >
          {tag.toUpperCase()}
        </div>
        <div
          style={{
            display: 'block',
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineClamp: 3,
            lineHeight: 1.3,
            wordBreak: 'keep-all',
          }}
        >
          {title}
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span>KimBiYam</span>
          <span style={{ color: COLORS.cyan }}>.log</span>
        </div>
      </div>
    ),
    {
      height: 630,
      width: 1200,
      fonts: [
        { name: 'Pretendard', data: mediumFont, weight: 500, style: 'normal' },
        { name: 'Pretendard', data: boldFont, weight: 700, style: 'normal' },
      ],
    },
  );
};
