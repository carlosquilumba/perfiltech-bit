import { useRef, useState } from 'react'

function CameraCapture({ onCapture, onError }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Este navegador no soporta acceso a la cámara')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        }
      })

      setStream(mediaStream)

      const video = videoRef.current
      if (video) {
        video.srcObject = mediaStream
        // Esperar a que el video tenga dimensiones reales antes de mostrarlo
        video.onloadedmetadata = () => {
          video.play().catch(() => {
            // Ignoramos errores de autoplay
          })
          setIsCapturing(true)
        }
      } else {
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Error al iniciar la cámara:', error)
      if (onError) {
        onError('No se pudo acceder a la cámara. Por favor, verifica los permisos de Windows y del navegador.')
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob && onCapture) {
          const reader = new FileReader()
          reader.onloadend = () => {
            onCapture(reader.result)
          }
          reader.readAsDataURL(blob)
        }
      }, 'image/jpeg', 0.8)

      stopCamera()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      {!isCapturing ? (
        <button
          type="button"
          onClick={startCamera}
          className="w-full py-3 px-4 bg-bit-blue text-white rounded-lg font-semibold hover:bg-bit-blue-light transition-colors"
        >
          Activar Camara
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 py-3 px-4 bg-bit-blue text-white rounded-lg font-semibold hover:bg-bit-blue-light transition-colors"
            >
              Capturar Foto
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-3 bg-gray-300 text-gray-dark rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraCapture


