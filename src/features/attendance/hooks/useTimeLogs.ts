import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clockIn, clockOut, getTodayLogs, getKioskEmployees } from '../api/attendanceApi'
import type { ClockInPayload, ClockOutPayload } from '../types'
import type { TimeLog } from '@/types'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const attendanceKeys = {
  all: ['attendance'] as const,
  todayLogs: () => [...attendanceKeys.all, 'today'] as const,
  employees: () => [...attendanceKeys.all, 'employees'] as const,
} as const

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Fetches today's time logs.
 * Refetches every 30 seconds to keep the kiosk grid status fresh.
 */
export function useTodayTimeLogs() {
  return useQuery({
    queryKey: attendanceKeys.todayLogs(),
    queryFn: async () => {
      const res = await getTodayLogs()
      return res.data
    },
    refetchInterval: 30_000, // 30 s
    staleTime: 15_000,       // 15 s
  })
}

/**
 * Fetches active employee list for the kiosk grid.
 * Refreshes every 5 minutes (employees change infrequently).
 */
export function useKioskEmployees() {
  return useQuery({
    queryKey: attendanceKeys.employees(),
    queryFn: async () => {
      const res = await getKioskEmployees()
      return res.data
    },
    staleTime: 5 * 60_000,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Clock-in mutation.
 * Optimistically invalidates today's logs so the grid updates immediately.
 */
export function useClockIn() {
  const queryClient = useQueryClient()

  return useMutation<TimeLog, Error, ClockInPayload>({
    mutationFn: async (payload) => {
      const res = await clockIn(payload)
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.todayLogs() })
    },
  })
}

/**
 * Clock-out mutation.
 * Optimistically invalidates today's logs so the grid updates immediately.
 */
export function useClockOut() {
  const queryClient = useQueryClient()

  return useMutation<TimeLog, Error, ClockOutPayload>({
    mutationFn: async (payload) => {
      const res = await clockOut(payload)
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.todayLogs() })
    },
  })
}
