
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
  { id: 'dashboard', path: '/', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { id: 'clients', path: '/clients', icon: Users, labelKey: 'sidebar.clients' },
  { id: 'contacts', path: '/contacts', icon: Contact, labelKey: 'sidebar.contacts' },
  { id: 'deals', path: '/deals', icon: Handshake, labelKey: 'sidebar.deals' },
  { id: 'ai-leads', path: '/ai-leads', icon: BrainCircuit, labelKey: 'sidebar.aiLeads' },
  { id: 'tasks', path: '/tasks', icon: ListTodo, labelKey: 'sidebar.tasks' },
  { id: 'calendar', path: '/calendar', icon: Calendar, labelKey: 'sidebar.calendar' },
  { id: 'email', path: '/email', icon: Mail, labelKey: 'sidebar.email' },
  { id: 'notes', path: '/notes', icon: Notebook, labelKey: 'sidebar.notes' },
  { id: 'reports', path: '/reports', icon: LineChart, labelKey: 'sidebar.reports' },
  { id: 'users', path: '/users', icon: UserCog, labelKey: 'sidebar.users' },
  { id: 'settings', path: '/settings', icon: Settings, labelKey: 'sidebar.settings' },
  { id: 'workflows', path: '/workflows', icon: Zap, labelKey: 'sidebar.workflows' },
  { id: 'activity-logs', path: '/activity-logs', icon: History, labelKey: 'sidebar.activityLogs' },
];
