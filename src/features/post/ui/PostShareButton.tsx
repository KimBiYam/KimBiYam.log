'use client';

import React from 'react';

import FacebookIcon from '@src/shared/assets/svgs/facebook.svg';
import TwitterIcon from '@src/shared/assets/svgs/twitter.svg';

type PostShareButtonType = 'facebook' | 'twitter';

interface PostShareButtonProps {
  type: PostShareButtonType;
  onClick: () => void;
}

const shareIconMap: Record<PostShareButtonType, { icon: React.ReactNode }> = {
  facebook: { icon: <FacebookIcon /> },
  twitter: { icon: <TwitterIcon /> },
};

const PostShareButton = ({ type, onClick }: PostShareButtonProps) => {
  const { icon } = shareIconMap[type];

  return (
    <button
      type="button"
      className="flex items-center px-4 mr-2 border cursor-pointer min-h-11 rounded-xl border-line bg-glass text-foreground transition-colors duration-300 hover:bg-accent-violet/15 last:mr-0 focus-ring"
      onClick={onClick}
    >
      <span className="w-5 h-5 mr-2 fill-current">{icon}</span>
      <span className="text-sm">공유하기</span>
    </button>
  );
};

export default PostShareButton;
