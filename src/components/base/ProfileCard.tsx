import { memo } from 'react';
import Image from 'next/image';
import profileData from '../../data/profile.json';
import ProfileLink from './ProfileLink';

import GithubIcon from '../../assets/svgs/github.svg';
import NotionIcon from '../../assets/svgs/notion.svg';
import LinkedInIcon from '../../assets/svgs/linked_in.svg';

const ProfileCard = () => {
  const { description, imageSrc, name, social } = profileData;
  const { github, notion, linkedIn } = social;

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="relative w-16 h-16 min-w-0">
          <Image
            src={imageSrc}
            alt="profile"
            quality={100}
            layout="fill"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 mx-4">
          <p className="font-bold">{name}</p>
          <p className="mt-1 overflow-hidden text-sm">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <ProfileLink href={github} title="github-link">
          <GithubIcon />
        </ProfileLink>
        <ProfileLink href={linkedIn} title="linked-in-link">
          <LinkedInIcon />
        </ProfileLink>
        <ProfileLink href={notion} title="notion-link">
          <NotionIcon />
        </ProfileLink>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
