
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import { ActivityLog } from "@/types/activity";
import { mockActivities } from "@/data/mockActivityLogs";
import { ActivityStats } from "@/components/activity/ActivityStats";
import { ActivityTabs } from "@/components/activity/ActivityTabs";

export default function ActivityLogs() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Use mock data
  const activities: ActivityLog[] = mockActivities;

  const filteredActivities = activities.filter(activity =>
    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayActivities = filteredActivities.filter(activity => 
    new Date(activity.timestamp).toDateString() === new Date().toDateString()
  );

  const systemActivities = filteredActivities.filter(activity => 
    activity.type === "user_login" || activity.type === "report_generated"
  );

  const businessActivities = filteredActivities.filter(activity => 
    !["user_login", "report_generated"].includes(activity.type)
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('activityLogs.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('activityLogs.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            {t('activityLogs.filter')}
          </Button>
          <Button className="gap-2">
            <Download size={16} />
            {t('activityLogs.export')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('activityLogs.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <ActivityStats 
        activities={activities}
        todayActivities={todayActivities}
        businessActivities={businessActivities}
      />

      {/* Activity Tabs */}
      <ActivityTabs
        filteredActivities={filteredActivities}
        todayActivities={todayActivities}
        businessActivities={businessActivities}
        systemActivities={systemActivities}
      />
    </div>
  );
}
