import React, { memo } from 'react';

import Image from 'next/image';

import GithubIcon from '@src/assets/svgs/github.svg';
import LinkedInIcon from '@src/assets/svgs/linked_in.svg';
import NotionIcon from '@src/assets/svgs/notion.svg';
import profile from '@src/data/profile.json';
import { ObjectEntries } from '@src/types/util.types';

import ProfileLink from './ProfileLink';

type Profile = typeof profile;
type Social = Profile['social'];

const { name, imageSrc, social }: Profile = profile;
const SOCIAL_ICONS: Record<keyof Social, RenderSVGComponent> = {
  github: GithubIcon,
  linkedIn: LinkedInIcon,
  notion: NotionIcon,
} as const;

const ProfileCard = () => {
  return (
    <div className="flex items-center">
      <Image
        src={imageSrc}
        alt="profile"
        quality={100}
        width={64}
        height={64}
        className="rounded-full"
        priority
      />
      <div className="ml-4 w-fit">
        <p className="font-bold">{name}</p>
        <div className="flex items-center mt-2">
          {(Object.entries(social) as ObjectEntries<Social>).map(
            ([name, href]) => (
              <ProfileLink href={href} title={`${name}-link`} key={name}>
                {SOCIAL_ICONS[name]({ className: 'w-6 h-6' })}
              </ProfileLink>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
