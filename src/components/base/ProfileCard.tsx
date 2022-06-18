import { memo, ReactNode } from 'react';
import Image from 'next/image';
import profileData from '../../data/profile.json';
import ProfileLink from './ProfileLink';

import GithubIcon from '../../assets/svgs/github.svg';
import NotionIcon from '../../assets/svgs/notion.svg';
import LinkedInIcon from '../../assets/svgs/linked_in.svg';

const SOCIAL_ICONS: Record<string, () => ReactNode> = {
  github: GithubIcon,
  linkedIn: LinkedInIcon,
  notion: NotionIcon,
} as const;

const ProfileCard = () => {
  const { description, imageSrc, name, social } = profileData;

  return (
    <div className="flex items-center">
      <div className="relative w-16 min-w-16">
        <Image
          src={imageSrc}
          alt="profile"
          quality={100}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div className="ml-4 w-fit">
        <p className="font-bold">{name}</p>
        <p className="mt-1 overflow-hidden text-sm">{description}</p>
        <div className="flex items-center gap-3 mt-2 children:ml-2">
          {Object.entries(social).map(([name, href]) => (
            <ProfileLink href={href} title={`${name}-link`}>
              {SOCIAL_ICONS[name]()}
            </ProfileLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
