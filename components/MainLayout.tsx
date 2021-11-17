import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="container h-full max-w-screen-md px-16 pt-8">
      {children}
    </div>
  );
};

export default MainLayout;
