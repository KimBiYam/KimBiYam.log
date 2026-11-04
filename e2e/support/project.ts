import { test } from '@playwright/test';

export type ProjectName = 'desktop' | 'mobile';

/** 현재 Playwright 프로젝트 이름. 알 수 없는 이름이면 실패한다. */
export const getProjectName = (): ProjectName => {
  const { name } = test.info().project;
  if (name !== 'desktop' && name !== 'mobile') {
    throw new Error(`알 수 없는 프로젝트: ${name}`);
  }
  return name;
};
