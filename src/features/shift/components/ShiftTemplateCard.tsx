import React from 'react';
import { ShiftTemplate } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit2, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShiftTemplateCardProps {
  template: ShiftTemplate;
  onEdit: (template: ShiftTemplate) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

export const ShiftTemplateCard: React.FC<ShiftTemplateCardProps> = ({
  template,
  onEdit,
  onToggleActive,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-brand-textMain">{template.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={template.isActive ? 'success' : 'default'}>
              {template.isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleActive(template.id, template.isActive)}
          >
            {template.isActive ? t('action.deactivate', 'Deactivate') : t('action.activate', 'Activate')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(template)}
          >
            <Edit2 className="w-4 h-4 text-brand-textMuted" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-brand-textMuted">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{template.startTime} - {template.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            {t('shift.allowedLate', 'Allowed late')}: {template.allowedLateMinutes} {t('common.minutes', 'mins')}
          </span>
        </div>
      </div>
    </Card>
  );
};
