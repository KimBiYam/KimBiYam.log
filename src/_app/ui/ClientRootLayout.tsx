'use client';

import { PropsWithChildren } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';

import { useDetectScroll } from '@src/shared';

import MainLayout from './MainLayout';
import ThemeProvider from './ThemeProvider';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useDetectScroll();

  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <MainLayout>{children}</MainLayout>
      </LazyMotion>
    </ThemeProvider>
  );
}
