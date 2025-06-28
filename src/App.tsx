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
import { NotificationProvider } from "@/contexts/NotificationContext";
import { pageVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useEffect, useState, lazy, Suspense } from "react";
import { cn } from "@/lib/utils";

// Stagewise toolbar imports
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { ReactPlugin } from "@stagewise-plugins/react";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Deals = lazy(() => import("./pages/Deals"));
const AILeads = lazy(() => import("./pages/AILeads"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Calendar = lazy(() => import("./pages/Calendar"));
const EmailCenter = lazy(() => import("./pages/EmailCenter"));
const Notes = lazy(() => import("./pages/Notes"));
const Reports = lazy(() => import("./pages/Reports"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Workflows = lazy(() => import("./pages/Workflows"));
const ActivityLogs = lazy(() => import("./pages/ActivityLogs"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Keep login pages and landing page as regular imports since they're needed immediately
import LoginPage from "./pages/LoginPage";
import SIgnupPage from "./pages/SIgnupPage";
import LandingPage from "./pages/LandingPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminOnlyRoute, AdminManagerRoute } from "@/components/RoleBasedRoute";

// Enhanced loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Wrapper component for lazy loaded pages
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SIgnupPage />} />
          <Route path="/dashboard">
            <Route index element={<ProtectedRoute><LazyWrapper><Dashboard /></LazyWrapper></ProtectedRoute>} />
            <Route path="clients" element={<ProtectedRoute><LazyWrapper><Clients /></LazyWrapper></ProtectedRoute>} />
            <Route path="clients/:id" element={<ProtectedRoute><LazyWrapper><ClientProfile /></LazyWrapper></ProtectedRoute>} />
            <Route path="contacts" element={<ProtectedRoute><LazyWrapper><Contacts /></LazyWrapper></ProtectedRoute>} />
            <Route path="deals" element={<ProtectedRoute><LazyWrapper><Deals /></LazyWrapper></ProtectedRoute>} />
            <Route path="ai-leads" element={<ProtectedRoute><LazyWrapper><AILeads /></LazyWrapper></ProtectedRoute>} />
            <Route path="tasks" element={<ProtectedRoute><LazyWrapper><Tasks /></LazyWrapper></ProtectedRoute>} />
            <Route path="calendar" element={<ProtectedRoute><LazyWrapper><Calendar /></LazyWrapper></ProtectedRoute>} />
            <Route path="email" element={<ProtectedRoute><LazyWrapper><EmailCenter /></LazyWrapper></ProtectedRoute>} />
            <Route path="notes" element={<ProtectedRoute><LazyWrapper><Notes /></LazyWrapper></ProtectedRoute>} />
            
            {/* Manager and Admin only routes */}
            <Route 
              path="reports" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <LazyWrapper><Reports /></LazyWrapper>
                  </AdminManagerRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="workflows" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <LazyWrapper><Workflows /></LazyWrapper>
                  </AdminManagerRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="activity-logs" 
              element={
                <ProtectedRoute>
                  <AdminManagerRoute>
                    <LazyWrapper><ActivityLogs /></LazyWrapper>
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
                    <LazyWrapper><Users /></LazyWrapper>
                  </AdminOnlyRoute>
                </ProtectedRoute>
              } 
            />
            {/* Settings accessible to all users */}
            <Route 
              path="settings" 
              element={
                <ProtectedRoute>
                  <LazyWrapper><Settings /></LazyWrapper>
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
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

  // Hide sidebar and topnav on /login, /signup, and landing page
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
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
                  className="transition-theme duration-theme ease-theme hidden xl:block"
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Sidebar isCollapsed={isSidebarCollapsed} onToggle={setSidebarCollapsed} />
                </motion.div>
                
                <motion.div 
                  className={cn(
                    "flex-1 flex flex-col transition-all duration-500 ease-in-out w-full min-w-0",
                    isSidebarCollapsed ? "xl:pl-[72px]" : "xl:pl-64"
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
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
