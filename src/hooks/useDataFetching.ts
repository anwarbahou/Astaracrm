import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface UseDataFetchingOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

export function useDataFetching<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes default
  gcTime = 1000 * 60 * 10, // 10 minutes default
  retry = 3,
  refetchOnWindowFocus = true,
  refetchOnReconnect = true
}: UseDataFetchingOptions<T>) {
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: enabled && !!user?.id,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnReconnect
  });

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const setQueryData = (data: T) => {
    queryClient.setQueryData(queryKey, data);
  };

  return {
    ...query,
    invalidateQuery,
    setQueryData,
    user,
    userProfile
  };
}

// Specialized hook for user-dependent data
export function useUserDataFetching<T>({
  queryKey,
  queryFn,
  ...options
}: Omit<UseDataFetchingOptions<T>, 'enabled'>) {
  const { user, userProfile } = useAuth();
  
  return useDataFetching({
    queryKey,
    queryFn,
    enabled: !!user?.id && !!userProfile?.role,
    ...options
  });
}

// Hook for data that requires admin privileges
export function useAdminDataFetching<T>({
  queryKey,
  queryFn,
  ...options
}: Omit<UseDataFetchingOptions<T>, 'enabled'>) {
  const { user, userProfile } = useAuth();
  
  return useDataFetching({
    queryKey,
    queryFn,
    enabled: !!user?.id && userProfile?.role === 'admin',
    ...options
  });
} 