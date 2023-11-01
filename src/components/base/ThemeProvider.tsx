'use client';

import { PropsWithChildren } from 'react';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

import { Theme } from '@src/constants/enums';
import { StorageKeys } from '@src/lib/storage/storage.util';

export default function ThemeProvider({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <NextThemeProvider
      defaultTheme={Theme.light}
      storageKey={StorageKeys.theme}
      attribute="class"
    >
      {children}
    </NextThemeProvider>
  );
}
