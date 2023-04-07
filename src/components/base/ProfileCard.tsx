import React, { memo } from 'react';

import Image from 'next/image';

import GithubIcon from '../../assets/svgs/github.svg';
import LinkedInIcon from '../../assets/svgs/linked_in.svg';
import NotionIcon from '../../assets/svgs/notion.svg';
import profile from '../../data/profile.json';
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

const ProfileCard = () => {
  const { name, description, imageSrc, social }: Profile = profile;

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
        <p
          className="mt-1 overflow-hidden text-sm"
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

export default memo(ProfileCard);
