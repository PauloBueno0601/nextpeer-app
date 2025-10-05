// Importação do tipo de transação do Open Finance
import type { Transaction } from './open-finance-data';

// Interface que define o resultado do cálculo de score
export interface ScoreResult {
  dynamicScore: number;           // Score final calculado (300-950)
  positiveIndicators: string[]; // Lista de indicadores positivos encontrados
  negativeIndicators: string[];  // Lista de indicadores negativos encontrados
}

// Função principal para calcular o score dinâmico baseado em transações
export function calculateDynamicScore(transactions: Transaction[]): ScoreResult {
  // Score inicial neutro (500 pontos)
  let score = 500;
  const positiveIndicators: string[] = [];
  const negativeIndicators: string[] = [];

  // Calcular receitas totais (valores positivos)
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  
  // Calcular despesas totais (valores negativos)
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  
  // Calcular fluxo de caixa (receitas - despesas)
  const cashFlow = totalIncome + totalExpenses;

  // REGRA 1: Análise de Fluxo de Caixa
  if (cashFlow > 0) {
    score += 150; // Pontuação alta para fluxo positivo
    positiveIndicators.push("Fluxo de caixa positivo no último mês.");
  } else {
    score -= 150; // Penalização alta para fluxo negativo
    negativeIndicators.push("Fluxo de caixa negativo ou zerado no último mês.");
  }

  // REGRA 2: Capacidade de Poupança/Investimento
  if (transactions.some(t => t.description.toLowerCase().includes('investimento'))) {
    score += 100; // Pontuação alta para capacidade de investir
    positiveIndicators.push("Capacidade de poupança/investimento identificada.");
  }

  // REGRA 3: Renda Estável (identificada por descrição de salário)
  if (transactions.some(t => t.description.toLowerCase().includes('salário'))) {
    score += 50; // Pontuação moderada para renda estável
    positiveIndicators.push("Fonte de renda estável (salário) identificada.");
  }

  // REGRA 4: Uso de Cheque Especial (indicador de risco alto)
  if (transactions.some(t => t.description.toLowerCase().includes('cheque especial'))) {
    score -= 200; // Penalização alta por uso de limite
    negativeIndicators.push("Uso de cheque especial/limite da conta identificado.");
  }

  // REGRA 5: Pagamento Parcial do Cartão (crédito rotativo - muito ruim)
  if (transactions.some(t => t.description.toLowerCase().includes('pagamento parcial'))) {
    score -= 250; // Penalização muito alta por rotativo
    negativeIndicators.push("Pagamento parcial da fatura (crédito rotativo).");
  } else if (transactions.some(t => t.description.toLowerCase().includes('pagamento fatura'))) {
    // Pontuação positiva para pagamento integral da fatura
    positiveIndicators.push("Bom histórico de pagamento da fatura do cartão.");
  }

  // Limitar score entre 300 e 950 pontos
  score = Math.max(300, Math.min(950, score));

  // Garantir que sempre há pelo menos um indicador em cada categoria
  if (negativeIndicators.length === 0) {
    negativeIndicators.push("Nenhum indicador de risco relevante encontrado.");
  }
  if (positiveIndicators.length === 0) {
    positiveIndicators.push("Nenhum indicador positivo relevante encontrado.");
  }

  // Retornar resultado completo do score
  return {
    dynamicScore: Math.round(score),
    positiveIndicators,
    negativeIndicators,
  };
}