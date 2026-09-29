import axios from 'axios';
import { CreateAdjustmentPayload, GeneratePayslipPayload, PayrollCalculation } from '../types';

const API_BASE = '/api/payroll';

export const calculatePayroll = async (params: { month: number; year: number }): Promise<PayrollCalculation[]> => {
  const { data } = await axios.get(`${API_BASE}/calculate`, { params });
  return data;
};

export const generatePayslip = async (payload: GeneratePayslipPayload): Promise<any> => {
  const { data } = await axios.post(`${API_BASE}/payslips`, payload);
  return data;
};

export const getPayslips = async (params?: { userId?: string; month?: number; year?: number }): Promise<any[]> => {
  const { data } = await axios.get(`${API_BASE}/payslips`, { params });
  return data;
};

export const addAdjustment = async (payload: CreateAdjustmentPayload): Promise<any> => {
  const { data } = await axios.post(`${API_BASE}/adjustments`, payload);
  return data;
};

export const getAdjustments = async (params?: { userId?: string; month?: number; year?: number }): Promise<any[]> => {
  const { data } = await axios.get(`${API_BASE}/adjustments`, { params });
  return data;
};
