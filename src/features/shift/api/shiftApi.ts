import axios from 'axios';
import { CreateShiftTemplatePayload, RegisterShiftPayload } from '../types';
import { Shift, ShiftTemplate } from '@/types';

const API_BASE = '/api';

// Create a configured axios instance if you have one globally, 
// for now using standard axios and mocking since backend is not available
const api = axios.create({ baseURL: API_BASE });

export const shiftApi = {
  getShifts: async (params?: Record<string, any>) => {
    // Mock response for now, in a real scenario:
    // const { data } = await api.get<Shift[]>('/shifts', { params });
    // return data;
    
    console.log('Mock getShifts with params:', params);
    return [] as Shift[];
  },
  
  registerShifts: async (payload: RegisterShiftPayload) => {
    // const { data } = await api.post('/shifts/register', payload);
    // return data;
    console.log('Mock registerShifts with payload:', payload);
    return { success: true };
  },
  
  publishShift: async (shiftId: string) => {
    // const { data } = await api.put(`/shifts/${shiftId}/publish`);
    // return data;
    console.log('Mock publishShift with id:', shiftId);
    return { success: true };
  },
  
  getShiftTemplates: async () => {
    // const { data } = await api.get<ShiftTemplate[]>('/shift-templates');
    // return data;
    console.log('Mock getShiftTemplates');
    return [
      {
        id: '1',
        name: 'Morning Shift',
        startTime: '08:00',
        endTime: '12:00',
        allowedLateMinutes: 15,
        isActive: true,
      },
      {
        id: '2',
        name: 'Afternoon Shift',
        startTime: '13:00',
        endTime: '17:00',
        allowedLateMinutes: 15,
        isActive: true,
      }
    ] as ShiftTemplate[];
  },
  
  createShiftTemplate: async (payload: CreateShiftTemplatePayload) => {
    // const { data } = await api.post('/shift-templates', payload);
    // return data;
    console.log('Mock createShiftTemplate with payload:', payload);
    return { ...payload, id: Math.random().toString(36).substring(7) } as ShiftTemplate;
  },
  
  updateShiftTemplate: async (id: string, payload: Partial<CreateShiftTemplatePayload>) => {
    // const { data } = await api.put(`/shift-templates/${id}`, payload);
    // return data;
    console.log('Mock updateShiftTemplate with id:', id, 'payload:', payload);
    return { ...payload, id } as ShiftTemplate;
  }
};
