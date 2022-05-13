import { memo } from 'react';
import Image from 'next/image';
import profileData from '../../data/profile.json';
import GithubIcon from '../../assets/svgs/github.svg';
import ProfileLink from './ProfileLink';

const ProfileCard = () => {
  const { description, imageSrc, name, social } = profileData;
  const { github, notion } = social;

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="relative w-16 h-16 min-w-0">
          <Image
            src={imageSrc}
            priority
            alt="profile"
            quality={100}
            layout="fill"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 mx-4">
          <p className="font-bold">{name}</p>
          <p className="overflow-hidden text-sm italic text">{description}</p>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <ProfileLink href={github}>
          <GithubIcon />
        </ProfileLink>
        <ProfileLink href={notion}>
          <GithubIcon />
        </ProfileLink>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
