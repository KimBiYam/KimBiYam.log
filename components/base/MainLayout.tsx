import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full min-h-[100vh] transition-container">
      <div className="container h-full max-w-screen-md px-4 pt-16 md:px-16 text-black dark:text-warmGray-400">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
