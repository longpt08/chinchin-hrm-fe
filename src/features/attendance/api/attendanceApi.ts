import axios from 'axios';
import { ClockInPayload, ClockOutPayload, TimeLog, Employee } from '../types';

// Using a configured axios instance normally, but we use global axios for now
// Assuming base URL setup elsewhere, or we use relative paths
const api = axios.create({
  baseURL: '/api'
});

export const attendanceApi = {
  clockIn: async (payload: ClockInPayload): Promise<TimeLog> => {
    // Mock response for now
    const response = await api.post('/time-logs/clock-in', payload).catch(() => ({
      data: {
        id: Math.random().toString(),
        userId: payload.userId,
        clockInTime: new Date().toISOString(),
        clockInPhoto: payload.photo,
        status: 'PRESENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    return response.data;
  },

  clockOut: async (payload: ClockOutPayload): Promise<TimeLog> => {
    const response = await api.post('/time-logs/clock-out', payload).catch(() => ({
      data: {
        id: Math.random().toString(),
        userId: payload.userId,
        clockInTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        clockOutTime: new Date().toISOString(),
        clockOutPhoto: payload.photo,
        status: 'PRESENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    return response.data;
  },

  getTimeLogs: async (params?: { dateFrom?: string; dateTo?: string; userId?: string }): Promise<TimeLog[]> => {
    const response = await api.get('/time-logs', { params }).catch(() => ({
      data: []
    }));
    return response.data;
  },

  getTodayLogs: async (): Promise<TimeLog[]> => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const response = await api.get('/time-logs', { 
      params: { dateFrom: dateString, dateTo: dateString } 
    }).catch(() => ({
      data: [] // mock empty for today
    }));
    return response.data;
  },
  
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/users').catch(() => ({
      data: [
        { id: '1', fullName: 'Nguyen Van A', email: 'a.nguyen@example.com' },
        { id: '2', fullName: 'Tran Thi B', email: 'b.tran@example.com' },
        { id: '3', fullName: 'Le Van C', email: 'c.le@example.com' },
        { id: '4', fullName: 'Pham Thi D', email: 'd.pham@example.com' },
      ]
    }));
    return response.data;
  }
};
