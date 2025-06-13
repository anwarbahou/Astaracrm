
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLog } from "@/types/activity";

interface ActivityStatsProps {
  activities: ActivityLog[];
  todayActivities: ActivityLog[];
  businessActivities: ActivityLog[];
}

export function ActivityStats({ activities, todayActivities, businessActivities }: ActivityStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{activities.length}</p>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{todayActivities.length}</p>
            <p className="text-sm text-muted-foreground">Today's Activities</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{new Set(activities.map(a => a.user)).size}</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{businessActivities.length}</p>
            <p className="text-sm text-muted-foreground">Business Actions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
