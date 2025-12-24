import FacebookIcon from '@src/assets/svgs/facebook.svg?react';
import TwitterIcon from '@src/assets/svgs/twitter.svg?react';

type PostShareButtonType = 'facebook' | 'twitter';

interface PostShareButtonProps {
  type: PostShareButtonType;
  onClick: () => void;
}

const shareIconMap: Record<
  PostShareButtonType,
  {
    Icon: React.FunctionComponent<
      React.ComponentProps<'svg'> & { title?: string }
    >;
    color: string;
  }
> = {
  facebook: { Icon: FacebookIcon, color: '#4267B2' },
  twitter: { Icon: TwitterIcon, color: '#000000' },
};

const PostShareButton = ({ type, onClick }: PostShareButtonProps) => {
  const { Icon, color } = shareIconMap[type];

  return (
    <button
      type="button"
      className="flex items-center px-4 py-2 mr-2 text-white transition-opacity duration-300 rounded-md hover:opacity-70 last:mr-0"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="text-sm">공유하기</span>
    </button>
  );
};

export default PostShareButton;
