import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfWeek, addDays, getDay, isAfter, isBefore, addWeeks } from 'date-fns';
import { AlertCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useShifts, useShiftTemplates, useRegisterShifts } from '../hooks/useShifts';
import { clsx } from 'clsx';

export const EmployeeSchedule: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock auth user
  const currentUser = { id: 'user-1', name: 'John Doe' };
  
  const currentDate = new Date();
  const currentDayOfWeek = getDay(currentDate); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday, 5 = Friday
  const isSubmissionWindow = currentDayOfWeek === 4 || currentDayOfWeek === 5; // Thu or Fri
  
  // Registering for next week
  const nextWeekStart = startOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 });
  const nextWeekStartStr = format(nextWeekStart, 'yyyy-MM-dd');
  const nextWeekDays = Array.from({ length: 7 }).map((_, i) => addDays(nextWeekStart, i));

  const { data: templates = [], isLoading: isLoadingTemplates } = useShiftTemplates();
  const { mutate: registerShifts, isPending: isRegistering } = useRegisterShifts();
  
  // State for shift selections: Record<dateString, templateId>
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleToggleSelection = (dateStr: string, templateId: string) => {
    setSelections((prev) => {
      const currentSelection = prev[dateStr];
      const newSelections = { ...prev };
      
      if (currentSelection === templateId) {
        // Deselect if clicking the same one
        delete newSelections[dateStr];
      } else {
        // Select new one (replacing old if exists)
        newSelections[dateStr] = templateId;
      }
      return newSelections;
    });
  };

  const handleSubmit = () => {
    const shiftsToRegister = Object.entries(selections).map(([date, templateId]) => {
      const template = templates.find((t) => t.id === templateId);
      return {
        date,
        templateId,
        startTime: template?.startTime || '',
        endTime: template?.endTime || '',
      };
    });

    if (shiftsToRegister.length === 0) return;

    registerShifts({
      userId: currentUser.id,
      shifts: shiftsToRegister,
    }, {
      onSuccess: () => {
        // Show success message or clear selections
        setSelections({});
        alert(t('shift.registerSuccess', 'Shifts registered successfully'));
      }
    });
  };

  if (isLoadingTemplates) {
    return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-textMain">
          {t('shift.mySchedule', 'My Schedule')}
        </h1>
        <p className="text-brand-textMuted mt-1">
          {t('shift.myScheduleDesc', 'View your schedule and register for upcoming shifts')}
        </p>
      </div>

      {!isSubmissionWindow && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">{t('shift.outsideWindow', 'Outside Registration Window')}</h3>
            <p className="text-sm mt-1">
              {t('shift.windowDesc', 'Shift registration is only available on Thursdays and Fridays for the upcoming week.')}
            </p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-semibold text-brand-textMain">
              {t('shift.registerFor', 'Register for')}: {format(nextWeekStart, 'MMM d')} - {format(addDays(nextWeekStart, 6), 'MMM d, yyyy')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {nextWeekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            
            return (
              <div 
                key={dateStr}
                className={clsx(
                  "border rounded-md overflow-hidden flex flex-col",
                  isWeekend ? "bg-brand-bg/50 border-brand-border/80" : "bg-white border-brand-border"
                )}
              >
                <div className="p-2 text-center border-b border-brand-border bg-brand-surface">
                  <div className="font-semibold text-brand-textMain">{format(day, 'EEE')}</div>
                  <div className="text-xs text-brand-textMuted">{format(day, 'MMM d')}</div>
                </div>
                <div className="p-2 flex-1 flex flex-col gap-2">
                  {templates.map((template) => {
                    const isSelected = selections[dateStr] === template.id;
                    return (
                      <button
                        key={template.id}
                        disabled={!isSubmissionWindow || !template.isActive}
                        onClick={() => handleToggleSelection(dateStr, template.id)}
                        className={clsx(
                          "text-left p-2 rounded text-xs transition-all border",
                          isSelected 
                            ? "bg-brand-primary/10 border-brand-primary text-brand-primary font-medium" 
                            : "bg-brand-bg/30 border-transparent hover:border-brand-border text-brand-textMain",
                          (!isSubmissionWindow || !template.isActive) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="font-medium">{template.name}</div>
                        <div className="text-[10px] mt-1 text-brand-textMuted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.startTime} - {template.endTime}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end border-t border-brand-border pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={!isSubmissionWindow || Object.keys(selections).length === 0 || isRegistering}
          >
            {isRegistering ? t('common.saving', 'Saving...') : t('shift.submitRegistration', 'Submit Registration')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
