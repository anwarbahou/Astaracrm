
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

export const navigationItems = [
  { id: 'dashboard', path: '/', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'clients', path: '/clients', icon: Users, labelKey: 'clients' },
  { id: 'contacts', path: '/contacts', icon: Contact, labelKey: 'contacts' },
  { id: 'deals', path: '/deals', icon: Handshake, labelKey: 'deals' },
  { id: 'ai-leads', path: '/ai-leads', icon: BrainCircuit, labelKey: 'aiLeads' },
  { id: 'tasks', path: '/tasks', icon: ListTodo, labelKey: 'tasks' },
  { id: 'calendar', path: '/calendar', icon: Calendar, labelKey: 'calendar' },
  { id: 'email', path: '/email', icon: Mail, labelKey: 'email' },
  { id: 'notes', path: '/notes', icon: Notebook, labelKey: 'notes' },
  { id: 'reports', path: '/reports', icon: LineChart, labelKey: 'reports' },
  { id: 'users', path: '/users', icon: UserCog, labelKey: 'users' },
  { id: 'settings', path: '/settings', icon: Settings, labelKey: 'settings' },
  { id: 'workflows', path: '/workflows', icon: Zap, labelKey: 'workflows' },
  { id: 'activity-logs', path: '/activity-logs', icon: History, labelKey: 'activityLogs' },
];
