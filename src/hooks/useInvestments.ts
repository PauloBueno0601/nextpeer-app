"use client"

import { useState, useEffect } from 'react'
import { InvestmentController } from '@/controllers/InvestmentController'
import { LoanController } from '@/controllers/LoanController'
import type { Investment } from '@/models/Investment'
import type { Loan } from '@/models/Loan'

export function useInvestments(investorId?: string) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [investorId])

  const loadData = async () => {
    setLoading(true)
    try {
      if (investorId) {
        const userInvestments = await InvestmentController.getInvestmentsByInvestor(investorId)
        setInvestments(userInvestments)
      }
      
      const loans = await LoanController.getAvailableLoans()
      setAvailableLoans(loans)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const invest = async (loanId: string, amount: number) => {
    if (!investorId) return { success: false, error: 'Usuário não identificado' }
    
    const result = await InvestmentController.createInvestment(investorId, loanId, amount)
    if (result.success) {
      await loadData() // Recarrega os dados
    }
    return result
  }

  return {
    investments,
    availableLoans,
    loading,
    invest,
    refresh: loadData
  }
}
