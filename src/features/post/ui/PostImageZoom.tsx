import { useTheme } from '@src/shared';
import useMediumZoom from '@src/shared/hooks/useMediumZoom';

interface Props {
  selector: string;
}

const PostImageZoom = ({ selector }: Props) => {
  const { theme } = useTheme();

  useMediumZoom({
    selector,
    options: {
      margin: 24,
      background: theme === 'dark' ? '#171717' : '#ffffff',
    },
  });

  return null;
};

export default PostImageZoom;
