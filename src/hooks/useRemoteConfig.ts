import { getValue as remoteConfigGetValue } from '@firebase/remote-config';
import { useAtomValue } from 'jotai';

import { remoteConfigAtom } from '../atoms/firebaseAtom';

export const useRemoteConfig = () => {
  const remoteConfig = useAtomValue(remoteConfigAtom);

  const getValue = (key: string) =>
    remoteConfig ? remoteConfigGetValue(remoteConfig, key) : null;

  return { getValue };
};
