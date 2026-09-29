import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DigitalClock } from './DigitalClock';
import { WebcamCapture } from './WebcamCapture';
import { useEmployees, useTodayTimeLogs, useClockIn, useClockOut } from '../hooks/useTimeLogs';
import { Employee } from '../types';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const KioskView: React.FC = () => {
  const { t } = useTranslation();
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const { data: todayLogs = [], isLoading: loadingLogs } = useTodayTimeLogs();
  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getEmployeeStatus = (userId: string) => {
    // A simplified check: if they have a log today without clockOutTime, they are clocked in
    const userLogs = todayLogs.filter(log => log.userId === userId);
    const lastLog = userLogs[userLogs.length - 1];
    
    if (lastLog && !lastLog.clockOutTime) {
      return 'CLOCKED_IN';
    }
    return 'CLOCKED_OUT';
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowCamera(true);
    setSuccessMessage(null);
  };

  const handleCapture = async (photoBase64: string) => {
    if (!selectedEmployee) return;

    const status = getEmployeeStatus(selectedEmployee.id);
    
    try {
      if (status === 'CLOCKED_OUT') {
        await clockInMutation.mutateAsync({
          userId: selectedEmployee.id,
          photo: photoBase64
        });
        setSuccessMessage(t('attendance.kiosk.clockInSuccess', 'Clock in successful for {{name}}', { name: selectedEmployee.fullName }));
      } else {
        await clockOutMutation.mutateAsync({
          userId: selectedEmployee.id,
          photo: photoBase64
        });
        setSuccessMessage(t('attendance.kiosk.clockOutSuccess', 'Clock out successful for {{name}}', { name: selectedEmployee.fullName }));
      }
      
      setShowCamera(false);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        setSelectedEmployee(null);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to log time:', error);
    }
  };

  const handleCancelCamera = () => {
    setShowCamera(false);
    setSelectedEmployee(null);
  };

  // Helper for avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loadingEmployees || loadingLogs) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg relative flex flex-col items-center py-12 px-4 md:px-8">
      {/* Clock Section */}
      <div className="mb-12">
        <DigitalClock />
      </div>

      {/* Success Message Toast */}
      {successMessage && (
        <div className="absolute top-8 bg-status-successBg border border-status-success text-brand-textMain px-6 py-4 rounded-md shadow-medium z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-status-success text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <span className="font-medium text-lg">{successMessage}</span>
        </div>
      )}

      {/* Employee Grid */}
      <div className="w-full max-w-6xl flex-1">
        <h2 className="text-2xl font-bold text-brand-textMain mb-8 text-center">
          {t('attendance.kiosk.selectEmployee', 'Select your profile to clock in/out')}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {employees.map(employee => {
            const isClockedIn = getEmployeeStatus(employee.id) === 'CLOCKED_IN';
            
            return (
              <button
                key={employee.id}
                onClick={() => handleEmployeeClick(employee)}
                className="flex flex-col items-center p-6 glass rounded-xl shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 group relative"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-primary text-2xl font-bold overflow-hidden border-2 border-transparent group-hover:border-brand-primary transition-colors">
                    {employee.avatarUrl ? (
                      <img src={employee.avatarUrl} alt={employee.fullName} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(employee.fullName)
                    )}
                  </div>
                  
                  {isClockedIn && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-status-success border-2 border-white rounded-full" title={t('attendance.kiosk.clockedIn', 'Clocked In')} />
                  )}
                </div>
                
                <h3 className="font-semibold text-brand-textMain text-center line-clamp-2">
                  {employee.fullName}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manager Login Link */}
      <div className="absolute bottom-8 right-8">
        <Link 
          to="/login" 
          className="text-brand-textMuted hover:text-brand-primary transition-colors text-sm font-medium flex items-center gap-2"
        >
          {t('attendance.kiosk.managerLogin', 'Manager Login')} →
        </Link>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <Modal 
          isOpen={showCamera} 
          onClose={handleCancelCamera}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <WebcamCapture 
              onCapture={handleCapture} 
              onCancel={handleCancelCamera} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
