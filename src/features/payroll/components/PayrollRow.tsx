import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { PayrollCalculation } from '../types';
import { Button } from '@/components/ui/Button';

interface PayrollRowProps {
  payroll: PayrollCalculation;
  onGeneratePayslip: (userId: string) => void;
  isGenerating?: boolean;
}

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VNĐ';

export const PayrollRow: React.FC<PayrollRowProps> = ({ payroll, onGeneratePayslip, isGenerating }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="border-b border-brand-border hover:bg-brand-bg/50 transition-colors">
        <td className="p-4">
          <div className="font-medium text-brand-textMain">{payroll.userName}</div>
          <div className="text-xs text-brand-textMuted">{t('payroll.totalHours', '{{hours}} hrs', { hours: payroll.totalHours })}</div>
        </td>
        <td className="p-4 text-brand-textMain">{formatCurrency(payroll.baseSalary)}</td>
        <td className="p-4 text-status-success">{formatCurrency(payroll.allowances)}</td>
        <td className="p-4 text-status-danger">-{formatCurrency(payroll.punishments + payroll.advances)}</td>
        <td className="p-4 font-bold text-brand-primary">{formatCurrency(payroll.finalTotal)}</td>
        <td className="p-4 flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            aria-label={t('payroll.expand', 'Expand')}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGeneratePayslip(payroll.userId)}
            disabled={isGenerating}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('payroll.generate', 'Generate Payslip')}
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-brand-bg/30">
          <td colSpan={6} className="p-4">
            <div className="text-sm">
              <h4 className="font-semibold text-brand-textMain mb-2">{t('payroll.adjustments', 'Adjustments')}</h4>
              {payroll.adjustments && payroll.adjustments.length > 0 ? (
                <ul className="space-y-2">
                  {payroll.adjustments.map((adj, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-brand-border/50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-medium capitalize text-brand-textMain">{adj.type}</span>
                        <span className="text-brand-textMuted ml-2">({new Date(adj.date).toLocaleDateString()})</span>
                        {adj.description && <p className="text-xs text-brand-textMuted mt-0.5">{adj.description}</p>}
                      </div>
                      <span className={adj.type === 'allowance' ? 'text-status-success' : 'text-status-danger'}>
                        {adj.type === 'allowance' ? '+' : '-'}{formatCurrency(adj.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-brand-textMuted text-sm">{t('payroll.noAdjustments', 'No adjustments for this month.')}</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
