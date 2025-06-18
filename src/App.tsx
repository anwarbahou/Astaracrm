import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { pageVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Stagewise toolbar imports
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { ReactPlugin } from "@stagewise-plugins/react";

// Pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import AILeads from "./pages/AILeads";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import EmailCenter from "./pages/EmailCenter";
import Notes from "./pages/Notes";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Workflows from "./pages/Workflows";
import ActivityLogs from "./pages/ActivityLogs";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SIgnupPage from "./pages/SIgnupPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminOnlyRoute, AdminManagerRoute } from "@/components/RoleBasedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 transition-theme duration-theme ease-theme"
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SIgnupPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard">
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="clients/:id" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
            <Route path="contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
            <Route path="ai-leads" element={<ProtectedRoute><AILeads /></ProtectedRoute>} />
            <Route path="tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="email" element={<ProtectedRoute><EmailCenter /></ProtectedRoute>} />
            <Route path="notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            
            {/* Manager and Admin only routes */}
            <Route 
              path="reports" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <Reports />
                  </AdminManagerRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="workflows" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <Workflows />
                  </AdminManagerRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="activity-logs" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <ActivityLogs />
                  </AdminManagerRoute>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin only routes */}
            <Route 
              path="users" 
              element={
                <ProtectedRoute>
                  <AdminOnlyRoute>
                    <Users />
                  </AdminOnlyRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute>
                  <AdminOnlyRoute>
                    <Settings />
                  </AdminOnlyRoute>
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => {
  const { i18n } = useTranslation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);
  
  const isRtl = i18n.dir() === 'rtl';

  // Responsive sidebar margin logic
  const mainContentMargin = isSidebarCollapsed
    ? isRtl ? "mr-0 md:mr-16" : "ml-0 md:ml-16"
    : isRtl ? "mr-0 md:mr-64" : "ml-0 md:ml-64";

  // Hide sidebar and topnav on /login and /signup
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <StagewiseToolbar 
              config={{
                plugins: [ReactPlugin]
              }}
            />
            <Toaster />
            <Sonner />
            {hideLayout ? (
              <AnimatedRoutes />
            ) : (
              <motion.div 
                className="min-h-screen flex w-full bg-background transition-theme duration-theme ease-theme"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="transition-theme duration-theme ease-theme"
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Sidebar isCollapsed={isSidebarCollapsed} onToggle={setSidebarCollapsed} />
                </motion.div>
                
                <motion.div 
                  className={cn(
                    "flex-1 flex flex-col transition-all duration-500 ease-in-out w-full min-w-0",
                    mainContentMargin
                  )}
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.div
                    className="transition-theme duration-theme ease-theme"
                    layout
                  >
                    <TopNavigation />
                  </motion.div>
                  
                  <motion.main 
                    key={i18n.language}
                    className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-background transition-theme duration-theme ease-theme min-w-0"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatedRoutes />
                  </motion.main>
                </motion.div>
              </motion.div>
            )}
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
