'use client';

import { TagSelector } from '@src/features/tag';
import { DragScrollContainer } from '@src/shared/ui';

interface HomeTagSelectorProps {
  tags: string[];
}

const HomeTagSelector = ({ tags }: HomeTagSelectorProps) => (
  <DragScrollContainer>
    <TagSelector tags={tags} />
  </DragScrollContainer>
);

export default HomeTagSelector;
