
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
  Trash2,
  UserPlus,
  Building,
  DollarSign,
  Volume2,
  VolumeX
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { type NotificationData } from "@/services/notificationService";

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
  const { 
    notifications, 
    unreadCount, 
    loading, 
    soundEnabled,
    markAsRead, 
    markAllAsRead, 
    clearAll,
    toggleSound,
    testSound 
  } = useNotifications();

  const formatTimestamp = (created_at: string) => {
    const now = new Date();
    const createdDate = new Date(created_at);
    const diffInMinutes = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return createdDate.toLocaleDateString();
  };

  const getNotificationIcon = (type: string, data?: any) => {
    switch (type) {
      case "contact_added":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "client_added":
        return <Building className="h-4 w-4 text-green-500" />;
      case "deal_added":
        // Show multiple dollar signs for bulk operations
        if (data?.isBulkOperation) {
          return (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <DollarSign className="h-3 w-3 text-emerald-400 -ml-1" />
              <DollarSign className="h-2 w-2 text-emerald-300 -ml-1" />
            </div>
          );
        }
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case "contact_updated":
        return <UserPlus className="h-4 w-4 text-blue-400" />;
      case "client_updated":
        return <Building className="h-4 w-4 text-green-400" />;
      case "deal_updated":
        return <DollarSign className="h-4 w-4 text-emerald-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityStyles = (priority: string, is_read: boolean) => {
    const baseStyles = "transition-all duration-200 hover:bg-muted/50";
    
    if (is_read) {
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

  const deleteNotification = (id: string) => {
    // For now, we'll implement this as marking as read since we don't have individual delete
    markAsRead(id);
  };

  const getNotificationContent = (notification: NotificationData) => {
    // Extract user information from notification data
    const performerName = notification.data?.performerName || 'Unknown User';
    const performerRole = notification.data?.performerRole || 'user';
    const performerEmail = notification.data?.performerEmail || '';
    const entityName = notification.data?.entityName || notification.data?.contactName || notification.data?.clientName || notification.data?.dealName;
    
    // Use the description as-is since it already contains the entity name
    let description = notification.description;
    
    return {
      title: notification.title,
      description,
      performerName,
      performerRole,
      performerEmail,
      entityName,
      timestamp: notification.created_at
    };
  };

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
          
          <div className="flex gap-2 mt-3">
            {/* Sound toggle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSound}
              className="gap-1 text-xs"
              title={soundEnabled ? "Disable notification sounds" : "Enable notification sounds"}
            >
              {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              Sound
            </Button>
            
            {/* Test sound button (only show when sound is enabled) */}
            {soundEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={testSound}
                className="gap-1 text-xs"
                title="Test notification sound"
              >
                🔊 Test
              </Button>
            )}
            
            {notifications.length > 0 && (
              <>
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
              </>
            )}
          </div>
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
              {notifications.map((notification, index) => {
                const content = getNotificationContent(notification);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg cursor-pointer group ${getPriorityStyles(
                      notification.priority,
                      notification.is_read
                    )}`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type, notification.data)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {content.title}
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
                          {content.description}
                        </p>
                        
                        {/* Show bulk operation indicator */}
                        {notification.data?.isBulkOperation && (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs px-1 py-0 bg-emerald-100 text-emerald-700">
                              Bulk Import
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.data.dealCount} deals • {notification.data.totalValue?.toLocaleString()} MAD
                            </span>
                          </div>
                        )}
                        
                        {/* Show user context for admin notifications */}
                        {content.performerName !== 'Unknown User' && !content.description.startsWith('You ') && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {content.performerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {content.performerName} ({content.performerRole})
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(content.timestamp)}
                          </p>
                          
                          {/* Priority indicator */}
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!notification.is_read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
