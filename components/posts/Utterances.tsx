import { useEffect, useRef } from 'react';
import { Theme } from '../../constants';
import useThemeStorage from '../../hooks/useThemeStorage';

const SOURCE_URL = 'https://utteranc.es/client.js';
const REPO = 'KimBiYam/KimBiYam.log';
const BRANCH = 'master';
const LABEL = 'comment';
const DARK_THEME = 'github-dark';
const LIGHT_THEME = 'github-light';
const ISSUE_TERM = 'pathname';

const Utterances = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStorage();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const utterances = document.createElement('script');
    const config: { [key: string]: string } = {
      src: SOURCE_URL,
      repo: REPO,
      branch: BRANCH,
      theme: theme === Theme.dark ? DARK_THEME : LIGHT_THEME,
      label: LABEL,
      async: 'true',
      'issue-term': ISSUE_TERM,
    };

    Object.keys(config).forEach((key) => {
      utterances.setAttribute(key, config[key]);
    });

    // Using promise caused by storage theme load
    new Promise((resolve) => (timeoutId = setTimeout(resolve, 0))).then(() => {
      if (!ref.current) return;
      ref.current.appendChild(utterances);
    });

    return () => timeoutId && clearTimeout(timeoutId);
  }, [theme]);

  return <div ref={ref} />;
};

export default Utterances;
