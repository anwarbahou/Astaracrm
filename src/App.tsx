
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { pageVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/ai-leads" element={<AILeads />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/email" element={<EmailCenter />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => {
  const { i18n } = useTranslation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);
  
  const isRtl = i18n.dir() === 'rtl';

  const mainContentMargin = isSidebarCollapsed
    ? isRtl ? "mr-16" : "ml-16"
    : isRtl ? "mr-64" : "ml-64";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                  "flex-1 flex flex-col transition-all duration-500 ease-in-out",
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
                  className="flex-1 p-4 md:p-6 overflow-auto bg-background transition-theme duration-theme ease-theme"
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
