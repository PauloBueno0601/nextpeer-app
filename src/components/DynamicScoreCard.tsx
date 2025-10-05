'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Interface para dados do score dinâmico
interface ScoreData {
  userId: string;
  name: string;
  dynamicScore: number;
  positiveIndicators: string[];
  negativeIndicators: string[];
}

// Interface para propriedades do componente
interface DynamicScoreCardProps {
  userId: string;
}

// Componente para exibir score dinâmico do usuário
export function DynamicScoreCard({ userId }: DynamicScoreCardProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar dados do score na API
    async function fetchScore() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/scores/dynamic/${userId}`); 

        if (!response.ok) {
          throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }

        const data: ScoreData = await response.json();
        setScoreData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [userId]); // Executa novamente se userId mudar

  // Estado de carregamento
  if (loading) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[200px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Calculando score dinâmico...</p>
        </div>
      </Card>
    );
  }

  // Estado de erro
  if (error || !scoreData) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive/50">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <XCircle className="h-8 w-8" />
          <p className="font-semibold">Erro ao carregar o score.</p>
          <p className="text-xs">{error}</p>
        </div>
      </Card>
    );
  }

  // Função para definir cor do score baseado no valor
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-emerald-500';
    if (score >= 550) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Score Dinâmico de {scoreData.name}</span>
          <span className={`text-4xl font-bold ${getScoreColor(scoreData.dynamicScore)}`}>
            {scoreData.dynamicScore}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção de indicadores positivos */}
        <div>
          <h4 className="font-semibold text-emerald-500 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Pontos Fortes (Green Flags)
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground pl-2">
            {scoreData.positiveIndicators.map((indicator, index) => (
              <li key={`pos-${index}`} className="flex items-start gap-2">
                <span>✅</span>
                <span>{indicator}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Seção de indicadores negativos */}
        <div>
          <h4 className="font-semibold text-red-500 mb-2 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Pontos de Melhoria (Red Flags)
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground pl-2">
            {scoreData.negativeIndicators.map((indicator, index) => (
              <li key={`neg-${index}`} className="flex items-start gap-2">
                <span>❌</span>
                <span>{indicator}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}