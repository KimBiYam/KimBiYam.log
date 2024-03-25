import localFont from 'next/font/local';

const Pretendard = localFont({
  src: [
    {
      path: './Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export default Pretendard;
