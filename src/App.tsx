import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ModernSidebar } from "@/components/layout/ModernSidebar";
import { Header } from "@/components/layout/Header";
import {
  Dashboard,
  Roles,
  AddRole,
  ViewRole,
  EditRole,
  Settings,
  Notifications,
  Login,
} from "@/pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "./utils/cookie";
import { AUTH_COOKIE_CONFIG } from "./constants/common";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const location = window.location.pathname;

  useEffect(() => {
    // Check if user is authenticated via cookie
    const token = getCookie(AUTH_COOKIE_CONFIG.userAccessToken);
    setIsAuthenticated(!!token);
    setChecking(false);
  }, []);

  if (checking || isAuthenticated === null) {
    // Loading state
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated and tries to access /login, redirect to dashboard
  if (isAuthenticated && location === "/login") {
    return <Navigate to="/" replace />;
  }

  // If not authenticated and not on /login, redirect to login
  if (!isAuthenticated && location !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <ToastContainer />

      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="h-screen bg-gray-50 dark:bg-gray-900 lg:flex overflow-hidden">
                  {/* Sidebar with border */}
                  <div
                    className={`border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ${
                      isSidebarCollapsed
                        ? "lg:min-w-[64px]"
                        : "lg:min-w-[250px]"
                    }`}
                  >
                    <ModernSidebar isCollapsed={isSidebarCollapsed} />
                  </div>
                  {/* Main content with subtle left border for separation */}
                  <div className="flex-1 flex flex-col min-w-0 lg:ml-0 h-full">
                    <Header
                      onSidebarToggle={toggleSidebar}
                      isSidebarCollapsed={isSidebarCollapsed}
                    />
                    <main className="flex-1 overflow-y-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Role Management Routes */}
                        <Route path="/roles" element={<Roles />} />
                        <Route path="/roles/add" element={<AddRole />} />
                        <Route path="/roles/view/:id" element={<ViewRole />} />
                        <Route path="/roles/edit/:id" element={<EditRole />} />
                        
                        {/* Other Pages */}
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/notifications" element={<Notifications />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
