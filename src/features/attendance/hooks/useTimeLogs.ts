import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendanceApi';
import { ClockInPayload, ClockOutPayload } from '../types';

export const useTodayTimeLogs = () => {
  return useQuery({
    queryKey: ['timeLogs', 'today'],
    queryFn: () => attendanceApi.getTodayLogs(),
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => attendanceApi.getEmployees(),
  });
};

export const useClockIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ClockInPayload) => attendanceApi.clockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeLogs', 'today'] });
    },
  });
};

export const useClockOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ClockOutPayload) => attendanceApi.clockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeLogs', 'today'] });
    },
  });
};
