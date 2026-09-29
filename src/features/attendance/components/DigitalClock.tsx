import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

/**
 * DigitalClock
 *
 * Displays a large, live clock (HH:MM:SS) and a locale-aware date string.
 * The time updates every second via a `setInterval`.
 */
export function DigitalClock() {
  const { i18n } = useTranslation()
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(id)
  }, [])

  const locale = i18n.language === 'vi' ? vi : enUS

  // e.g. "Thứ Hai, 29 Tháng 9, 2026"  /  "Monday, September 29, 2026"
  const dateString = format(now, 'EEEE, dd MMMM, yyyy', { locale })

  // HH:MM:SS
  const timeString = format(now, 'HH:mm:ss')
  // Separate seconds for a slightly different colour
  const [hhmm, ss] = [timeString.slice(0, 5), timeString.slice(6)]

  return (
    <div className="flex flex-col items-center select-none">
      {/* Time */}
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-7xl sm:text-8xl font-extrabold tracking-tight text-brand-primary drop-shadow-sm">
          {hhmm}
        </span>
        <span className="text-4xl sm:text-5xl font-bold text-brand-secondary opacity-80 mb-1">
          :{ss}
        </span>
      </div>

      {/* Date */}
      <p className="mt-2 text-base sm:text-lg font-medium text-brand-textMuted capitalize tracking-wide">
        {dateString}
      </p>
    </div>
  )
}
