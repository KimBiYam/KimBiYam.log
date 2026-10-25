'use client';

import { useEffect, useRef, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

const FEEDBACK_DURATION_MS = 2000;

const BUTTON_LABEL: Record<CopyState, string> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Failed',
};

const STATUS_MESSAGE: Record<CopyState, string> = {
  idle: '',
  copied: '코드를 복사했습니다.',
  failed: '코드를 복사하지 못했습니다.',
};

// navigator.clipboard is unavailable on insecure origins or when the document
// is not focused; fall back to a hidden textarea + execCommand.
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      if (!document.execCommand('copy')) throw new Error('copy failed');
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

const CodeCopyButton = () => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleClick = async () => {
    const code = buttonRef.current
      ?.closest('figure')
      ?.querySelector('pre code')?.textContent;

    if (!code) return;

    try {
      await copyText(code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setCopyState('idle'),
      FEEDBACK_DURATION_MS,
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className="flex items-center justify-center px-3 font-mono text-xs transition-colors duration-300 rounded-lg cursor-pointer min-h-11 min-w-11 text-muted hover:bg-accent-violet/15 hover:text-foreground focus-ring"
      >
        {BUTTON_LABEL[copyState]}
      </button>
      <span role="status" className="sr-only">
        {STATUS_MESSAGE[copyState]}
      </span>
    </>
  );
};

export default CodeCopyButton;
