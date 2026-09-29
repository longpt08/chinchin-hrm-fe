import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, X, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WebcamCaptureProps {
  onCapture: (photoBase64: string) => void;
  onCancel: () => void;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onCancel }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(t('attendance.kiosk.cameraError', 'Could not access camera. Please check permissions.'));
    }
  }, [t]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageBase64);
        
        // Stop stream after capture
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  }, [stream]);

  const startCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown, capturePhoto]);

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-brand-surface rounded-lg max-w-md w-full">
        <div className="w-16 h-16 bg-status-dangerBg text-status-danger rounded-full flex items-center justify-center mb-4">
          <Camera size={32} />
        </div>
        <h3 className="text-xl font-semibold text-brand-textMain mb-2">{t('attendance.kiosk.cameraFailed', 'Camera Failed')}</h3>
        <p className="text-center text-brand-textMuted mb-6">{error}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onCancel}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={startCamera}>{t('common.retry', 'Retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-brand-surface rounded-xl max-w-2xl w-full shadow-medium relative">
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-brand-textMuted hover:text-brand-textMain"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold text-brand-textMain mb-6">
        {capturedImage ? t('attendance.kiosk.confirmPhoto', 'Confirm Photo') : t('attendance.kiosk.takePhoto', 'Take Photo')}
      </h2>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 flex items-center justify-center">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <span className="text-8xl font-bold text-white drop-shadow-lg">{countdown}</span>
              </div>
            )}
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-4 w-full">
        {!capturedImage ? (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={startCountdown} 
              disabled={countdown !== null}
              className="flex-1"
            >
              <Camera className="mr-2 h-5 w-5" />
              {t('attendance.kiosk.capture', 'Capture')}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={retake} className="flex-1">
              <RefreshCw className="mr-2 h-5 w-5" />
              {t('attendance.kiosk.retake', 'Retake')}
            </Button>
            <Button onClick={confirm} className="flex-1">
              <Check className="mr-2 h-5 w-5" />
              {t('attendance.kiosk.confirm', 'Confirm')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
