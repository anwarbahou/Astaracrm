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
  MessageSquare,
} from "lucide-react";

type UserRole = 'admin' | 'manager' | 'user';

interface NavigationItem {
  id: string;
  path: string;
  icon: any;
  labelKey: string;
  roles?: UserRole[]; // If undefined, accessible to all authenticated users
  soon?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { id: 'messaging', path: '/dashboard/messaging', icon: MessageSquare, labelKey: 'messaging' },
  { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'ai-leads', path: '/dashboard/ai-leads', icon: BrainCircuit, labelKey: 'aiLeads', soon: true },
  { id: 'deals', path: '/dashboard/deals', icon: Handshake, labelKey: 'deals' },
  { id: 'offers', path: '/dashboard/offers', icon: Handshake, labelKey: 'offers', soon: true },
  { id: 'clients', path: '/dashboard/clients', icon: Users, labelKey: 'clients' },
  { id: 'contacts', path: '/dashboard/contacts', icon: Contact, labelKey: 'contacts' },
  { id: 'tasks', path: '/dashboard/tasks', icon: ListTodo, labelKey: 'tasks' },
  { id: 'calendar', path: '/dashboard/calendar', icon: Calendar, labelKey: 'calendar' },
  { id: 'email', path: '/dashboard/email', icon: Mail, labelKey: 'email', soon: true },
  { id: 'notes', path: '/dashboard/notes', icon: Notebook, labelKey: 'notes' },
  { id: 'settings', path: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
  
  // Manager and Admin only - hidden from main navigation
  { id: 'reports', path: '/dashboard/reports', icon: LineChart, labelKey: 'reports', roles: ['manager', 'admin'] },
  { id: 'workflows', path: '/dashboard/workflows', icon: Zap, labelKey: 'workflows', roles: ['manager', 'admin'] },
  { id: 'activity-logs', path: '/dashboard/activity-logs', icon: History, labelKey: 'activityLogs', roles: ['manager', 'admin'] },
  
  // Admin only - hidden from main navigation
  { id: 'users', path: '/dashboard/users', icon: UserCog, labelKey: 'users', roles: ['admin'] }
];
