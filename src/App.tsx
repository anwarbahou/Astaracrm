
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="app-layout transition-colors duration-300">
              <AppSidebar />
              <div className="content-container">
                <TopNavigation />
                <main className="page-container">
                  <Routes>
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
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
