import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  // Users,
  DollarSign,
  Settings,
  Menu,
  X,
  // BarChart3,
  // MessageSquare,
  Bell,
  Store,
  ChevronRight,
  Grid3X3,
  // Archive,
  Megaphone,
  TicketPercent,
  Zap,
  Users,
  CreditCard,
  Shield,
  UserCheck,
  Star,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  {
    name: "Products",
    icon: Package,
    isDropdown: true,
    subItems: [
      { name: "Categories", href: "/categories", icon: Grid3X3 },
      { name: "Products", href: "/products", icon: Package },
      // { name: "Inventories", href: "/inventories", icon: Archive },
    ],
  },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  {
    name: "Campaign & Coupon Services",
    icon: Zap,
    isDropdown: true,
    subItems: [
      { name: "Campaign", href: "/campaigns", icon: Megaphone },
      { name: "Coupons", href: "/coupons", icon: TicketPercent },
    ],
  },
  {
    name: "Payment Management",
    icon: DollarSign,
    isDropdown: true,
    subItems: [
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Payments", href: "/payments", icon: CreditCard },
    ],
  },
  {
    name: "Reviews",
    icon: Star,
    href: "/reviews",
  },
  {
    name: "User Management",
    icon: Shield,
    isDropdown: true,
    subItems: [
      { name: "Roles", href: "/roles", icon: Shield },
      { name: "Permissions", href: "/permissions", icon: UserCheck },
      { name: "Staff", href: "/staff", icon: Users },
    ],
  },
  // { name: "Customers", href: "/customers", icon: Users },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
  // { name: "Messages", href: "/messages", icon: MessageSquare },
  // { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface ModernSidebarProps {
  isCollapsed?: boolean;
}

export function ModernSidebar({ isCollapsed = false }: ModernSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedDropdowns, setExpandedDropdowns] = useState<string[]>([]);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="bg-white dark:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-700"
        >
          <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out flex flex-col relative",
          // Mobile behavior - hidden by default, overlay when open
          "lg:relative lg:translate-x-0",
          isMobileOpen
            ? "fixed inset-y-0 left-0 z-40 w-64 translate-x-0"
            : "hidden lg:block",
          // Desktop behavior - ensure proper width
          "lg:block",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center border-b border-gray-200 dark:border-gray-700 transition-all duration-300",
            isCollapsed
              ? "justify-center p-[22px]"
              : "justify-center p-[22px] lg:justify-start"
          )}
        >
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 lg:block hidden">
                EcomPanel
              </span>
            )}
            {/* Mobile title always shows */}
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 lg:hidden">
              EcomPanel
            </span>
          </div>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 ml-auto"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            // Handle dropdown items
            if (item.isDropdown && item.subItems) {
              const isExpanded = expandedDropdowns.includes(item.name);
              const hasActiveSubItem = item.subItems.some(
                (subItem) => location.pathname === subItem.href
              );

              const toggleDropdown = () => {
                setExpandedDropdowns((prev) =>
                  prev.includes(item.name)
                    ? prev.filter((name) => name !== item.name)
                    : [...prev, item.name]
                );
              };

              return (
                <div key={item.name} className="relative">
                  {/* Dropdown Header */}
                  <button
                    onClick={toggleDropdown}
                    className={cn(
                      "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
                      isCollapsed
                        ? "justify-center p-3"
                        : "space-x-3 px-3 py-3",
                      hasActiveSubItem
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0",
                        hasActiveSubItem
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400",
                        "h-5 w-5"
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="lg:block hidden flex-1 text-left">
                          {item.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            "lg:block hidden h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </>
                    )}
                    {/* Mobile always shows text */}
                    <span className="lg:hidden flex-1 text-left">
                      {item.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        "lg:hidden h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Dropdown Items */}
                  {isExpanded && !isCollapsed && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
                              isSubActive
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600 ml-2 pl-4"
                                : "text-gray-600 dark:text-gray-400"
                            )}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <subItem.icon
                              className={cn(
                                "flex-shrink-0 h-4 w-4",
                                isSubActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-400 dark:text-gray-500"
                              )}
                            />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Mobile dropdown items */}
                  {isExpanded && (
                    <div className="lg:hidden mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
                              isSubActive
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600 ml-2 pl-4"
                                : "text-gray-600 dark:text-gray-400"
                            )}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <subItem.icon
                              className={cn(
                                "flex-shrink-0 h-4 w-4",
                                isSubActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-400 dark:text-gray-500"
                              )}
                            />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            }

            // Handle regular items
            const isActive = location.pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
                    isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-3",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400",
                      isCollapsed ? "h-5 w-5" : "h-5 w-5"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="lg:block hidden">{item.name}</span>
                  )}
                  {/* Mobile always shows text */}
                  <span className="lg:hidden">{item.name}</span>
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile section - Always at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mt-auto  absolute bottom-0 w-full">
          {!isCollapsed ? (
            // Expanded user profile
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <div className="flex-1 min-w-0 lg:block hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Store Manager
                  </p>
                </div>
                {/* Mobile always shows text */}
                <div className="flex-1 min-w-0 lg:hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Store Manager
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Collapsed user profile
            <div className="p-3 hidden lg:block">
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group relative">
                  <span className="text-white text-sm font-medium">JD</span>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    John Doe
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
