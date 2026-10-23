'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

import { StorageKeys } from '@src/shared/utils/storage';

export default function ThemeProvider({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <NextThemeProvider
      defaultTheme="system"
      enableSystem
      storageKey={StorageKeys.theme}
      attribute="class"
    >
      {children}
    </NextThemeProvider>
  );
}
