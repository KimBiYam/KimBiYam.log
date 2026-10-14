import PostIndexLayout from '@src/(pages)/post-index/PostIndexLayout/ui/PostIndexLayout';

import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <PostIndexLayout>{children}</PostIndexLayout>
);

export default Layout;
