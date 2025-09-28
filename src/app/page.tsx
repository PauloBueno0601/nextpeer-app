"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()

  const handleStart = () => {
    // Vai para a tela de login
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full space-y-8">
        {/* Logo placeholder */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
            <div className="w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* App name */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.4s" }}>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">NextPeer</h1>
        </div>

        {/* Slogan */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.6s" }}>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance">
            A camada de confiança para o crédito descentralizado
          </p>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1 min-h-[120px]" />

        {/* Start button */}
        <div className="animate-fade-in-up w-full space-y-3" style={{ animationDelay: "0.8s" }}>
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            Iniciar
          </Button>
        </div>
      </div>
    </div>
  )
}
