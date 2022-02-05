import { useEffect, useRef } from 'react';
import { Theme } from '../../constants';
import themeCookie from '../../lib/cookies/themeCookie';

const SOURCE_URL = 'https://utteranc.es/client.js';
const REPO = 'KimBiYam/KimBiYam.log';
const BRANCH = 'master';
const LABEL = 'comment';
const DARK_THEME = 'github-dark';
const LIGHT_THEME = 'github-light';
const ISSUE_TERM = 'pathname';

const Utterances = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const utterances = document.createElement('script');
    const config: { [key: string]: string } = {
      src: SOURCE_URL,
      repo: REPO,
      branch: BRANCH,
      theme: themeCookie.getTheme() === Theme.dark ? DARK_THEME : LIGHT_THEME,
      label: LABEL,
      async: 'true',
      'issue-term': ISSUE_TERM,
    };

    Object.keys(config).forEach((key) => {
      utterances.setAttribute(key, config[key]);
    });

    ref.current?.appendChild(utterances);
  }, []);

  return <div ref={ref} />;
};

export default Utterances;
