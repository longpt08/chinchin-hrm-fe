import type { SalaryAdjustment } from '@/types';

export interface CreateAdjustmentPayload {
  userId: string;
  type: 'allowance' | 'punishment' | 'advance';
  amount: number;
  date: string;
  description: string;
}

export interface GeneratePayslipPayload {
  userId: string;
  month: number;
  year: number;
}

export interface PayrollCalculation {
  userId: string;
  userName: string;
  month: number;
  year: number;
  baseSalary: number;
  totalHours: number;
  allowances: number;
  punishments: number;
  advances: number;
  finalTotal: number;
  adjustments: SalaryAdjustment[];
}
