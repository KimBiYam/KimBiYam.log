'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

// global-error replaces the root layout, so global.css and Tailwind are not
// available here: styles are inline and mirror the dark tokens.
const styles = {
  body: {
    alignItems: 'center',
    background: '#070711',
    color: '#f1f1f8',
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
    color: '#a5a6bc',
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
    background: 'rgba(167, 139, 250, 0.15)',
    border: '1px solid rgba(167, 139, 250, 0.5)',
    borderRadius: 12,
    color: '#f1f1f8',
    display: 'flex',
    fontSize: 14,
    fontWeight: 500,
    minHeight: 44,
    padding: '0 20px',
    textDecoration: 'none',
  },
};

export default function GlobalError({ error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={styles.body}>
        <p style={styles.label}>ERROR</p>
        <p style={styles.message}>알 수 없는 오류가 발생하였습니다.</p>
        {/* A full page load: the app state is unusable after a global error. */}
        <a href="/" style={styles.link}>
          홈으로
        </a>
      </body>
    </html>
  );
}
