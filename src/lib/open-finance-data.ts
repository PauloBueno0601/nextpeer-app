// Interface para transações financeiras
export interface Transaction {
  date: string;
  description: string;
  amount: number;
}

// Interface para contas bancárias
export interface Account {
  accountId: string;
  accountType: 'checking' | 'credit_card';
  balance: number;
  transactions: Transaction[];
}

// Interface para dados de Open Finance por usuário
export interface UserOpenFinanceData {
  [userId: string]: {
    name: string;
    accounts: Account[];
  };
}

// Dados simulados de Open Finance para demonstração
// IDs '1' e '2' correspondem aos tomadores Ana e Carlos
// ID '3' demonstra perfil médio
export const openFinanceData: UserOpenFinanceData = {
  // ANA SILVA (ID '1') - Perfil de Baixo Risco
  "1": {
    name: "Ana Silva",
    accounts: [{
      accountId: "ana-checking-01",
      accountType: 'checking',
      balance: 12500,
      transactions: [
        { date: "2025-09-05", description: "Salário Empresa ABC", amount: 8000 },
        { date: "2025-09-05", description: "Pagamento Fatura Cartão", amount: -3500 },
        { date: "2025-09-10", description: "Aluguel", amount: -2000 },
        { date: "2025-09-20", description: "Investimento CDB", amount: -1500 },
      ],
    }],
  },
  // CARLOS SANTOS (ID '2') - Perfil de Alto Risco (apesar do score 720)
  "2": {
    name: "Carlos Santos",
    accounts: [{
      accountId: "carlos-checking-01",
      accountType: 'checking',
      balance: -250, // Saldo negativo
      transactions: [
        { date: "2025-09-07", description: "Recebimento Serviço", amount: 5000 },
        { date: "2025-09-08", description: "Pagamento Parcial Fatura", amount: -1500 },
        { date: "2025-09-10", description: "Aluguel", amount: -2500 },
        { date: "2025-09-15", description: "Compras Online", amount: -1500 },
        { date: "2025-09-25", description: "Juros Cheque Especial", amount: -85 },
      ],
    }],
  },
  // BRUNO COSTA (ID '3') - Perfil de Médio Risco (Autônomo)
  "3": {
    name: "Bruno Costa",
    accounts: [{
      accountId: "bruno-checking-01",
      accountType: 'checking',
      balance: 3200,
      transactions: [
        { date: "2025-09-02", description: "Pgto Cliente X", amount: 2500 },
        { date: "2025-09-08", description: "Pgto Cliente Y", amount: 3000 },
        { date: "2025-09-10", description: "Aluguel Estúdio", amount: -1500 },
        { date: "2025-09-12", description: "Pagamento Fatura Cartão", amount: -2800 },
        { date: "2025-09-29", description: "Supermercado", amount: -1200 },
      ],
    }],
  },
};