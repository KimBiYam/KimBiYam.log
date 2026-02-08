import { getSortedPostPreviews } from '@src/features/post/server';
import { Tag } from '@src/features/tag';
import HomePage from '@src/(pages)/home/HomePage/ui/HomePage';

export default async function Page() {
  const postPreviews = await getSortedPostPreviews();

  const tags = [
    Tag.all,
    ...Array.from(
      new Set(postPreviews.map((postPreview) => postPreview.tag)),
    ).sort(),
  ];

  return <HomePage postPreviews={postPreviews} tags={tags} />;
}
