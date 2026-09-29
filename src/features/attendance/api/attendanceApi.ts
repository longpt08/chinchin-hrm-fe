import { format } from 'date-fns'
import axiosInstance from '@/lib/axios'
import type { ApiResponse, TimeLog, User } from '@/types'
import type { ClockInPayload, ClockOutPayload, TimeLogQueryParams } from '../types'

// ─── Mock data (used while backend is unavailable) ───────────────────────────

const MOCK_EMPLOYEES: Pick<User, 'id' | 'name' | 'avatarUrl' | 'roleId' | 'isActive'>[] = [
  { id: 'u1', name: 'Nguyễn Thị Lan', roleId: 'barista', avatarUrl: undefined, isActive: true },
  { id: 'u2', name: 'Trần Văn Minh', roleId: 'barista', avatarUrl: undefined, isActive: true },
  { id: 'u3', name: 'Lê Thị Hoa', roleId: 'cashier', avatarUrl: undefined, isActive: true },
  { id: 'u4', name: 'Phạm Quốc Anh', roleId: 'barista', avatarUrl: undefined, isActive: true },
  { id: 'u5', name: 'Hoàng Thị Mai', roleId: 'server', avatarUrl: undefined, isActive: true },
  { id: 'u6', name: 'Đỗ Văn Hùng', roleId: 'server', avatarUrl: undefined, isActive: true },
  { id: 'u7', name: 'Vũ Thị Thu', roleId: 'cashier', avatarUrl: undefined, isActive: true },
  { id: 'u8', name: 'Bùi Văn Nam', roleId: 'barista', avatarUrl: undefined, isActive: true },
]

let mockTimeLogs: TimeLog[] = []
let mockLogIdCounter = 1

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * POST /api/time-logs/clock-in
 * Records an employee clock-in event with optional photo evidence.
 */
export async function clockIn(payload: ClockInPayload): Promise<ApiResponse<TimeLog>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<TimeLog>>(
      '/api/time-logs/clock-in',
      payload,
    )
    return data
  } catch {
    // Mock fallback while backend is unavailable
    const log: TimeLog = {
      id: `log-${mockLogIdCounter++}`,
      userId: payload.userId,
      logType: 'IN',
      timestamp: new Date().toISOString(),
      photoUrl: payload.photo,
    }
    mockTimeLogs.push(log)
    return { success: true, data: log }
  }
}

/**
 * POST /api/time-logs/clock-out
 * Records an employee clock-out event with optional photo evidence.
 */
export async function clockOut(payload: ClockOutPayload): Promise<ApiResponse<TimeLog>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<TimeLog>>(
      '/api/time-logs/clock-out',
      payload,
    )
    return data
  } catch {
    // Mock fallback
    const log: TimeLog = {
      id: `log-${mockLogIdCounter++}`,
      userId: payload.userId,
      logType: 'OUT',
      timestamp: new Date().toISOString(),
      photoUrl: payload.photo,
    }
    mockTimeLogs.push(log)
    return { success: true, data: log }
  }
}

/**
 * GET /api/time-logs
 * Fetches time logs with optional date range and user filters.
 */
export async function getTimeLogs(
  params?: TimeLogQueryParams,
): Promise<ApiResponse<TimeLog[]>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<TimeLog[]>>('/api/time-logs', {
      params,
    })
    return data
  } catch {
    // Mock fallback: filter in-memory logs
    let logs = [...mockTimeLogs]
    if (params?.userId) {
      logs = logs.filter((l) => l.userId === params.userId)
    }
    if (params?.dateFrom) {
      logs = logs.filter((l) => l.timestamp >= params.dateFrom!)
    }
    if (params?.dateTo) {
      logs = logs.filter((l) => l.timestamp <= params.dateTo! + 'T23:59:59')
    }
    return { success: true, data: logs }
  }
}

/**
 * GET /api/time-logs  (today only)
 * Convenience wrapper that fetches logs for today's date only.
 */
export async function getTodayLogs(): Promise<ApiResponse<TimeLog[]>> {
  const today = format(new Date(), 'yyyy-MM-dd')
  return getTimeLogs({ dateFrom: today, dateTo: today })
}

/**
 * GET /api/users
 * Returns the list of active employees for the kiosk grid.
 * Mock data returned while backend is unavailable.
 */
export async function getKioskEmployees(): Promise<
  ApiResponse<Pick<User, 'id' | 'name' | 'avatarUrl' | 'roleId' | 'isActive'>[]>
> {
  try {
    const { data } = await axiosInstance.get<
      ApiResponse<Pick<User, 'id' | 'name' | 'avatarUrl' | 'roleId' | 'isActive'>[]>
    >('/api/users', { params: { isActive: true } })
    return data
  } catch {
    return { success: true, data: MOCK_EMPLOYEES }
  }
}
