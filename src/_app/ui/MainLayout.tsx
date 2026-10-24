import React from 'react';

import { Footer, ScrollToTopButton } from '@src/shared';
import { Header } from '@src/widgets/base';

interface MainLayoutProps {
  children?: React.ReactNode;
}

// Pages opt into the wide (max-w-page) column by rendering an element with
// data-layout="wide"; other pages keep the reading-width column.
const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Header />
    <main className="w-full min-h-[calc(100vh-theme(spacing.8))]">
      <div className="container h-full max-w-screen-md px-6 pt-20 md:px-8 md:pt-24 has-[[data-layout=wide]]:max-w-page md:has-[[data-layout=wide]]:px-6">
        {children}
      </div>
    </main>
    <Footer />
    <ScrollToTopButton />
  </>
);

export default MainLayout;
