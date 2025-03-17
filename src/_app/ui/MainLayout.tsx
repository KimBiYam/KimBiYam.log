import React from 'react';

import { Footer, ScrollToTopButton } from '@src/shared';
import { Header } from '@src/widgets/base';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Header />
    <main className="w-full min-h-[calc(100vh-theme(spacing.8))]">
      <div className="container h-full max-w-screen-md px-6 pt-16 md:px-8">
        {children}
      </div>
    </main>
    <Footer />
    <ScrollToTopButton />
  </>
);

export default MainLayout;
