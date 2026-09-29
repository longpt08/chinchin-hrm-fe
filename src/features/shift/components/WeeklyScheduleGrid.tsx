import React from 'react';
import { Shift, ShiftTemplate } from '@/types';
import { addDays, format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

interface WeeklyScheduleGridProps {
  weekStart: string;
  shifts: Shift[];
  templates: ShiftTemplate[];
  isManager: boolean;
  onPublish: (shiftId: string) => void;
}

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  weekStart,
  shifts,
  templates,
  isManager,
  onPublish,
}) => {
  const { t } = useTranslation();
  
  const startDate = parseISO(weekStart);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // Helper to get shifts for a specific date and template
  const getShiftsForCell = (date: Date, templateId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.filter(
      (s) => s.date === dateStr && s.templateId === templateId
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="border border-brand-border bg-brand-surface p-3 text-left w-48">
              {t('shift.shiftType', 'Shift Type')}
            </th>
            {weekDays.map((day) => (
              <th 
                key={day.toISOString()} 
                className="border border-brand-border bg-brand-surface p-3 text-center min-w-[120px]"
              >
                <div className="font-semibold text-brand-textMain">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm text-brand-textMuted">
                  {format(day, 'MMM d')}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td className="border border-brand-border p-3 align-top bg-brand-bg/30">
                <div className="font-medium text-brand-textMain">{template.name}</div>
                <div className="text-xs text-brand-textMuted mt-1">
                  {template.startTime} - {template.endTime}
                </div>
              </td>
              {weekDays.map((day) => {
                const cellShifts = getShiftsForCell(day, template.id);
                return (
                  <td 
                    key={day.toISOString()} 
                    className="border border-brand-border p-2 align-top"
                  >
                    <div className="flex flex-col gap-2">
                      {cellShifts.map((shift) => (
                        <div 
                          key={shift.id}
                          className={clsx(
                            'p-2 rounded-md text-sm border flex flex-col gap-1',
                            shift.status === 'published' 
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          )}
                        >
                          <div className="font-medium truncate" title={shift.user?.name}>
                            {shift.user?.name || t('common.unknownUser', 'Unknown User')}
                          </div>
                          
                          {isManager && shift.status === 'registered' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="mt-1 h-6 text-xs bg-white"
                              onClick={() => onPublish(shift.id)}
                            >
                              {t('action.publish', 'Publish')}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          {templates.length === 0 && (
            <tr>
              <td colSpan={8} className="border border-brand-border p-8 text-center text-brand-textMuted">
                {t('shift.noTemplates', 'No shift templates available.')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
