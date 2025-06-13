
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText } from "lucide-react";
import { ActivityLog } from "@/types/activity";
import { ActivityItem } from "./ActivityItem";

interface ActivityTabsProps {
  filteredActivities: ActivityLog[];
  todayActivities: ActivityLog[];
  businessActivities: ActivityLog[];
  systemActivities: ActivityLog[];
}

export function ActivityTabs({ 
  filteredActivities, 
  todayActivities, 
  businessActivities, 
  systemActivities 
}: ActivityTabsProps) {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All Activities</TabsTrigger>
        <TabsTrigger value="today">Today ({todayActivities.length})</TabsTrigger>
        <TabsTrigger value="business">Business Actions</TabsTrigger>
        <TabsTrigger value="system">System Events</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Activities ({filteredActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="today" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Activities ({todayActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayActivities.length > 0 ? (
                todayActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No activities today</h3>
                  <p className="text-muted-foreground">Activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="business" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Business Activities ({businessActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="system" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Events ({systemActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemActivities.length > 0 ? (
                systemActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No system events</h3>
                  <p className="text-muted-foreground">System events will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
