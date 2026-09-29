import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getTodayWorkStatus } from '../api/dashboardApi'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 30_000,
  })
}

export const useTodayWorkStatus = () => {
  return useQuery({
    queryKey: ['todayWorkStatus'],
    queryFn: getTodayWorkStatus,
    refetchInterval: 60_000,
  })
}
