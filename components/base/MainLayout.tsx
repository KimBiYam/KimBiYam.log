import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full h-full bg-gray-300">
      <div className="container h-full max-w-screen-md px-16 pt-12">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
