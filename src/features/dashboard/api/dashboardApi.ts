// import axios from 'axios'
import { DashboardStats, EmployeeWorkStatus } from '../types'

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Mock API call until backend is ready
  return {
    totalEmployees: 42,
    activeToday: 38,
    currentlyWorking: 25,
    pendingShiftApprovals: 5,
  }
}

export const getTodayWorkStatus = async (): Promise<EmployeeWorkStatus[]> => {
  // Mock API call until backend is ready
  return [
    {
      userId: '1',
      userName: 'Alice Smith',
      lastClockIn: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      isWorking: true,
      hoursToday: 5.5,
    },
    {
      userId: '2',
      userName: 'Bob Jones',
      lastClockIn: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
      lastClockOut: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
      isWorking: false,
      hoursToday: 4,
    },
    {
      userId: '3',
      userName: 'Charlie Brown',
      isWorking: false,
      hoursToday: 0,
    }
  ]
}
