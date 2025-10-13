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

    return await generateTitleImageResponse(title, logoImageData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          src={logoImageData as any}
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
) => {
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center bg-black justify-center">
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
  );
};
