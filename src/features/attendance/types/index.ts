import type { TimeLog, User } from '@/types'

// ─── Clock-in / Clock-out payloads ───────────────────────────────────────────

export interface ClockInPayload {
  userId: string
  photo?: string // base64 data URL
}

export interface ClockOutPayload {
  userId: string
  photo?: string // base64 data URL
}

// ─── Query parameters ────────────────────────────────────────────────────────

export interface TimeLogQueryParams {
  dateFrom?: string // ISO date string YYYY-MM-DD
  dateTo?: string   // ISO date string YYYY-MM-DD
  userId?: string
}

// ─── Re-export shared types for convenience ──────────────────────────────────

export type { TimeLog }

// ─── Employee clock status (derived at runtime) ──────────────────────────────

export type ClockStatus = 'in' | 'out' | 'unknown'

export interface EmployeeWithStatus extends Pick<User, 'id' | 'name' | 'avatarUrl' | 'roleId'> {
  clockStatus: ClockStatus
  lastLogTime?: string // ISO timestamp
}

// ─── Kiosk action result ─────────────────────────────────────────────────────

export interface ClockActionResult {
  success: boolean
  employee: EmployeeWithStatus
  logType: 'IN' | 'OUT'
  timestamp: string
}
