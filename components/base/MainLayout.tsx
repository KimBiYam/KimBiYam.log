import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full h-full bg-white dark:bg-trueGray-800 transition-colors duration-300">
      <div className="container h-full max-w-screen-md px-4 pt-16 md:px-16">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
