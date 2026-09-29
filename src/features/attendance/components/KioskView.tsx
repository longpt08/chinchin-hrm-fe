import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { CheckCircle2, LogIn, LogOut, Settings, Wifi, WifiOff } from 'lucide-react'

import { DigitalClock } from './DigitalClock'
import { WebcamCapture } from './WebcamCapture'
import { LoadingSpinner } from '@/components/ui'
import { useTodayTimeLogs, useKioskEmployees, useClockIn, useClockOut } from '../hooks/useTimeLogs'
import type { EmployeeWithStatus, ClockActionResult } from '../types'
import type { TimeLog } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get initials (up to 2 chars) from a full name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(-2)
    .join('')
}

/** Pastel background colours for avatar fallbacks (deterministic by id) */
const AVATAR_COLOURS = [
  'bg-amber-200 text-amber-800',
  'bg-rose-200 text-rose-800',
  'bg-sky-200 text-sky-800',
  'bg-emerald-200 text-emerald-800',
  'bg-violet-200 text-violet-800',
  'bg-orange-200 text-orange-800',
  'bg-teal-200 text-teal-800',
  'bg-fuchsia-200 text-fuchsia-800',
]

function avatarColour(id: string): string {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLOURS[code % AVATAR_COLOURS.length]
}

/**
 * Derive each employee's current clock status from today's logs.
 * The last log entry determines their status (IN or OUT).
 */
function deriveEmployeeStatuses(
  employees: Pick<import('@/types').User, 'id' | 'name' | 'avatarUrl' | 'roleId' | 'isActive'>[],
  logs: TimeLog[],
): EmployeeWithStatus[] {
  return employees.map((emp) => {
    const empLogs = logs
      .filter((l) => l.userId === emp.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const lastLog = empLogs.at(-1)

    return {
      id: emp.id,
      name: emp.name,
      avatarUrl: emp.avatarUrl,
      roleId: emp.roleId,
      clockStatus: lastLog ? (lastLog.logType === 'IN' ? 'in' : 'out') : 'unknown',
      lastLogTime: lastLog?.timestamp,
    }
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface EmployeeCardProps {
  employee: EmployeeWithStatus
  onTap: (employee: EmployeeWithStatus) => void
}

function EmployeeCard({ employee, onTap }: EmployeeCardProps) {
  const { t } = useTranslation()
  const isClockedIn = employee.clockStatus === 'in'

  return (
    <button
      onClick={() => onTap(employee)}
      className={clsx(
        'relative flex flex-col items-center gap-2 p-4 rounded-md transition-all duration-200',
        'glass shadow-soft hover:shadow-medium hover:scale-[1.03] active:scale-[0.97]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
        isClockedIn && 'ring-2 ring-status-success ring-offset-2',
      )}
      aria-label={`${employee.name} – ${isClockedIn ? t('kiosk.clockedIn') : t('kiosk.clockOut')}`}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden',
            !employee.avatarUrl && avatarColour(employee.id),
          )}
        >
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(employee.name)
          )}
        </div>

        {/* Status indicator dot */}
        {employee.clockStatus !== 'unknown' && (
          <span
            className={clsx(
              'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white',
              isClockedIn ? 'bg-status-success' : 'bg-brand-border',
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Name */}
      <span className="text-xs font-semibold text-brand-textMain text-center leading-tight line-clamp-2 max-w-[80px]">
        {employee.name}
      </span>

      {/* Clock status badge */}
      {isClockedIn && (
        <span className="flex items-center gap-0.5 text-[10px] font-medium text-status-success">
          <CheckCircle2 className="w-3 h-3" />
          {t('kiosk.clockedIn')}
        </span>
      )}
    </button>
  )
}

// ─── Success toast ────────────────────────────────────────────────────────────

interface SuccessToastProps {
  result: ClockActionResult
  onDismiss: () => void
}

function SuccessToast({ result, onDismiss }: SuccessToastProps) {
  const { t } = useTranslation()
  const isIn = result.logType === 'IN'

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center p-6',
        'animate-in fade-in duration-300',
      )}
      onClick={onDismiss}
    >
      <div className="absolute inset-0 bg-brand-textMain/40 backdrop-blur-sm" />
      <div className="relative glass rounded-lg shadow-medium p-8 max-w-sm w-full text-center animate-in zoom-in-90 duration-300">
        <div
          className={clsx(
            'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center',
            isIn ? 'bg-status-successBg' : 'bg-brand-border',
          )}
        >
          {isIn ? (
            <LogIn className="w-10 h-10 text-status-success" />
          ) : (
            <LogOut className="w-10 h-10 text-brand-textMuted" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-brand-primary mb-1">
          {isIn ? t('kiosk.welcomeBack') : t('kiosk.clockedOut')}
        </h2>
        <p className="text-brand-textMuted text-sm mb-1">{result.employee.name}</p>
        <p className="text-brand-textMuted text-xs">
          {new Date(result.timestamp).toLocaleTimeString()}
        </p>

        <p className="mt-6 text-xs text-brand-textMuted opacity-60">
          {t('kiosk.tapToDismiss', 'Tap anywhere to dismiss')}
        </p>
      </div>
    </div>
  )
}

// ─── Main view ────────────────────────────────────────────────────────────────

type KioskStep =
  | { type: 'idle' }
  | { type: 'webcam'; employee: EmployeeWithStatus }
  | { type: 'submitting' }
  | { type: 'success'; result: ClockActionResult }

/**
 * KioskView
 *
 * The public-facing kiosk screen. Shows a live clock, an employee grid, and
 * handles the full clock-in/clock-out flow with webcam photo capture.
 */
export function KioskView() {
  const { t } = useTranslation()

  const { data: employees = [], isLoading: loadingEmployees } = useKioskEmployees()
  const { data: todayLogs = [], isLoading: loadingLogs } = useTodayTimeLogs()

  const clockInMutation = useClockIn()
  const clockOutMutation = useClockOut()

  const [step, setStep] = useState<KioskStep>({ type: 'idle' })

  const employeesWithStatus = useMemo(
    () => deriveEmployeeStatuses(employees, todayLogs),
    [employees, todayLogs],
  )

  const clockedInCount = employeesWithStatus.filter((e) => e.clockStatus === 'in').length

  const isLoading = loadingEmployees || loadingLogs

  // ── Tap handler ────────────────────────────────────────────────────────────

  const handleEmployeeTap = useCallback((employee: EmployeeWithStatus) => {
    setStep({ type: 'webcam', employee })
  }, [])

  // ── Photo captured → call API ──────────────────────────────────────────────

  const handlePhotoCapture = useCallback(
    async (photoBase64: string, employee: EmployeeWithStatus) => {
      setStep({ type: 'submitting' })

      const payload = { userId: employee.id, photo: photoBase64 || undefined }
      const isCurrentlyIn = employee.clockStatus === 'in'

      try {
        if (isCurrentlyIn) {
          await clockOutMutation.mutateAsync(payload)
        } else {
          await clockInMutation.mutateAsync(payload)
        }

        const result: ClockActionResult = {
          success: true,
          employee,
          logType: isCurrentlyIn ? 'OUT' : 'IN',
          timestamp: new Date().toISOString(),
        }
        setStep({ type: 'success', result })

        // Auto-dismiss after 3.5 s
        setTimeout(() => setStep({ type: 'idle' }), 3_500)
      } catch {
        setStep({ type: 'idle' })
      }
    },
    [clockInMutation, clockOutMutation],
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex flex-col items-center pt-10 pb-6 px-6 gap-4">
        {/* Logo / title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight">
            {t('kiosk.title')}
          </h1>
        </div>

        {/* Digital clock */}
        <DigitalClock />

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-brand-textMuted">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>
              <strong className="text-brand-textMain">{clockedInCount}</strong>
              {' / '}
              {employees.length} {t('kiosk.present', 'present')}
            </span>
          </div>
          <div
            className={clsx(
              'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
              isLoading
                ? 'bg-amber-50 text-amber-600'
                : 'bg-status-successBg text-status-success',
            )}
          >
            {isLoading ? (
              <WifiOff className="w-3 h-3" />
            ) : (
              <Wifi className="w-3 h-3" />
            )}
            {isLoading ? t('common.loading') : t('kiosk.live', 'Live')}
          </div>
        </div>
      </header>

      {/* ── Instruction ────────────────────────────────────── */}
      <p className="text-center text-brand-textMuted text-sm px-6 mb-6">
        {t('kiosk.tapToClockIn')}
      </p>

      {/* ── Employee grid ──────────────────────────────────── */}
      <main className="flex-1 px-4 sm:px-8 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {employeesWithStatus.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onTap={handleEmployeeTap}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="fixed bottom-4 right-4 z-10">
        <Link
          to="/login/manager"
          className="flex items-center gap-2 text-xs text-brand-textMuted hover:text-brand-primary transition-colors glass rounded-full px-3 py-1.5 shadow-soft"
        >
          <Settings className="w-3 h-3" />
          {t('auth.managerLogin')}
        </Link>
      </footer>

      {/* ── Submitting overlay ─────────────────────────────── */}
      {step.type === 'submitting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-textMain/30 backdrop-blur-sm">
          <div className="glass rounded-md p-8 flex flex-col items-center gap-4 shadow-medium">
            <LoadingSpinner size="lg" />
            <p className="text-brand-textMuted text-sm">{t('common.loading')}</p>
          </div>
        </div>
      )}

      {/* ── Webcam modal ───────────────────────────────────── */}
      {step.type === 'webcam' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-textMain/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setStep({ type: 'idle' })
          }}
        >
          <div className="glass rounded-md shadow-medium w-full max-w-sm animate-in zoom-in-90 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-base font-semibold text-brand-textMain">
                  {step.employee.clockStatus === 'in'
                    ? t('kiosk.clockOut')
                    : t('kiosk.clockIn')}
                </h2>
                <p className="text-xs text-brand-textMuted">{step.employee.name}</p>
              </div>
              <button
                onClick={() => setStep({ type: 'idle' })}
                className="text-brand-textMuted hover:text-brand-primary transition-colors p-1"
                aria-label={t('common.cancel')}
              >
                ✕
              </button>
            </div>

            {/* Webcam */}
            <WebcamCapture
              employeeName={step.employee.name}
              onCapture={(photo) => void handlePhotoCapture(photo, step.employee)}
              onCancel={() => setStep({ type: 'idle' })}
            />
          </div>
        </div>
      )}

      {/* ── Success toast ──────────────────────────────────── */}
      {step.type === 'success' && (
        <SuccessToast
          result={step.result}
          onDismiss={() => setStep({ type: 'idle' })}
        />
      )}
    </div>
  )
}
