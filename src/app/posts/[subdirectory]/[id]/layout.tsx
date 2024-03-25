import { PropsWithChildren } from 'react';

export default function PostDetailLayout({
  children,
}: PropsWithChildren<unknown>) {
  return <div className="container max-w-screen-md">{children}</div>;
}
