'use client';

import { PostDetail } from '@src/features/post/types/post.types';
import { DOMAIN_URL } from '@src/shared/constants';

import PostShareButton from './PostShareButton';

interface PostShareButtonProps {
  postDetail: PostDetail;
}

const createFacebookShareUrl = (url: string) =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

const createTwitterShareUrl = (title: string, url: string) =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

const POPUP_OPTIONS =
  'resizable=yes, status=no, menubar=no, width=600, height=400, top=0, left=0';

const PostShareButtons = ({ postDetail }: PostShareButtonProps) => {
  const { title, tag, id } = postDetail;

  const shareUrl = `${DOMAIN_URL}/posts/${tag}/${id}`;

  const handleFacebookShareClick = () => {
    window.open(createFacebookShareUrl(shareUrl), '', POPUP_OPTIONS);
  };

  const handleTwitterShareClick = () => {
    window.open(createTwitterShareUrl(title, shareUrl), '', POPUP_OPTIONS);
  };

  return (
    <aside className="flex justify-end mt-8" aria-label="Share this post">
      <ul className="flex space-x-2">
        <li>
          <PostShareButton onClick={handleFacebookShareClick} type="facebook" />
        </li>
        <li>
          <PostShareButton onClick={handleTwitterShareClick} type="twitter" />
        </li>
      </ul>
    </aside>
  );
};

export default PostShareButtons;
