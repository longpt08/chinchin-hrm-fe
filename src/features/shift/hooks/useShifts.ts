import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftApi } from '../api/shiftApi';
import { CreateShiftTemplatePayload, RegisterShiftPayload } from '../types';

export const useShifts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: () => shiftApi.getShifts(params),
  });
};

export const useShiftTemplates = () => {
  return useQuery({
    queryKey: ['shiftTemplates'],
    queryFn: shiftApi.getShiftTemplates,
  });
};

export const usePublishShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shiftApi.publishShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useRegisterShifts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shiftApi.registerShifts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useCreateShiftTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shiftApi.createShiftTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftTemplates'] });
    },
  });
};
