import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, CameraOff, RefreshCw, Check } from 'lucide-react'
import { clsx } from 'clsx'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebcamCaptureProps {
  /** Called with the captured image as a base64 data URL string */
  onCapture: (photoBase64: string) => void
  onCancel: () => void
  /** Name of the employee being photographed (displayed in the UI) */
  employeeName?: string
}

type CaptureState = 'requesting' | 'preview' | 'countdown' | 'captured' | 'error'

const COUNTDOWN_START = 3

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * WebcamCapture
 *
 * Requests camera access, shows a live video feed, then auto-captures after
 * a 3-2-1 countdown. Shows a confirmation screen before calling `onCapture`.
 * Falls back gracefully when camera is unavailable.
 */
export function WebcamCapture({ onCapture, onCancel, employeeName }: WebcamCaptureProps) {
  const { t } = useTranslation()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [captureState, setCaptureState] = useState<CaptureState>('requesting')
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_START)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // ── Start camera ──────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    setCaptureState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCaptureState('preview')
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? t('kiosk.cameraPermissionDenied', 'Camera permission denied. Please allow access.')
          : t('kiosk.cameraUnavailable', 'Camera is unavailable on this device.')
      setErrorMessage(message)
      setCaptureState('error')
    }
  }, [t])

  useEffect(() => {
    void startCamera()
    return () => {
      // Cleanup stream on unmount
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [startCamera])

  // ── Countdown → capture ───────────────────────────────────────────────────

  useEffect(() => {
    if (captureState !== 'countdown') return

    if (countdown === 0) {
      captureFrame()
      return
    }

    const id = setTimeout(() => setCountdown((c) => c - 1), 1_000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureState, countdown])

  // ── Capture frame ─────────────────────────────────────────────────────────

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mirror horizontally (selfie style)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedPhoto(dataUrl)
    setCaptureState('captured')

    // Stop camera stream now that we have the photo
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStartCountdown = () => {
    setCountdown(COUNTDOWN_START)
    setCaptureState('countdown')
  }

  const handleRetake = () => {
    setCapturedPhoto(null)
    void startCamera()
  }

  const handleConfirm = () => {
    if (capturedPhoto) onCapture(capturedPhoto)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-sm mx-auto">
      {/* Employee name */}
      {employeeName && (
        <p className="text-center text-brand-textMuted text-sm">
          {t('kiosk.photoFor', 'Photo for')}{' '}
          <span className="font-semibold text-brand-primary">{employeeName}</span>
        </p>
      )}

      {/* ── Error / camera unavailable ─────────────────────────── */}
      {captureState === 'error' && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-status-dangerBg flex items-center justify-center">
            <CameraOff className="w-10 h-10 text-status-danger" />
          </div>
          <p className="text-brand-textMuted text-sm max-w-xs">{errorMessage}</p>
          <div className="flex gap-3">
            <button
              onClick={() => void startCamera()}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              {t('kiosk.retry', 'Retry')}
            </button>
            <button
              onClick={() => onCapture('')}
              className="btn-secondary text-sm"
            >
              {t('kiosk.continueWithoutPhoto', 'Continue without photo')}
            </button>
          </div>
          <button
            onClick={onCancel}
            className="btn-ghost text-sm text-brand-textMuted"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}

      {/* ── Video feed (preview + countdown) ──────────────────── */}
      {(captureState === 'requesting' ||
        captureState === 'preview' ||
        captureState === 'countdown') && (
        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-brand-textMain/10">
          {/* Video — mirrored so it feels like a selfie */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            muted
            playsInline
          />

          {/* Loading overlay */}
          {captureState === 'requesting' && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-textMain/30">
              <Camera className="w-10 h-10 text-white animate-pulse" />
            </div>
          )}

          {/* Countdown overlay */}
          {captureState === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-textMain/20">
              <span
                key={countdown}
                className={clsx(
                  'text-white font-black drop-shadow-lg',
                  countdown > 0 ? 'text-9xl animate-ping-once' : 'text-6xl',
                )}
              >
                {countdown > 0 ? countdown : '📸'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Captured preview ──────────────────────────────────── */}
      {captureState === 'captured' && capturedPhoto && (
        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
          <img
            src={capturedPhoto}
            alt={t('kiosk.capturedPhoto', 'Captured photo')}
            className="w-full h-full object-cover"
          />
          {/* Success indicator */}
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-status-success flex items-center justify-center shadow-medium">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Action buttons ────────────────────────────────────── */}
      {captureState === 'preview' && (
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="btn-ghost flex-1">
            {t('common.cancel')}
          </button>
          <button onClick={handleStartCountdown} className="btn-primary flex-1">
            <Camera className="w-4 h-4 mr-2" />
            {t('kiosk.takePhoto', 'Take Photo')}
          </button>
        </div>
      )}

      {captureState === 'countdown' && (
        <p className="text-brand-textMuted text-sm animate-pulse">
          {t('kiosk.taking_photo')}
        </p>
      )}

      {captureState === 'captured' && (
        <div className="flex gap-3 w-full">
          <button onClick={handleRetake} className="btn-outline flex-1 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('kiosk.retake', 'Retake')}
          </button>
          <button onClick={handleConfirm} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            {t('common.confirm')}
          </button>
        </div>
      )}
    </div>
  )
}
