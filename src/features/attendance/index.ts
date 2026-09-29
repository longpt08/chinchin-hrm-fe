// ─── Public API barrel export for the attendance feature ─────────────────────

// Types
export type {
  ClockInPayload,
  ClockOutPayload,
  TimeLogQueryParams,
  ClockStatus,
  EmployeeWithStatus,
  ClockActionResult,
} from './types'

// API
export {
  clockIn,
  clockOut,
  getTimeLogs,
  getTodayLogs,
  getKioskEmployees,
} from './api/attendanceApi'

// Hooks
export {
  attendanceKeys,
  useTodayTimeLogs,
  useKioskEmployees,
  useClockIn,
  useClockOut,
} from './hooks/useTimeLogs'

// Components
export { DigitalClock } from './components/DigitalClock'
export { WebcamCapture } from './components/WebcamCapture'
export { KioskView } from './components/KioskView'
