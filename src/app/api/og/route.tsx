/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const logoImageData = await fetch(
      new URL('../../../assets/images/logo_image.png', import.meta.url),
    ).then((res) => res.arrayBuffer());

    const title = searchParams.get('title');

    if (!title) {
      return generateDefaultImageResponse(logoImageData);
    }

    const ogImagePath = searchParams.get('ogImagePath');

    return await generateTitleImageResponse(title, logoImageData, ogImagePath);
  } catch (e: unknown) {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}

const generateDefaultImageResponse = (
  logoImageData: ArrayBuffer,
): ImageResponse => {
  return new ImageResponse(
    (
      <div tw="flex w-full h-full bg-white">
        <img
          src={logoImageData as unknown as string}
          alt="blog-logo"
          width="100%"
        />
      </div>
    ),
  );
};

const generateTitleImageResponse = async (
  title: string,
  logoImageData: ArrayBuffer,
  ogImagePath?: string | null,
) => {
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-black">
        <img
          src={logoImageData as unknown as string}
          alt="blog-logo"
          width={150}
        />
        <div tw="flex flex-col w-full h-full items-center bg-black">
          <img
            src={ogImagePath ?? (logoImageData as unknown as string)}
            alt="main-image"
            width={700}
            style={{ backgroundColor: !ogImagePath ? 'white' : undefined }}
            tw="rounded-3xl mb-8"
          />
          <div tw="flex justify-center items-center text-5xl text-neutral-100 text-center px-16">
            {title}
          </div>
        </div>
      </div>
    ),
  );
};
