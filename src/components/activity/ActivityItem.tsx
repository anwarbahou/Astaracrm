
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Eye } from "lucide-react";
import { ActivityLog } from "@/types/activity";
import { getActivityIcon, getActivityColor, formatTime } from "@/utils/activityUtils";

interface ActivityItemProps {
  activity: ActivityLog;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const ActivityIcon = getActivityIcon(activity.type);
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <ActivityIcon className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{activity.action}</h4>
              <Badge variant="outline" className={getActivityColor(activity.type)}>
                {activity.type.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">{activity.userAvatar}</AvatarFallback>
            </Avatar>
            <span>{activity.user}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatTime(activity.timestamp)}</span>
          </div>
          <span>Related to: {activity.relatedTo}</span>
          {activity.entityId && <span>ID: {activity.entityId}</span>}
        </div>
        
        {Object.keys(activity.changes).length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Changes:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(activity.changes).slice(0, 3).map(([key, value], index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
              {Object.keys(activity.changes).length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{Object.keys(activity.changes).length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
