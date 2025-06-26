
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ActivityStats } from "@/components/activity/ActivityStats";
import { ActivityTabs } from "@/components/activity/ActivityTabs";

export default function ActivityLogs() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    activities,
    todayActivities,
    systemActivities,
    businessActivities,
    isLoading,
    error,
    refetch
  } = useActivityLogs();

  const filteredActivities = activities.filter(activity =>
    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTodayActivities = filteredActivities.filter(activity => 
    new Date(activity.timestamp).toDateString() === new Date().toDateString()
  );

  const filteredSystemActivities = filteredActivities.filter(activity => 
    activity.type === "user_login" || activity.type === "report_generated"
  );

  const filteredBusinessActivities = filteredActivities.filter(activity => 
    !["user_login", "report_generated"].includes(activity.type)
  );

  if (error) {
    return (
      <div className="space-y-6 animate-in">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading activity logs: {error.message}</p>
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw size={16} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
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
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-muted-foreground">Loading activity logs...</p>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No activity logs found.</p>
          <p className="text-sm text-muted-foreground">
            Activity logs will appear here as users perform actions in the system.
          </p>
        </div>
      )}

      {/* Stats Cards - Only show if we have data */}
      {!isLoading && activities.length > 0 && (
        <>
          <ActivityStats 
            activities={activities}
            todayActivities={todayActivities}
            businessActivities={businessActivities}
          />

          {/* Activity Tabs */}
          <ActivityTabs
            filteredActivities={filteredActivities}
            todayActivities={filteredTodayActivities}
            businessActivities={filteredBusinessActivities}
            systemActivities={filteredSystemActivities}
          />
        </>
      )}
    </div>
  );
}
