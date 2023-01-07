import React, { memo } from 'react';

import Image from 'next/image';

import { Value } from '@firebase/remote-config';

import GithubIcon from '../../assets/svgs/github.svg';
import LinkedInIcon from '../../assets/svgs/linked_in.svg';
import NotionIcon from '../../assets/svgs/notion.svg';
import remoteConfigKeys from '../../constants/remoteConfigKeys';
import defaultProfile from '../../data/defaultProfile.json';
import { useRemoteConfig } from '../../hooks/useRemoteConfig';
import ProfileLink from './ProfileLink';

const SOCIAL_ICONS: Record<string, RenderSVGComponent> = {
  github: GithubIcon,
  linkedIn: LinkedInIcon,
  notion: NotionIcon,
} as const;

interface Profile {
  name: string;
  description: string;
  imageSrc: string;
  social: Record<string, string>;
}

const parseProfileRemoteConfig = (profile: Value | null): Profile | null => {
  if (!profile) return null;

  try {
    const { name, description, imageSrc, social } = JSON.parse(
      profile.asString(),
    );
    return { name, description, imageSrc, social };
  } catch {
    const { name, description, imageSrc, social } = defaultProfile;
    return { name, description, imageSrc, social };
  }
};

const ProfileCard = () => {
  const { getValue } = useRemoteConfig();
  const profile = getValue(remoteConfigKeys.profile);
  const profileData = parseProfileRemoteConfig(profile);

  if (!profileData) return <ProfileCardSkeleton />;

  const { name, description, imageSrc, social } = profileData;

  return (
    <div className="flex items-center">
      <Image
        src={imageSrc}
        alt="profile"
        quality={100}
        width="64px"
        height="64px"
        layout="fixed"
        className="rounded-full"
      />
      <div className="ml-4 w-fit">
        <p className="font-bold">{name}</p>
        <p
          className="mt-1 overflow-hidden text-sm"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="flex items-center mt-2">
          {Object.entries(social).map(([name, href]) => (
            <ProfileLink href={href} title={`${name}-link`} key={name}>
              {SOCIAL_ICONS[name]({ className: 'w-6 h-6' })}
            </ProfileLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileCardSkeleton = () => (
  <div className="flex items-center h-20 animate-pulse">
    <div className="w-16 h-16 rounded-full primary-button" />
    <div className="ml-4">
      <div className="w-32 h-4 rounded-full primary-button" />
      <div className="w-40 h-3 mt-2 rounded-full primary-button" />
      <div className="w-20 h-6 mt-2 rounded-full primary-button" />
    </div>
  </div>
);

export default memo(ProfileCard);
