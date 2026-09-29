import React from 'react'
import { format } from 'date-fns'
import { 
  Users, 
  UserCheck, 
  Clock, 
  FileSignature 
} from 'lucide-react'
import { useDashboardStats, useTodayWorkStatus } from '../hooks/useDashboard'
import { StatCard } from './StatCard'
import { AttendanceTable } from './AttendanceTable'
import { RecentActivity } from './RecentActivity'
import { TimeLog } from '@/types'

export const ManagerDashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: todayStatus, isLoading: statusLoading } = useTodayWorkStatus()
  
  const today = new Date()

  const mockTimeLogs: TimeLog[] = [
    {
      id: 'log1',
      userId: '1',
      logType: 'IN',
      timestamp: new Date(today.getTime() - 1000 * 60 * 5).toISOString(),
      user: { id: '1', name: 'Alice Smith' }
    },
    {
      id: 'log2',
      userId: '2',
      logType: 'OUT',
      timestamp: new Date(today.getTime() - 1000 * 60 * 30).toISOString(),
      user: { id: '2', name: 'Bob Jones' }
    },
    {
      id: 'log3',
      userId: '4',
      logType: 'IN',
      timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      user: { id: '4', name: 'Emma Wilson' }
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-textMain">Dashboard</h1>
        <p className="text-sm text-brand-textMuted mt-1">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={statsLoading ? '-' : stats?.totalEmployees ?? 0}
          icon={<Users size={24} />}
          color="primary"
        />
        <StatCard
          title="Currently Working"
          value={statsLoading ? '-' : stats?.currentlyWorking ?? 0}
          icon={<Clock size={24} />}
          color="success"
        />
        <StatCard
          title="Active Today"
          value={statsLoading ? '-' : stats?.activeToday ?? 0}
          icon={<UserCheck size={24} />}
          color="warning"
        />
        <StatCard
          title="Pending Approvals"
          value={statsLoading ? '-' : stats?.pendingShiftApprovals ?? 0}
          icon={<FileSignature size={24} />}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceTable
            employees={todayStatus}
            isLoading={statusLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity 
            timeLogs={mockTimeLogs} 
          />
        </div>
      </div>
    </div>
  )
}
