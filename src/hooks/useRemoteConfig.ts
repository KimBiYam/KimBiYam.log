import { getValue as remoteConfigGetValue } from '@firebase/remote-config';
import { useAtomValue } from 'jotai';

import { remoteConfigAtom } from '../atoms/firebaseAtom';

export const useRemoteConfig = () => {
  const remoteConfig = useAtomValue(remoteConfigAtom);

  const getValue = (key: string) => {
    if (!remoteConfig) return null;
    return remoteConfigGetValue(remoteConfig, key);
  };

  return { getValue };
};
