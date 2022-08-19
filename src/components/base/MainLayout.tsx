import React from 'react';

import useDetectScroll from '../../hooks/useDetectScroll';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  useDetectScroll();

  return (
    <main className="w-full min-h-[calc(100vh-theme(spacing.8))]">
      <div className="container h-full max-w-screen-md px-6 pt-16 md:px-8">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
