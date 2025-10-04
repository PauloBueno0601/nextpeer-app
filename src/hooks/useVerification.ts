"use client"

import { useState } from 'react'

export interface VerificationState {
  documentCaptured: boolean
  selfieCaptured: boolean
  documentImage?: string
  selfieImage?: string
  isProcessing: boolean
}

export function useVerification() {
  const [verification, setVerification] = useState<VerificationState>({
    documentCaptured: false,
    selfieCaptured: false,
    isProcessing: false
  })

  const captureDocument = (imageData: string) => {
    setVerification(prev => ({
      ...prev,
      documentCaptured: true,
      documentImage: imageData
    }))
  }

  const captureSelfie = (imageData: string) => {
    setVerification(prev => ({
      ...prev,
      selfieCaptured: true,
      selfieImage: imageData
    }))
  }

  const resetVerification = () => {
    setVerification({
      documentCaptured: false,
      selfieCaptured: false,
      isProcessing: false
    })
  }

  const isComplete = verification.documentCaptured && verification.selfieCaptured

  return {
    verification,
    captureDocument,
    captureSelfie,
    resetVerification,
    isComplete
  }
}
