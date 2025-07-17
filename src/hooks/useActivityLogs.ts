import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { activityLogsService } from '@/services/activityLogsService';
import { ActivityLog } from '@/types/activity';

export const useActivityLogs = () => {
  const { user, userProfile } = useAuth();

  const {
    data: activities = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['activity-logs', user?.id, userProfile?.role],
    queryFn: async () => {
      if (!user?.id || !userProfile?.role) {
        return [];
      }

      return await activityLogsService.getActivityLogs({
        userId: user.id,
        userRole: userProfile.role
      });
    },
    enabled: !!user?.id && !!userProfile?.role,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const todayActivities = activities.filter((activity: ActivityLog) => 
    new Date(activity.timestamp).toDateString() === new Date().toDateString()
  );

  const systemActivities = activities.filter((activity: ActivityLog) => 
    activity.type === "user_login" || activity.type === "report_generated"
  );

  const businessActivities = activities.filter((activity: ActivityLog) => 
    !["user_login", "report_generated"].includes(activity.type)
  );

  return {
    activities,
    todayActivities,
    systemActivities,
    businessActivities,
    isLoading,
    error,
    refetch
  };
}; 