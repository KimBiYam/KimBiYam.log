'use client';

import { PropsWithChildren } from 'react';

import { useDetectScroll } from '@src/shared';

import MainLayout from './MainLayout';
import ThemeProvider from './ThemeProvider';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useDetectScroll();

  return (
    <ThemeProvider>
      <MainLayout>{children}</MainLayout>
    </ThemeProvider>
  );
}
