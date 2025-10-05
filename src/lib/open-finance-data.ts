// Interface que define uma transação financeira
export interface Transaction {
  date: string;        // Data da transação no formato YYYY-MM-DD
  description: string;  // Descrição da transação (ex: "Salário", "Pagamento Fatura")
  amount: number;      // Valor da transação (positivo = entrada, negativo = saída)
}

// Interface que define uma conta bancária
export interface Account {
  accountId: string;   // Identificador único da conta
  accountType: 'checking' | 'credit_card'; // Tipo da conta (corrente ou cartão)
  balance: number;     // Saldo atual da conta
  transactions: Transaction[]; // Lista de transações da conta
}

// Interface que define os dados de Open Finance de um usuário
export interface UserOpenFinanceData {
  [userId: string]: {
    name: string;       // Nome do usuário
    accounts: Account[]; // Lista de contas do usuário
  };
}

// Dados simulados do Open Finance para demonstração
// Estes dados representam diferentes perfis de usuários para teste do sistema
export const openFinanceData: UserOpenFinanceData = {
  // ANA SILVA (ID '1') - Perfil de Baixo Risco
  // Características: Funcionária CLT, renda estável, capacidade de poupança
  "1": {
    name: "Ana Silva",
    accounts: [{
      accountId: "ana-checking-01",
      accountType: 'checking',
      balance: 12500, // Saldo positivo alto
      transactions: [
        { date: "2025-09-05", description: "Salário Empresa ABC", amount: 8000 },
        { date: "2025-09-05", description: "Pagamento Fatura Cartão", amount: -3500 },
        { date: "2025-09-10", description: "Aluguel", amount: -2000 },
        { date: "2025-09-20", description: "Investimento CDB", amount: -1500 },
      ],
    }],
  },
  
  // CARLOS SANTOS (ID '2') - Perfil de Alto Risco
  // Características: Autônomo, renda variável, uso de limite, pagamento parcial
  "2": {
    name: "Carlos Santos",
    accounts: [{
      accountId: "carlos-checking-01",
      accountType: 'checking',
      balance: -250, // Saldo negativo - indicador de risco
      transactions: [
        { date: "2025-09-07", description: "Recebimento Serviço", amount: 5000 },
        { date: "2025-09-08", description: "Pagamento Parcial Fatura", amount: -1500 },
        { date: "2025-09-10", description: "Aluguel", amount: -2500 },
        { date: "2025-09-15", description: "Compras Online", amount: -1500 },
        { date: "2025-09-25", description: "Juros Cheque Especial", amount: -85 },
      ],
    }],
  },
  
  // BRUNO COSTA (ID '3') - Perfil de Médio Risco
  // Características: Autônomo, renda variável mas consistente, pagamento integral
  "3": {
    name: "Bruno Costa",
    accounts: [{
      accountId: "bruno-checking-01",
      accountType: 'checking',
      balance: 3200, // Saldo positivo moderado
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