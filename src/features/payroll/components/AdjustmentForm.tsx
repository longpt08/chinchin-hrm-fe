import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const adjustmentSchema = z.object({
  userId: z.string().min(1, 'Employee is required'),
  type: z.enum(['allowance', 'punishment', 'advance']),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export interface AdjustmentFormProps {
  employees: User[];
  onSubmit: (data: AdjustmentFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AdjustmentForm: React.FC<AdjustmentFormProps> = ({ employees, onSubmit, onCancel, isSubmitting }) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: 'allowance',
      amount: 0,
      description: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-textMain mb-1">
          {t('payroll.employee', 'Employee')}
        </label>
        <select
          {...register('userId')}
          className="w-full border border-brand-border rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:border-brand-primary"
        >
          <option value="">{t('payroll.selectEmployee', 'Select Employee')}</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name || emp.phone}</option>
          ))}
        </select>
        {errors.userId && <p className="text-status-danger text-xs mt-1">{errors.userId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-textMain mb-1">
          {t('payroll.type', 'Type')}
        </label>
        <select
          {...register('type')}
          className="w-full border border-brand-border rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:border-brand-primary"
        >
          <option value="allowance">{t('payroll.allowance', 'Allowance')}</option>
          <option value="punishment">{t('payroll.punishment', 'Punishment')}</option>
          <option value="advance">{t('payroll.advance', 'Advance')}</option>
        </select>
        {errors.type && <p className="text-status-danger text-xs mt-1">{errors.type.message}</p>}
      </div>

      <Input
        label={t('payroll.amount', 'Amount (VNĐ)')}
        type="number"
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <Input
        label={t('payroll.date', 'Date')}
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      <Input
        label={t('payroll.description', 'Description')}
        type="text"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {t('common.save', 'Save')}
        </Button>
      </div>
    </form>
  );
};
