import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { usePayrollData, useGeneratePayslip, useAddAdjustment } from '../hooks/usePayroll';
import { MonthYearPicker } from './MonthYearPicker';
import { PayrollRow } from './PayrollRow';
import { AdjustmentForm } from './AdjustmentForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { User } from '@/types';

export const PayrollPage: React.FC = () => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: payrollData, isLoading, error } = usePayrollData(month, year);
  const { mutate: generatePayslip, isPending: isGenerating } = useGeneratePayslip();
  const { mutate: addAdjustment, isPending: isAdding } = useAddAdjustment();

  const users: User[] = []; // Placeholder until users hook is available

  const handleGeneratePayslip = (userId: string) => {
    generatePayslip({ userId, month, year });
  };

  const handleAddAdjustment = (data: any) => {
    addAdjustment(data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-brand-textMain">{t('payroll.title', 'Payroll Management')}</h1>
        <div className="flex items-center gap-4">
          <MonthYearPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('payroll.addAdjustment', 'Add Adjustment')}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-10 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-10 text-center text-status-danger">{t('common.error', 'An error occurred')}</div>
        ) : !payrollData || payrollData.length === 0 ? (
          <EmptyState title={t('payroll.noData', 'No payroll data available for this month')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-bg/50 border-b border-brand-border text-sm text-brand-textMuted uppercase tracking-wider">
                  <th className="p-4 font-medium">{t('payroll.employee', 'Employee')}</th>
                  <th className="p-4 font-medium">{t('payroll.baseSalary', 'Base Salary')}</th>
                  <th className="p-4 font-medium">{t('payroll.allowances', 'Allowances')}</th>
                  <th className="p-4 font-medium">{t('payroll.deductions', 'Deductions')}</th>
                  <th className="p-4 font-medium">{t('payroll.finalTotal', 'Final Total')}</th>
                  <th className="p-4 font-medium text-right">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((payroll) => (
                  <PayrollRow 
                    key={payroll.userId} 
                    payroll={payroll} 
                    onGeneratePayslip={handleGeneratePayslip}
                    isGenerating={isGenerating}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('payroll.addAdjustment', 'Add Adjustment')}>
        <AdjustmentForm 
          employees={users} 
          onSubmit={handleAddAdjustment} 
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isAdding}
        />
      </Modal>
    </div>
  );
};
