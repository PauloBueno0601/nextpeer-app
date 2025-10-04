"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react'
import { VerificationInstructions } from './VerificationInstructions'

interface CameraVerificationProps {
  type: 'document' | 'selfie'
  onCapture: (imageData: string) => void
  onClose: () => void
  onFrameDetected?: (isDetected: boolean) => void
}

export function CameraVerification({ type, onCapture, onClose, onFrameDetected }: CameraVerificationProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRetaking, setIsRetaking] = useState(false)
  const [isFrameDetected, setIsFrameDetected] = useState(false)
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isDocument = type === 'document'

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (detectionInterval) {
        clearInterval(detectionInterval)
      }
    }
  }, [])

  useEffect(() => {
    if (stream && videoRef.current) {
      startFrameDetection()
    }
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval)
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isDocument ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique as permissões.')
      console.error('Erro ao acessar câmera:', err)
    }
  }

  const startFrameDetection = () => {
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        detectFrame()
      }
    }, 500) // Verifica a cada 500ms
    
    setDetectionInterval(interval)
  }

  const detectFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Configurar canvas temporário para análise
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar frame atual
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Obter dados da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const detected = analyzeFrame(imageData, canvas.width, canvas.height)

    // Sempre atualizar o estado e notificar o callback
    setIsFrameDetected(detected)
    onFrameDetected?.(detected)
  }

  const analyzeFrame = (imageData: ImageData, width: number, height: number): boolean => {
    const data = imageData.data
    const centerX = Math.floor(width / 2)
    const centerY = Math.floor(height / 2)
    
    if (isDocument) {
      // Para documentos: verificar se há contraste suficiente na área central
      const frameSize = Math.min(width, height) * 0.4
      const startX = Math.floor(centerX - frameSize / 2)
      const startY = Math.floor(centerY - frameSize / 2)
      const endX = Math.floor(centerX + frameSize / 2)
      const endY = Math.floor(centerY + frameSize / 2)
      
      let contrastSum = 0
      let pixelCount = 0
      let maxBrightness = 0
      let minBrightness = 255
      
      for (let y = startY; y < endY; y += 3) {
        for (let x = startX; x < endX; x += 3) {
          const index = (y * width + x) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          const brightness = (r + g + b) / 3
          contrastSum += brightness
          maxBrightness = Math.max(maxBrightness, brightness)
          minBrightness = Math.min(minBrightness, brightness)
          pixelCount++
        }
      }
      
      const avgBrightness = contrastSum / pixelCount
      const contrast = maxBrightness - minBrightness
      
      // Considera detectado se há contraste suficiente e brilho médio
      return contrast > 30 && avgBrightness > 30 && avgBrightness < 220
    } else {
      // Para selfie: verificar se há rosto na área central
      const frameSize = Math.min(width, height) * 0.5
      const startX = Math.floor(centerX - frameSize / 2)
      const startY = Math.floor(centerY - frameSize / 2)
      const endX = Math.floor(centerX + frameSize / 2)
      const endY = Math.floor(centerY + frameSize / 2)
      
      let skinTonePixels = 0
      let totalPixels = 0
      
      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const index = (y * width + x) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          
          // Detectar tons de pele (heurística mais flexível)
          if (r > 80 && g > 30 && b > 15 && 
              Math.max(r, g, b) - Math.min(r, g, b) > 10 &&
              Math.abs(r - g) > 10 && r > g && r > b) {
            skinTonePixels++
          }
          totalPixels++
        }
      }
      
      // Considera detectado se pelo menos 15% dos pixels são tons de pele
      return (skinTonePixels / totalPixels) > 0.15
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Configurar canvas com as dimensões do vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Converter para base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    setIsCapturing(false)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setIsRetaking(true)
    setTimeout(() => setIsRetaking(false), 100)
  }

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  const getInstructions = () => {
    if (isDocument) {
      return {
        title: "Escaneie seu Documento",
        instructions: [
          "Posicione o documento dentro do quadro",
          "Certifique-se de que está em ambiente claro",
          "Mantenha o documento reto e sem reflexos",
          "Aguarde o reconhecimento automático"
        ],
        tips: "Ambiente claro é essencial para a legitimidade da verificação"
      }
    } else {
      return {
        title: "Verificação Facial",
        instructions: [
          "Posicione seu rosto no centro do quadro",
          "Mantenha boa iluminação no ambiente",
          "Olhe diretamente para a câmera",
          "Remova óculos e acessórios se possível"
        ],
        tips: "Certifique-se de estar em ambiente bem iluminado"
      }
    }
  }

  const instructions = getInstructions()

  if (capturedImage && !isRetaking) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold">
                {isDocument ? 'Documento Capturado' : 'Foto Capturada'}
              </h3>
              
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refazer
                </Button>
                <Button 
                  onClick={confirmCapture}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{instructions.title}</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Instructions */}
            <VerificationInstructions type={type} />

            {/* Camera View */}
            <div className="relative">
              {error ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={startCamera}
                      className="mt-2"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  {/* Document frame overlay */}
                  {isDocument && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-48 h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isFrameDetected 
                          ? 'border-green-400 bg-green-400/20' 
                          : 'border-white'
                      }`}>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          isFrameDetected ? 'text-green-200' : 'text-white'
                        }`}>
                          {isFrameDetected ? '✓ Documento detectado!' : 'Posicione o documento aqui'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Selfie frame overlay */}
                  {!isDocument && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFrameDetected 
                          ? 'border-green-400 bg-green-400/20' 
                          : 'border-white'
                      }`}>
                        <span className={`text-xs font-medium text-center transition-colors duration-300 ${
                          isFrameDetected ? 'text-green-200' : 'text-white'
                        }`}>
                          {isFrameDetected ? '✓ Rosto detectado!' : 'Posicione seu rosto aqui'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Capture Button */}
            {!error && (
              <Button 
                onClick={captureImage}
                disabled={isCapturing || !isFrameDetected}
                className={`w-full ${isFrameDetected ? 'bg-green-600 hover:bg-green-700' : ''}`}
                size="lg"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isCapturing ? 'Capturando...' : 
                 isFrameDetected ? 'Submeter Foto' : 
                 'Posicione corretamente no quadro'}
              </Button>
            )}

            {/* Frame Detection Status */}
            {!error && (
              <div className="text-center">
                <div className={`inline-flex items-center space-x-2 text-sm ${
                  isFrameDetected ? 'text-green-600' : 'text-orange-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isFrameDetected ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <span>
                    {isFrameDetected ? 
                      'Enquadramento perfeito! Pode capturar.' : 
                      'Ajuste o posicionamento no quadro'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
