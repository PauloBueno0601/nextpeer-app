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
          <div className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow bg-black relative overflow-hidden">
            {/* Efeito de brilho suave atrás do símbolo */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#34D399]/20 blur-sm"></div>
            
            {/* Símbolo do infinito vazado moderno - maior e mais espaçado */}
            <svg className="w-20 h-16 relative z-10" fill="none" stroke="#34D399" strokeWidth="2.5" viewBox="0 0 20 24">
              <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm8 0c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
              <path d="M12 8c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.2 0-2.3-.5-3.1-1.4-.8.9-1.9 1.4-3.1 1.4-2.2 0-4-1.8-4-4s1.8-4 4-4c1.2 0 2.3.5 3.1 1.4.8-.9 1.9-1.4 3.1-1.4z" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
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
            className="w-full h-14 text-lg font-semibold text-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
          >
            Iniciar
          </Button>
        </div>
      </div>
    </div>
  )
}
