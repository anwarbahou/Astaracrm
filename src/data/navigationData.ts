
import { 
  Home, 
  Users, 
  User, 
  Settings, 
  Calendar, 
  Mail, 
  List, 
  Clock, 
  DollarSign, 
  Bot,
  FileText,
  BarChart3
} from "lucide-react";

export const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    id: "clients",
    label: "Clients",
    icon: Users,
    path: "/clients",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: User,
    path: "/contacts",
  },
  {
    id: "deals",
    label: "Deals",
    icon: DollarSign,
    path: "/deals",
  },
  {
    id: "ai-leads",
    label: "AI Leads",
    icon: Bot,
    path: "/ai-leads",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: List,
    path: "/tasks",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    id: "email",
    label: "Email Center",
    icon: Mail,
    path: "/email",
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    path: "/notes",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    path: "/users",
  },
  {
    id: "workflows",
    label: "Workflows",
    icon: Settings,
    path: "/workflows",
  },
  {
    id: "activity-logs",
    label: "Activity Logs",
    icon: Clock,
    path: "/activity-logs",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  }
];
