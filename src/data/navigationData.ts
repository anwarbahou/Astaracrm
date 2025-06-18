import {
  LayoutDashboard,
  Users,
  Contact,
  Handshake,
  BrainCircuit,
  ListTodo,
  Calendar,
  Mail,
  Notebook,
  LineChart,
  UserCog,
  Settings,
  Zap,
  History,
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['user_role'];

interface NavigationItem {
  id: string;
  path: string;
  icon: any;
  labelKey: string;
  roles?: UserRole[]; // If undefined, accessible to all authenticated users
}

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'clients', path: '/dashboard/clients', icon: Users, labelKey: 'clients' },
  { id: 'contacts', path: '/dashboard/contacts', icon: Contact, labelKey: 'contacts' },
  { id: 'deals', path: '/dashboard/deals', icon: Handshake, labelKey: 'deals' },
  { id: 'ai-leads', path: '/dashboard/ai-leads', icon: BrainCircuit, labelKey: 'aiLeads' },
  { id: 'tasks', path: '/dashboard/tasks', icon: ListTodo, labelKey: 'tasks' },
  { id: 'calendar', path: '/dashboard/calendar', icon: Calendar, labelKey: 'calendar' },
  { id: 'email', path: '/dashboard/email', icon: Mail, labelKey: 'email' },
  { id: 'notes', path: '/dashboard/notes', icon: Notebook, labelKey: 'notes' },
  
  // Manager and Admin only
  { id: 'reports', path: '/dashboard/reports', icon: LineChart, labelKey: 'reports', roles: ['manager', 'admin'] },
  { id: 'workflows', path: '/dashboard/workflows', icon: Zap, labelKey: 'workflows', roles: ['manager', 'admin'] },
  { id: 'activity-logs', path: '/dashboard/activity-logs', icon: History, labelKey: 'activityLogs', roles: ['manager', 'admin'] },
  
  // Admin only
  { id: 'users', path: '/dashboard/users', icon: UserCog, labelKey: 'users', roles: ['admin'] },
  { id: 'settings', path: '/dashboard/settings', icon: Settings, labelKey: 'settings', roles: ['admin'] },
];
