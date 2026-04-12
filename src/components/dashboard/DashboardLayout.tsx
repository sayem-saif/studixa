import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeNav: string;
  onNavChange: (id: string) => void;
  pageTitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  onLogout?: () => void;
  userName?: string;
}

const DashboardLayout = ({
  children,
  activeNav,
  onNavChange,
  pageTitle,
  primaryAction,
  onLogout,
  userName,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeNav} onItemClick={onNavChange} />

      {/* Main area — offset by sidebar width */}
      <div className="ml-[240px] transition-all duration-200">
        <Header
          title={pageTitle}
          primaryAction={primaryAction}
          onLogout={onLogout}
          userName={userName}
        />

        <main className="px-8 py-6">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
