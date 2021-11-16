import React from "react";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="container h-full mx-auto px-4 pt-8">{children}</div>;
};

export default MainLayout;
