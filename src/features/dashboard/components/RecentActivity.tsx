import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Card } from '@/components/ui/Card'
import { TimeLog } from '@/types'

export interface RecentActivityProps {
  timeLogs: TimeLog[]
  isLoading?: boolean
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  timeLogs,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-brand-textMain mb-4">
            Recent Activity
          </h3>
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-border shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-brand-border rounded w-3/4"></div>
                  <div className="h-3 bg-brand-border rounded w-1/2"></div>
                </div>
              </div>
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
          Recent Activity
        </h3>
        <div className="flex flex-col gap-5">
          {timeLogs.length === 0 ? (
            <p className="text-sm text-brand-textMuted text-center py-4">
              No recent activity.
            </p>
          ) : (
            timeLogs.map((log) => {
              const userName = log.user?.name || 'Unknown User'
              const avatar = log.user?.avatarUrl
              
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-secondary flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold mt-1 overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMain">
                      <span className="font-semibold">{userName}</span>{' '}
                      {log.logType === 'IN' ? 'Clocked In' : 'Clocked Out'}
                    </p>
                    <p className="text-xs text-brand-textMuted mt-0.5">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Card>
  )
}
