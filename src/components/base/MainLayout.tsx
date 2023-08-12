'use client';

import React from 'react';

import { AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <main className="w-full min-h-[calc(100vh-theme(spacing.8))]">
    <div className="container h-full max-w-screen-md px-6 pt-16 md:px-8">
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </div>
  </main>
);

export default MainLayout;
