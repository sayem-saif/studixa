import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  onLogout?: () => void;
  userName?: string;
}

const Header = ({ title, primaryAction, onLogout, userName }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div>
        <h1 id="page-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {primaryAction && (
          <Button
            id="header-primary-action"
            onClick={primaryAction.onClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 h-9 rounded-lg shadow-none"
          >
            {primaryAction.label}
          </Button>
        )}

        {userName && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{userName}</span>
          </div>
        )}

        {onLogout && (
          <button
            id="header-logout"
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
