import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  Settings, 
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { signOut } from '@/utils/auth';

interface HeaderProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Header({ onSidebarToggle, isSidebarCollapsed = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleProfileMenuClick = (action: string) => {
    setIsProfileDropdownOpen(false)
    
    switch (action) {
      case 'profile':
        navigate('/settings') // Navigate to settings with profile tab
        break
      case 'settings':
        navigate('/settings')
        break
      case 'billing':
        navigate('/settings') // Navigate to settings with billing tab
        break
      case 'help':
        navigate('/settings') // Navigate to settings with help tab
        break
      case 'logout': {
        signOut();
        break;
      }
      default:
        break
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-[77px] flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center flex-1 max-w-md">
        {/* Sidebar Toggle Button - Only show on desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="mr-3 hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:flex transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </Button>
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products, orders, customers..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/notifications')}
          className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/settings')}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </Button>

        {/* User Profile - With dropdown */}
        <div className="relative">
          <div 
            className="flex items-center space-x-2 sm:space-x-3 pl-2 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Store Manager</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileDropdownOpen(false)}
              />
              
              {/* Dropdown content */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button 
                    onClick={() => handleProfileMenuClick('profile')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => handleProfileMenuClick('settings')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    onClick={() => handleProfileMenuClick('billing')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Billing & Plans</span>
                  </button>
                  <button 
                    onClick={() => handleProfileMenuClick('help')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </button>
                </div>

                {/* Logout section */}
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button 
                    onClick={() => handleProfileMenuClick('logout')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
