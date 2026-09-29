import React from 'react'
import { format } from 'date-fns'
import { 
  ArrowRight, 
  Calendar, 
  FileText, 
  BookOpen, 
  Clock 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useTodayWorkStatus } from '../hooks/useDashboard'

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuthStore()
  const { data: todayStatus, isLoading } = useTodayWorkStatus()
  
  // Find current user's status from the mock array, or mock a default
  const myStatus = todayStatus?.find(s => s.userId === user?.id) || {
    isWorking: true,
    lastClockIn: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    hoursToday: 4.5
  }

  // Mock data for upcoming shifts
  const upcomingShifts = [
    { id: '1', date: new Date(), startTime: '09:00', endTime: '18:00', role: 'Barista' },
    { id: '2', date: new Date(Date.now() + 86400000), startTime: '09:00', endTime: '18:00', role: 'Barista' },
    { id: '3', date: new Date(Date.now() + 86400000 * 2), startTime: '13:00', endTime: '21:00', role: 'Barista' },
  ]

  const quickLinks = [
    {
      title: 'My Schedule',
      icon: <Calendar className="text-brand-primary" size={24} />,
      to: '/employee/schedule',
      color: 'bg-brand-secondary/20'
    },
    {
      title: 'My Payslips',
      icon: <FileText className="text-brand-primary" size={24} />,
      to: '/employee/payroll',
      color: 'bg-brand-secondary/20'
    },
    {
      title: 'Handbook',
      icon: <BookOpen className="text-brand-primary" size={24} />,
      to: '/employee/handbook',
      color: 'bg-brand-secondary/20'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-textMain">
          Welcome back, {user?.name || 'Employee'}!
        </h1>
        <p className="text-sm text-brand-textMuted mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Status */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-brand-textMain">Today's Status</h3>
                {myStatus.isWorking ? (
                  <Badge variant="success">Currently Working</Badge>
                ) : (
                  <Badge variant="default">Not Working</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-brand-bg rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Clocked In</p>
                    <p className="text-lg font-semibold text-brand-textMain">
                      {myStatus.lastClockIn ? format(new Date(myStatus.lastClockIn), 'HH:mm') : '--:--'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-brand-bg rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-status-successBg text-status-success flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Hours Today</p>
                    <p className="text-lg font-semibold text-brand-textMain">
                      {myStatus.hoursToday.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          {quickLinks.map((link, idx) => (
            <Link key={idx} to={link.to} className="block group">
              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color}`}>
                    {link.icon}
                  </div>
                  <span className="font-medium text-brand-textMain">{link.title}</span>
                </div>
                <ArrowRight className="text-brand-textMuted group-hover:text-brand-primary transition-colors" size={20} />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Shifts */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-textMain">This Week's Shifts</h3>
            <Link to="/employee/schedule" className="text-sm text-brand-primary font-medium hover:underline">
              View full schedule
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 rounded-lg border border-brand-border hover:bg-brand-bg/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-secondary/20 text-brand-primary font-semibold px-3 py-2 rounded text-center min-w-[60px]">
                    <div className="text-xs uppercase">{format(shift.date, 'MMM')}</div>
                    <div className="text-lg">{format(shift.date, 'dd')}</div>
                  </div>
                  <div>
                    <p className="font-medium text-brand-textMain">{format(shift.date, 'EEEE')}</p>
                    <p className="text-sm text-brand-textMuted">{shift.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-brand-textMain">
                    {shift.startTime} - {shift.endTime}
                  </p>
                  <p className="text-sm text-brand-textMuted">
                    {9} hours
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
