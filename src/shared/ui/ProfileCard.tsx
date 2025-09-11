import React, { memo } from 'react';

import Image from 'next/image';

import GithubIcon from '@src/assets/svgs/github.svg';
import LinkedInIcon from '@src/assets/svgs/linked_in.svg';
import { ObjectEntries } from '@src/shared';

import { PROFILE } from '../constants';
import ProfileLink from './ProfileLink';

type Social = (typeof PROFILE)['social'];

const { imageSrc, name, social } = PROFILE;
const SOCIAL_ICONS: Record<keyof Social, RenderSVGComponent> = {
  github: GithubIcon,
  linkedIn: LinkedInIcon,
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
