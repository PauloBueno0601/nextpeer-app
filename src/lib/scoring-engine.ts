import type { Transaction } from './open-finance-data';

// Interface para resultado do score dinâmico
export interface ScoreResult {
  dynamicScore: number;
  positiveIndicators: string[];
  negativeIndicators: string[];
}

// Motor de scoring dinâmico baseado em transações Open Finance
export function calculateDynamicScore(transactions: Transaction[]): ScoreResult {
  let score = 500;
  const positiveIndicators: string[] = [];
  const negativeIndicators: string[] = [];

  // Calcula fluxo de caixa
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  const cashFlow = totalIncome + totalExpenses;

  // Regra: Fluxo de Caixa
  if (cashFlow > 0) {
    score += 150;
    positiveIndicators.push("Fluxo de caixa positivo no último mês.");
  } else {
    score -= 150;
    negativeIndicators.push("Fluxo de caixa negativo ou zerado no último mês.");
  }

  // Regra: Poupança/Investimento
  if (transactions.some(t => t.description.toLowerCase().includes('investimento'))) {
    score += 100;
    positiveIndicators.push("Capacidade de poupança/investimento identificada.");
  }

  // Regra: Renda Estável (simulado pela descrição)
  if (transactions.some(t => t.description.toLowerCase().includes('salário'))) {
    score += 50;
    positiveIndicators.push("Fonte de renda estável (salário) identificada.");
  }

  // Regra: Cheque Especial
  if (transactions.some(t => t.description.toLowerCase().includes('cheque especial'))) {
    score -= 200;
    negativeIndicators.push("Uso de cheque especial/limite da conta identificado.");
  }

  // Regra: Pagamento Parcial do Cartão (Rotativo)
  if (transactions.some(t => t.description.toLowerCase().includes('pagamento parcial'))) {
    score -= 250;
    negativeIndicators.push("Pagamento parcial da fatura (crédito rotativo).");
  } else if (transactions.some(t => t.description.toLowerCase().includes('pagamento fatura'))) {
     positiveIndicators.push("Bom histórico de pagamento da fatura do cartão.");
  }

  // Limita score entre 300 e 950
  score = Math.max(300, Math.min(950, score));

  // Adiciona indicadores padrão se não houver nenhum
  if (negativeIndicators.length === 0) {
    negativeIndicators.push("Nenhum indicador de risco relevante encontrado.");
  }
   if (positiveIndicators.length === 0) {
    positiveIndicators.push("Nenhum indicador positivo relevante encontrado.");
  }

  return {
    dynamicScore: Math.round(score),
    positiveIndicators,
    negativeIndicators,
  };
}