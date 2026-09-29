import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calculatePayroll, generatePayslip, getPayslips, addAdjustment } from '../api/payrollApi';
import { CreateAdjustmentPayload, GeneratePayslipPayload } from '../types';

export const usePayrollData = (month: number, year: number) => {
  return useQuery({
    queryKey: ['payroll', 'calculate', month, year],
    queryFn: () => calculatePayroll({ month, year }),
  });
};

export const usePayslips = (userId?: string) => {
  return useQuery({
    queryKey: ['payroll', 'payslips', userId],
    queryFn: () => getPayslips(userId ? { userId } : undefined),
  });
};

export const useGeneratePayslip = () => {
  return useMutation({
    mutationFn: (payload: GeneratePayslipPayload) => generatePayslip(payload),
  });
};

export const useAddAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateAdjustmentPayload) => addAdjustment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};
