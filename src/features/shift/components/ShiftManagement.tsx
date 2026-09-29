import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShiftTemplateCard } from './ShiftTemplateCard';
import { WeeklyScheduleGrid } from './WeeklyScheduleGrid';
import { useShifts, useShiftTemplates, usePublishShift } from '../hooks/useShifts';
import { ShiftTemplate } from '@/types';

export const ShiftManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'schedule' | 'templates'>('schedule');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  
  const { data: shifts = [], isLoading: isLoadingShifts } = useShifts({ weekStart: weekStartStr });
  const { data: templates = [], isLoading: isLoadingTemplates } = useShiftTemplates();
  const { mutate: publishShift } = usePublishShift();

  const handlePrevWeek = () => setCurrentDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));
  const handleCurrentWeek = () => setCurrentDate(new Date());

  const handlePublishShift = (shiftId: string) => {
    publishShift(shiftId);
  };

  const handleEditTemplate = (template: ShiftTemplate) => {
    console.log('Edit template', template);
    // TODO: Open edit modal
  };

  const handleToggleTemplateActive = (id: string, currentStatus: boolean) => {
    console.log('Toggle active', id, !currentStatus);
    // TODO: call update mutation
  };

  const handleAddTemplate = () => {
    console.log('Add template');
    // TODO: Open create modal
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-textMain">
            {t('shift.management', 'Shift Management')}
          </h1>
          <p className="text-brand-textMuted mt-1">
            {t('shift.managementDesc', 'Manage employee schedules and shift templates')}
          </p>
        </div>
        
        <div className="flex bg-brand-surface p-1 rounded-md border border-brand-border">
          <button
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              activeTab === 'schedule' 
                ? 'bg-brand-primary text-white shadow-sm' 
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
            onClick={() => setActiveTab('schedule')}
          >
            {t('shift.schedule', 'Schedule')}
          </button>
          <button
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              activeTab === 'templates' 
                ? 'bg-brand-primary text-white shadow-sm' 
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
            onClick={() => setActiveTab('templates')}
          >
            {t('shift.templates', 'Templates')}
          </button>
        </div>
      </div>

      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-md border border-brand-border shadow-sm">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleCurrentWeek}>
                {t('common.today', 'Today')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="font-medium text-brand-textMain">
              {format(weekStart, 'MMM d, yyyy')} - {format(addWeeks(weekStart, 1), 'MMM d, yyyy')}
            </div>
          </div>

          {(isLoadingShifts || isLoadingTemplates) ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-md border border-brand-border">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="bg-white rounded-md border border-brand-border shadow-sm">
              <WeeklyScheduleGrid
                weekStart={weekStartStr}
                shifts={shifts}
                templates={templates}
                isManager={true}
                onPublish={handlePublishShift}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddTemplate} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('shift.addTemplate', 'Add Template')}
            </Button>
          </div>

          {isLoadingTemplates ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <ShiftTemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEditTemplate}
                  onToggleActive={handleToggleTemplateActive}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('shift.noTemplates', 'No shift templates')}
              description={t('shift.noTemplatesDesc', 'Create your first shift template to start scheduling')}
              action={{
                label: t('shift.addTemplate', 'Add Template'),
                onClick: handleAddTemplate
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
