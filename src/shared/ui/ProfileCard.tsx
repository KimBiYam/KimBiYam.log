import { memo } from 'react';

import GithubIcon from '@src/assets/svgs/github.svg?react';
import LinkedInIcon from '@src/assets/svgs/linked_in.svg?react';
import type { ObjectEntries } from '@src/shared';

import ProfileLink from './ProfileLink';
import { PROFILE } from '../constants';

type Social = (typeof PROFILE)['social'];

const { imageSrc, name, social } = PROFILE;

const SOCIAL_ICONS: Record<
  keyof Social,
  React.FC<React.ComponentProps<'svg'>>
> = {
  github: GithubIcon,
  linkedIn: LinkedInIcon,
};

const ProfileCard = () => {
  return (
    <div className="flex items-center">
      <img
        src={imageSrc}
        alt="profile"
        width={64}
        height={64}
        className="rounded-full"
      />
      <div className="ml-4 w-fit">
        <p className="font-bold">{name}</p>
        <div className="flex items-center mt-2">
          {(Object.entries(social) as ObjectEntries<Social>).map(
            ([name, href]) => {
              const Icon = SOCIAL_ICONS[name];
              return (
                <ProfileLink href={href} title={`${name}-link`} key={name}>
                  <Icon className="w-6 h-6 fill-current" />
                </ProfileLink>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
