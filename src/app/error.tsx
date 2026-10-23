'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6 text-center">
      <p className="font-mono text-xs tracking-[0.04em] text-muted">ERROR</p>
      <p className="text-xl font-bold break-keep md:text-3xl">
        알 수 없는 오류가 발생하였습니다.
      </p>
      <Link
        href="/"
        className="flex items-center justify-center px-5 text-sm font-medium transition-colors duration-200 ease-out border min-h-11 rounded-xl border-accent-violet/50 bg-accent-violet/15 text-foreground hover:bg-accent-violet/25 focus-ring"
      >
        홈으로
      </Link>
    </div>
  );
}
