import { RemoteConfig } from '@firebase/remote-config';
import { FirebaseApp } from 'firebase/app';
import { atom } from 'jotai';

export const firebaseAppAtom = atom<FirebaseApp | null>(null);

export const remoteConfigAtom = atom<RemoteConfig | null>(null);
