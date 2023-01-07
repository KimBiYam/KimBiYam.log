import { RemoteConfig } from '@firebase/remote-config';
import { atom } from 'jotai';

export const remoteConfigAtom = atom<RemoteConfig | null>(null);
