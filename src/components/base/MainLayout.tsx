'use client';

import React from 'react';

import { AnimatePresence } from 'framer-motion';

import Footer from './Footer';
import Header from './Header';
import ScrollToTopButton from './ScrollToTopButton';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Header />
    <main className="w-full min-h-[calc(100vh-theme(spacing.8))]">
      <div className="h-full px-6 pt-16 md:px-8">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </main>
    <Footer />
    <ScrollToTopButton />
  </>
);

export default MainLayout;
