
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Check,
  AlertTriangle,
  MessageCircle,
  Info,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  X,
  CheckCheck,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "message" | "lead" | "campaign";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

interface NotificationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSidebar({ open, onOpenChange }: NotificationSidebarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "lead",
      title: "Nouveau lead qualifié",
      description: "Aicha Bennani d'Atlas Digital a visité votre page tarifs",
      timestamp: "Il y a 5 minutes",
      isRead: false,
      priority: "high"
    },
    {
      id: "2",
      type: "success",
      title: "Campagne terminée",
      description: "Campagne 'MENA Tech Leaders' - 87% de taux d'ouverture",
      timestamp: "Il y a 15 minutes",
      isRead: false,
      priority: "medium"
    },
    {
      id: "3",
      type: "message",
      title: "Nouveau message",
      description: "Omar Al-Rashid a répondu à votre proposition",
      timestamp: "Il y a 30 minutes",
      isRead: true,
      priority: "medium"
    },
    {
      id: "4",
      type: "warning",
      title: "Synchronisation échouée",
      description: "Erreur de synchronisation avec LinkedIn Maroc",
      timestamp: "Il y a 1 heure",
      isRead: true,
      priority: "high"
    },
    {
      id: "5",
      type: "campaign",
      title: "Campagne lancée",
      description: "Nouvelle campagne 'Prospects Casablanca' activée",
      timestamp: "Il y a 2 heures",
      isRead: true,
      priority: "low"
    },
    {
      id: "6",
      type: "info",
      title: "Rapport mensuel",
      description: "Votre rapport de performance janvier est disponible",
      timestamp: "Il y a 3 heures",
      isRead: true,
      priority: "low"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "lead":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "campaign":
        return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityStyles = (priority: string, isRead: boolean) => {
    const baseStyles = "transition-all duration-200 hover:bg-muted/50";
    
    if (isRead) {
      return `${baseStyles} opacity-75`;
    }

    switch (priority) {
      case "high":
        return `${baseStyles} border-l-4 border-red-500 bg-red-500/5`;
      case "medium":
        return `${baseStyles} border-l-4 border-blue-500 bg-blue-500/5`;
      default:
        return `${baseStyles} border-l-4 border-gray-300 bg-gray-500/5`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-96 sm:max-w-96 p-0 animate-slide-in-right"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-1 text-xs"
                disabled={unreadCount === 0}
              >
                <CheckCheck size={12} />
                Tout lire
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="gap-1 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 size={12} />
                Effacer
              </Button>
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Check className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune notification
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous êtes à jour ! Nous vous tiendrons informé des nouvelles activités.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg cursor-pointer group ${getPriorityStyles(
                    notification.priority,
                    notification.isRead
                  )}`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
