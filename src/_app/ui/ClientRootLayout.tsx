'use client';

import { PropsWithChildren } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';

import { useDetectScroll } from '@src/shared';

import MainLayout from './MainLayout';
import ThemeProvider from './ThemeProvider';

const loadMotionFeatures = () =>
  import('./motionFeatures').then((module) => module.default);

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useDetectScroll();

  return (
    <ThemeProvider>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <MainLayout>{children}</MainLayout>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
