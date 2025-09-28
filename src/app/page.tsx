import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center">
        {/* Placeholder para o logo */}
        <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 animate-pulse"></div>
        <h1 className="text-5xl font-bold mb-2">NextPeer</h1>
        <p className="text-lg text-gray-300 mb-8">
          A camada de confiança para o crédito descentralizado
        </p>
        <Link href="/login">
          <button className="w-full max-w-xs px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
            Iniciar Jornada
          </button>
        </Link>
      </div>
    </div>
  );
}