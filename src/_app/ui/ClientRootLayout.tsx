'use client';

import { PropsWithChildren } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

import { useDetectScroll } from '@src/shared';

import MainLayout from './MainLayout';
import ThemeProvider from './ThemeProvider';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useDetectScroll();

  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <MainLayout>{children}</MainLayout>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
