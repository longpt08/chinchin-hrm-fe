import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { i18n } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const locale = i18n.language === 'vi' ? vi : enUS;

  // Format e.g., "Thứ Hai, 29 Tháng 9, 2026" or "Monday, September 29, 2026"
  const dateString = format(time, 'EEEE, d MMMM, yyyy', { locale });
  const timeString = format(time, 'HH:mm:ss');

  return (
    <div className="flex flex-col items-center justify-center text-brand-textMain">
      <h1 className="text-6xl font-bold tracking-tight mb-2">
        {timeString}
      </h1>
      <p className="text-xl text-brand-textMuted font-medium">
        {dateString}
      </p>
    </div>
  );
};
