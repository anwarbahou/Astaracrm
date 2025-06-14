
import { 
  Home, 
  Users, 
  User, 
  Settings, 
  Calendar, 
  Mail, 
  Search, 
  List, 
  Clock, 
  DollarSign, 
  Bot,
  FileText,
  BarChart3
} from "lucide-react";

export const sidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    route: "/",
    color: "hover:text-blue-400"
  },
  {
    id: "clients",
    label: "Clients",
    icon: Users,
    route: "/clients",
    color: "hover:text-emerald-400"
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: User,
    route: "/contacts",
    color: "hover:text-purple-400"
  },
  {
    id: "deals",
    label: "Deals",
    icon: DollarSign,
    route: "/deals",
    color: "hover:text-green-400"
  },
  {
    id: "ai-leads",
    label: "AI Leads",
    icon: Bot,
    route: "/ai-leads",
    color: "hover:text-cyan-400"
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: List,
    route: "/tasks",
    color: "hover:text-orange-400"
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    route: "/calendar",
    color: "hover:text-red-400"
  },
  {
    id: "email",
    label: "Email Center",
    icon: Mail,
    route: "/email",
    color: "hover:text-indigo-400"
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    route: "/notes",
    color: "hover:text-yellow-400"
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    route: "/reports",
    color: "hover:text-pink-400"
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    route: "/users",
    color: "hover:text-teal-400"
  },
  {
    id: "workflows",
    label: "Workflows",
    icon: Settings,
    route: "/workflows",
    color: "hover:text-violet-400"
  },
  {
    id: "activity-logs",
    label: "Activity Logs",
    icon: Clock,
    route: "/activity-logs",
    color: "hover:text-amber-400"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    route: "/settings",
    color: "hover:text-gray-400"
  }
];
