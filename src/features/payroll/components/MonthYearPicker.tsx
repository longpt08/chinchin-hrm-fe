import React from 'react';
import { useTranslation } from 'react-i18next';

export interface MonthYearPickerProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ month, year, onChange }) => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="month" className="text-sm font-medium text-brand-textMain">
          {t('payroll.month', 'Month')}
        </label>
        <select
          id="month"
          value={month}
          onChange={(e) => onChange(Number(e.target.value), year)}
          className="border border-brand-border rounded-md px-3 py-1.5 bg-white text-sm focus:outline-none focus:border-brand-primary"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {t('payroll.monthValue', 'Month {{month}}', { month: m })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="year" className="text-sm font-medium text-brand-textMain">
          {t('payroll.year', 'Year')}
        </label>
        <select
          id="year"
          value={year}
          onChange={(e) => onChange(month, Number(e.target.value))}
          className="border border-brand-border rounded-md px-3 py-1.5 bg-white text-sm focus:outline-none focus:border-brand-primary"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
