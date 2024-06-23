'use client';

import { PropsWithChildren } from 'react';

import useDetectScroll from '@src/hooks/useDetectScroll';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useDetectScroll();

  return <>{children}</>;
}
