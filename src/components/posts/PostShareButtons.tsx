import { memo } from 'react';

import { DOMAIN_URL } from '../../constants';
import { PostDetail } from '../../types/post.types';
import PostShareButton from './PostShareButton';

interface PostShareButtonProps {
  postDetail: PostDetail;
}

const createFacebookShareUrl = (url: string) =>
  `http://www.facebook.com/sharer/sharer.php?u=${url}`;

const createTwitterShareUrl = (title: string, url: string) =>
  `https://twitter.com/intent/tweet?text=${title}&url=${url}`;

const POPUP_OPTIONS =
  'resizable=yes, status=no, menubar=no, width=600, height=400, top=0, left=0';

const PostShareButtons = memo(({ postDetail }: PostShareButtonProps) => {
  const { title, tag, id } = postDetail;

  const shareUrl = `${DOMAIN_URL}/posts/${tag}/${id}`;

  const handleFacebookShareClick = () => {
    window.open(createFacebookShareUrl(shareUrl), '', POPUP_OPTIONS);
  };

  const handleTwitterShareClick = () => {
    window.open(createTwitterShareUrl(title, shareUrl), '', POPUP_OPTIONS);
  };

  return (
    <div className="flex justify-end mt-8">
      <PostShareButton onClick={handleFacebookShareClick} type="facebook" />
      <PostShareButton onClick={handleTwitterShareClick} type="twitter" />
    </div>
  );
});

export default PostShareButtons;
