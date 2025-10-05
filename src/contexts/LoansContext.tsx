"use client"

// Importações necessárias para o contexto de empréstimos
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Interface que define a estrutura de um empréstimo
interface Loan {
  id: string                    // Identificador único do empréstimo
  amount: number                 // Valor do empréstimo
  purpose: string                // Finalidade do empréstimo
  term: number                   // Prazo em meses
  status: string                 // Status atual (pendente, aprovado, ativo, quitado)
  progress: number               // Progresso do pagamento (0-100%)
  interestRate: number           // Taxa de juros mensal
  date: string                   // Data de criação
  monthlyPayment: number         // Valor da parcela mensal
  totalAmount: number            // Valor total a ser pago
  borrower?: {                   // Dados do tomador (opcional)
    name: string
    email: string
    score: number
  }
}

// Interface que define as funções disponíveis no contexto
interface LoansContextType {
  loans: Loan[]                  // Lista de empréstimos
  addLoan: (loan: Omit<Loan, 'id' | 'date' | 'progress' | 'status' | 'monthlyPayment' | 'totalAmount'>) => void
  updateLoan: (id: string, updates: Partial<Loan>) => void
  deleteLoan: (id: string) => void
  getAvailableLoans: () => Loan[] // Buscar empréstimos disponíveis para investimento
}

// Criar contexto para gerenciar estado global dos empréstimos
const LoansContext = createContext<LoansContextType | undefined>(undefined)

// Provider do contexto de empréstimos
export function LoansProvider({ children }: { children: ReactNode }) {
  // Estado para armazenar lista de empréstimos
  const [loans, setLoans] = useState<Loan[]>([])

  // Carregar empréstimos salvos do localStorage na inicialização
  useEffect(() => {
    const savedLoans = localStorage.getItem('nexpeer_loans')
    if (savedLoans) {
      try {
        setLoans(JSON.parse(savedLoans))
      } catch (error) {
        console.error('Erro ao carregar empréstimos do localStorage:', error)
      }
    }
  }, [])

  // Salvar empréstimos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('nexpeer_loans', JSON.stringify(loans))
  }, [loans])

  // Função para calcular pagamento mensal
  const calculateMonthlyPayment = (amount: number, rate: number, term: number): number => {
    const monthlyRate = rate / 100
    if (monthlyRate === 0) return amount / term
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
  }

  // Função para calcular valor total
  const calculateTotalAmount = (amount: number, rate: number, term: number): number => {
    return calculateMonthlyPayment(amount, rate, term) * term
  }

  // Função para adicionar novo empréstimo
  const addLoan = (loanData: Omit<Loan, 'id' | 'date' | 'progress' | 'status' | 'monthlyPayment' | 'totalAmount'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      progress: 0,
      status: 'Pendente',
      monthlyPayment: calculateMonthlyPayment(loanData.amount, loanData.interestRate, loanData.term),
      totalAmount: calculateTotalAmount(loanData.amount, loanData.interestRate, loanData.term),
      borrower: {
        name: 'Usuário',
        email: 'usuario@nexpeer.com',
        score: 750
      }
    }
    setLoans(prev => [...prev, newLoan])
  }

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    setLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, ...updates } : loan
    ))
  }

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id))
  }

  const getAvailableLoans = () => {
    return loans.filter(loan => loan.status === 'Pendente' && loan.progress === 0)
  }

  return (
    <LoansContext.Provider value={{
      loans,
      addLoan,
      updateLoan,
      deleteLoan,
      getAvailableLoans
    }}>
      {children}
    </LoansContext.Provider>
  )
}

export function useLoans() {
  const context = useContext(LoansContext)
  if (context === undefined) {
    throw new Error('useLoans deve ser usado dentro de um LoansProvider')
  }
  return context
}
