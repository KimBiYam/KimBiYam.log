import { useEffect, useRef } from 'react';
import { Theme } from '../../constants';
import useTheme from '../../hooks/useTheme';
import themeStorage from '../../lib/storage/themeStorage';

const SOURCE_URL = 'https://utteranc.es/client.js';
const REPO = 'KimBiYam/KimBiYam.log';
const BRANCH = 'master';
const LABEL = 'comment';
const DARK_THEME = 'github-dark';
const LIGHT_THEME = 'github-light';
const ISSUE_TERM = 'pathname';

const MESSAGE_TARGET_ORIGIN = 'https://utteranc.es/';

const getThemeByAppTheme = (theme: Theme | null) =>
  theme === Theme.dark ? DARK_THEME : LIGHT_THEME;

const Utterances = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const utterances = document.createElement('script');
    const config: Record<string, string> = {
      src: SOURCE_URL,
      repo: REPO,
      branch: BRANCH,
      theme: getThemeByAppTheme(themeStorage.getTheme()),
      label: LABEL,
      async: 'true',
      'issue-term': ISSUE_TERM,
    };

    Object.entries(config).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    ref.current?.appendChild(utterances);
  }, []);

  useEffect(() => {
    const utterancesFrame = document.querySelector<HTMLIFrameElement>(
      'iframe.utterances-frame',
    );

    if (!utterancesFrame) return;

    utterancesFrame.contentWindow?.postMessage(
      { type: 'set-theme', theme: getThemeByAppTheme(theme) },
      MESSAGE_TARGET_ORIGIN,
    );
  }, [theme]);

  return <div ref={ref} />;
};

export default Utterances;
