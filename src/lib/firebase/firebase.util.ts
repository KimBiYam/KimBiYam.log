import { useEffect } from 'react';

import { fetchAndActivate, getRemoteConfig } from '@firebase/remote-config';
import { getApps, initializeApp } from 'firebase/app';
import { useSetAtom } from 'jotai';

import { remoteConfigAtom } from '../../atoms/remoteConfigAtom';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const useInitFirebase = () => {
  const setRemoteConfig = useSetAtom(remoteConfigAtom);

  useEffect(() => {
    const init = async () => {
      if (!getApps().length) {
        const firebaseApp = initializeApp(firebaseConfig);

        const remoteConfig = getRemoteConfig(firebaseApp);
        await fetchAndActivate(remoteConfig);
        setRemoteConfig(remoteConfig);
      }
    };

    init();
  }, [setRemoteConfig]);
};
