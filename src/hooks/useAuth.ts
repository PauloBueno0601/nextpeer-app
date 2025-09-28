"use client"

import { useState, useEffect } from 'react'
import { AuthController } from '@/controllers/AuthController'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento de usuário logado
    const token = localStorage.getItem('auth_token')
    if (token) {
      AuthController.getCurrentUser(token).then(currentUser => {
        setUser(currentUser)
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = await AuthController.login({ email, password })
    if (result) {
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)
      return result
    }
    return null
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }
}
