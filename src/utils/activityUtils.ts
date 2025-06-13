
import { 
  DollarSign,
  Mail,
  Phone,
  Clock,
  User,
  FileText
} from "lucide-react";

export const getActivityIcon = (type: string) => {
  switch (type) {
    case "deal_created":
    case "deal_stage_changed":
      return DollarSign;
    case "email_sent":
      return Mail;
    case "call_logged":
      return Phone;
    case "task_completed":
    case "task_assigned":
      return Clock;
    case "client_added":
      return User;
    case "note_created":
      return FileText;
    case "user_login":
      return User;
    case "report_generated":
      return FileText;
    default:
      return Clock;
  }
};

export const getActivityColor = (type: string) => {
  switch (type) {
    case "deal_created":
    case "deal_stage_changed":
      return "bg-green-100 text-green-800";
    case "email_sent":
      return "bg-blue-100 text-blue-800";
    case "call_logged":
      return "bg-purple-100 text-purple-800";
    case "task_completed":
    case "task_assigned":
      return "bg-orange-100 text-orange-800";
    case "client_added":
      return "bg-cyan-100 text-cyan-800";
    case "note_created":
      return "bg-yellow-100 text-yellow-800";
    case "user_login":
      return "bg-gray-100 text-gray-800";
    case "report_generated":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else {
    return date.toLocaleDateString();
  }
};
