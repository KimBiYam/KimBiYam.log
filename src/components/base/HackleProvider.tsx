'use client';

import { PropsWithChildren } from 'react';

import { createInstance, HackleProvider } from '@hackler/react-sdk';

import { HACKLE_SDK_KEY } from '@src/constants';

const hackleClient = createInstance(HACKLE_SDK_KEY, {
  debug: process.env.NODE_ENV === 'development',
});

export default function ClientHackleProvider({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <HackleProvider hackleClient={hackleClient} supportSSR>
      {children}
    </HackleProvider>
  );
}
