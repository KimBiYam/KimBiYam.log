/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { ImageResponseOptions } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const logoImageData = await fetch(
      new URL('../../../shared/assets/images/logo_image.png', import.meta.url),
    ).then((res) => res.arrayBuffer());

    const title = searchParams.get('title');

    const fontData = await fetch(
      new URL('https://gstatic.com', request.url),
    ).then((res) => res.arrayBuffer());

    const options = {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans KR',
          data: fontData,
          style: 'normal' as const,
        },
      ],
    };

    if (!title) {
      return generateDefaultImageResponse(logoImageData, options);
    }

    return await generateTitleImageResponse(title, logoImageData, options);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}

const generateDefaultImageResponse = (
  logoImageData: ArrayBuffer,
  options?: ImageResponseOptions,
): ImageResponse => {
  return new ImageResponse(
    (
      <div tw="flex w-full h-full bg-white">
        <img
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          src={logoImageData as any}
          alt="blog-logo"
          width="100%"
        />
      </div>
    ),
    options,
  );
};

const generateTitleImageResponse = async (
  title: string,
  logoImageData: ArrayBuffer,
  options?: ImageResponseOptions,
) => {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full items-center bg-black justify-center"
        style={{ fontFamily: 'Noto Sans KR' }}
      >
        <img
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          src={logoImageData as any}
          alt="main-image"
          width={700}
          tw="rounded-3xl mb-8 bg-white"
        />
        <div tw="flex justify-center items-center text-5xl text-neutral-100 text-center px-16">
          {title}
        </div>
      </div>
    ),
    options,
  );
};
