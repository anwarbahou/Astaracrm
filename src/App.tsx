
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Deals from "@/pages/Deals";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import EmailCenter from "@/pages/EmailCenter";
import Notes from "@/pages/Notes";
import Reports from "@/pages/Reports";
import Users from "@/pages/Users";
import Workflows from "@/pages/Workflows";
import ActivityLogs from "@/pages/ActivityLogs";
import Settings from "@/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/email" element={<EmailCenter />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
