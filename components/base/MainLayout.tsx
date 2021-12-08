import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full min-h-[100vh] bg-white dark:bg-trueGray-800 transition-colors duration-300">
      <div className="container h-full max-w-screen-md px-4 pt-16 md:px-16 text-black dark:text-warmGray-400">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
