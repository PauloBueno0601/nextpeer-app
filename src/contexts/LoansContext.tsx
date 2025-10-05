"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Loan {
  id: string
  amount: number
  purpose: string
  term: number
  status: string
  progress: number
  interestRate: number
  date: string
  monthlyPayment: number
  totalAmount: number
  borrower?: {
    name: string
    email: string
    score: number
  }
}

interface LoansContextType {
  loans: Loan[]
  addLoan: (loan: Omit<Loan, 'id' | 'date' | 'progress' | 'status' | 'monthlyPayment' | 'totalAmount'>) => void
  updateLoan: (id: string, updates: Partial<Loan>) => void
  deleteLoan: (id: string) => void
  getAvailableLoans: () => Loan[]
}

const LoansContext = createContext<LoansContextType | undefined>(undefined)

export function LoansProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([])

  // Carregar empréstimos do localStorage na inicialização
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

  const addLoan = (loanData: Omit<Loan, 'id' | 'date' | 'progress' | 'status' | 'monthlyPayment' | 'totalAmount'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      progress: 0,
      status: 'Pendente',
      monthlyPayment: 0,
      totalAmount: 0,
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
