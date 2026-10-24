'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { COLORS } from '@src/shared/constants/colors';

import type { CSSProperties } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

// global-error replaces the root layout, so global.css, Tailwind and the theme
// provider are not available here. Colors are CSS variables defined in an
// inline <style> from the shared tokens: dark by default, light for users who
// prefer it.
const toVariables = (palette: (typeof COLORS)[keyof typeof COLORS]) =>
  `--ge-bg:${palette.background};--ge-fg:${palette.foreground};--ge-muted:${palette.muted};--ge-accent:${palette.accentViolet};`;

const THEME_CSS = `:root{${toVariables(COLORS.dark)}color-scheme:dark}@media (prefers-color-scheme:light){:root{${toVariables(COLORS.light)}color-scheme:light}}`;

const styles = {
  body: {
    alignItems: 'center',
    background: 'var(--ge-bg)',
    color: 'var(--ge-fg)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
    gap: 24,
    justifyContent: 'center',
    margin: 0,
    minHeight: '100vh',
    padding: 24,
    textAlign: 'center',
  },
  label: {
    color: 'var(--ge-muted)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12,
    letterSpacing: '0.04em',
    margin: 0,
  },
  message: {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    wordBreak: 'keep-all',
  },
  link: {
    alignItems: 'center',
    background: 'color-mix(in srgb, var(--ge-accent) 15%, transparent)',
    border: '1px solid color-mix(in srgb, var(--ge-accent) 50%, transparent)',
    borderRadius: 12,
    color: 'var(--ge-fg)',
    display: 'flex',
    fontSize: 14,
    fontWeight: 500,
    minHeight: 44,
    padding: '0 20px',
    textDecoration: 'none',
  },
} satisfies Record<string, CSSProperties>;

const GlobalError = ({ error }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <head>
        <style>{THEME_CSS}</style>
      </head>
      <body style={styles.body}>
        <p style={styles.label}>ERROR</p>
        <p style={styles.message}>알 수 없는 오류가 발생하였습니다.</p>
        {/* A full page load: the app state is unusable after a global error. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" style={styles.link}>
          홈으로
        </a>
      </body>
    </html>
  );
};

export default GlobalError;
