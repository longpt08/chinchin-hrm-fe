import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayslips } from '../hooks/usePayroll';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VNĐ';

export const EmployeePayslips: React.FC = () => {
  const { t } = useTranslation();
  // Mock useAuthStore - assume current user ID is 'current-user-1'
  const currentUserId = 'current-user-1'; 
  
  const { data: payslips, isLoading, error } = usePayslips(currentUserId);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  if (isLoading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-10 text-center text-status-danger">{t('common.error', 'An error occurred')}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-textMain">{t('payroll.myPayslips', 'My Payslips')}</h1>
      
      {!payslips || payslips.length === 0 ? (
        <EmptyState title={t('payroll.noPayslips', 'No payslips available')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payslips.map((payslip) => (
            <Card 
              key={payslip.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedPayslip(payslip)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-md">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-textMain">
                      {t('payroll.monthYear', '{{month}}/{{year}}', { month: payslip.month, year: payslip.year })}
                    </h3>
                    <p className="text-sm text-brand-textMuted">{t('payroll.payslip', 'Payslip')}</p>
                  </div>
                </div>
                <Badge variant={payslip.status === 'paid' ? 'success' : 'warning'}>
                  {payslip.status}
                </Badge>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border flex justify-between items-center">
                <span className="text-sm text-brand-textMuted">{t('payroll.finalTotal', 'Final Total')}</span>
                <span className="font-bold text-brand-primary">{formatCurrency(payslip.finalTotal || 0)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!selectedPayslip} 
        onClose={() => setSelectedPayslip(null)} 
        title={t('payroll.payslipDetails', 'Payslip Details')}
      >
        {selectedPayslip && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brand-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-brand-textMain">
                  {t('payroll.monthYear', '{{month}}/{{year}}', { month: selectedPayslip.month, year: selectedPayslip.year })}
                </h2>
                <p className="text-sm text-brand-textMuted">{t('payroll.payslip', 'Payslip')}</p>
              </div>
              <Badge variant={selectedPayslip.status === 'paid' ? 'success' : 'warning'}>
                {selectedPayslip.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-brand-textMuted">{t('payroll.baseSalary', 'Base Salary')}</span>
                <span className="font-medium">{formatCurrency(selectedPayslip.baseSalary || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textMuted">{t('payroll.allowances', 'Allowances')}</span>
                <span className="font-medium text-status-success">+{formatCurrency(selectedPayslip.allowances || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textMuted">{t('payroll.deductions', 'Deductions (Punishments + Advances)')}</span>
                <span className="font-medium text-status-danger">-{formatCurrency((selectedPayslip.punishments || 0) + (selectedPayslip.advances || 0))}</span>
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-between items-center text-lg">
                <span className="font-bold text-brand-textMain">{t('payroll.finalTotal', 'Final Total')}</span>
                <span className="font-bold text-brand-primary">{formatCurrency(selectedPayslip.finalTotal || 0)}</span>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                {t('payroll.downloadPdf', 'Download PDF')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
