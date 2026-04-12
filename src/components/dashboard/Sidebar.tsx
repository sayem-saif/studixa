import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Wrench,
  Settings,
  ChevronLeft,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  section: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { id: "subjects", label: "Subjects", icon: BookOpen, section: "main" },
  { id: "performance", label: "Performance", icon: BarChart3, section: "main" },
  { id: "tools", label: "Tools", icon: Wrench, section: "tools" },
  { id: "settings", label: "Settings", icon: Settings, section: "settings" },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const mainItems = navItems.filter((item) => item.section === "main");
  const toolItems = navItems.filter((item) => item.section === "tools");
  const settingItems = navItems.filter((item) => item.section === "settings");

  const renderNavItem = (item: NavItem) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        id={`nav-${item.id}`}
        onClick={() => onItemClick(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
          transition-colors duration-150
          ${
            isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.8} />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200
        flex flex-col z-40
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-[60px] px-4 border-b border-gray-200 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-gray-900 text-[15px]">Studixa</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Main section */}
        <div className="space-y-0.5">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Tools section */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          {!collapsed && (
            <span className="px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Tools
            </span>
          )}
          <div className="mt-2 space-y-0.5">
            {toolItems.map(renderNavItem)}
          </div>
        </div>

        {/* Settings section */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          {!collapsed && (
            <span className="px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Account
            </span>
          )}
          <div className="mt-2 space-y-0.5">
            {settingItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          id="sidebar-collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
