'use client';

import React from 'react';

import FacebookIcon from '../../assets/svgs/facebook.svg';
import TwitterIcon from '../../assets/svgs/twitter.svg';

type PostShareButtonType = 'facebook' | 'twitter';

interface PostShareButtonProps {
  type: PostShareButtonType;
  onClick: () => void;
}

const shareIconMap: Record<
  PostShareButtonType,
  { icon: React.ReactNode; color: string }
> = {
  facebook: { icon: <FacebookIcon />, color: '#4267B2' },
  twitter: { icon: <TwitterIcon />, color: '#1DA1F2' },
};

const PostShareButton = ({ type, onClick }: PostShareButtonProps) => {
  const { icon, color } = shareIconMap[type];

  return (
    <button
      type="button"
      className="flex items-center px-4 py-2 mr-2 text-white transition-opacity duration-300 rounded-md hover:opacity-70 last:mr-0"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <span className="w-5 h-5 mr-2 fill-current">{icon}</span>
      <span className="text-sm">공유하기</span>
    </button>
  );
};

export default PostShareButton;
