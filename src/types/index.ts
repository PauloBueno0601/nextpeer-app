// Define a estrutura de um Usuário no sistema
export interface User {
  id: string;
  name: string;
  email: string;
  profileType: 'INVESTOR' | 'BORROWER'; // Define se é Investidor ou Tomador
  cpf?: string;
  phone?: string;
  birthDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define a estrutura de um Empréstimo
export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string; // Para facilitar a exibição na UI
  amount: number; // Valor solicitado
  interestRate: number; // Taxa de juros (ex: 1.8 para 1.8%)
  term: number; // Prazo em meses
  purpose: string; // Finalidade do empréstimo
  status: 'PENDING' | 'FUNDED' | 'ACTIVE' | 'PAID';
  creditScore: number; // Score do tomador no momento da solicitação
}

// Define a estrutura de um Investimento
export interface Investment {
  id: string;
  investorId: string;
  loanId: string;
  amount: number;
  date: Date;
}