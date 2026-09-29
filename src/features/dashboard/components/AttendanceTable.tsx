import React from 'react'
import { format, parseISO } from 'date-fns'
import { EmployeeWorkStatus } from '../types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export interface AttendanceTableProps {
  employees?: EmployeeWorkStatus[]
  isLoading: boolean
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  employees = [],
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-brand-textMain mb-4">
            Today's Attendance
          </h3>
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-brand-border rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-brand-textMain mb-4">
          Today's Attendance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-brand-border text-sm text-brand-textMuted">
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Clock In</th>
                <th className="py-3 font-medium">Clock Out</th>
                <th className="py-3 font-medium text-right">Hours</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-brand-textMuted text-sm"
                  >
                    No attendance records for today.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.userId}
                    className="border-b border-brand-border last:border-0 text-sm"
                  >
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-white font-semibold overflow-hidden shrink-0">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          emp.userName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-medium text-brand-textMain">
                        {emp.userName}
                      </span>
                    </td>
                    <td className="py-3">
                      {emp.isWorking ? (
                        <Badge variant="success">Working</Badge>
                      ) : emp.lastClockOut ? (
                        <Badge variant="default">Left</Badge>
                      ) : (
                        <Badge variant="default">Not Started</Badge>
                      )}
                    </td>
                    <td className="py-3 text-brand-textMuted">
                      {emp.lastClockIn
                        ? format(parseISO(emp.lastClockIn), 'HH:mm')
                        : '-'}
                    </td>
                    <td className="py-3 text-brand-textMuted">
                      {emp.lastClockOut
                        ? format(parseISO(emp.lastClockOut), 'HH:mm')
                        : '-'}
                    </td>
                    <td className="py-3 text-right font-medium text-brand-textMain">
                      {emp.hoursToday.toFixed(1)}h
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
