import { AuthController } from "./AuthController"
import { LoanController } from "./LoanController"
import { InvestmentController } from "./InvestmentController"
import { NotificationModel } from "@/models/Notification"
import { AnalyticsModel, type DashboardMetrics } from "@/models/Analytics"
import type { User } from "@/types"

// Interface para dados do dashboard
export interface DashboardData {
  user: User
  metrics: DashboardMetrics
  notifications: any[]
  recentActivity: any[]
  quickActions: any[]
}

// Controlador responsável por gerenciar dados do dashboard
export class DashboardController {
  // Carrega dados do dashboard para tomadores de empréstimo
  static async getBorrowerDashboard(userId: string): Promise<DashboardData | null> {
    try {
      // Verifica se usuário existe e é tomador
      const user = await AuthController.getCurrentUser(userId)
      if (!user || user.profileType !== "BORROWER") {
        return null
      }

      // Busca empréstimos do usuário
      const loans = await LoanController.getLoansByBorrower(userId)

      // Calcula métricas do tomador
      const metrics = AnalyticsModel.calculateBorrowerMetrics(userId, loans)

      // Busca notificações do usuário
      const notifications = NotificationModel.getNotificationsByUser(userId)

      // Atividade recente (últimos 5 empréstimos)
      const recentActivity = loans.slice(0, 5).map((loan) => ({
        id: loan.id,
        type: "loan",
        description: `Empréstimo de R$ ${loan.amount.toLocaleString()}`,
        status: loan.status,
        date: loan.updatedAt,
      }))

      // Ações rápidas para tomadores
      const quickActions = [
        {
          id: "new_loan",
          title: "Solicitar Empréstimo",
          description: "Solicite um novo empréstimo",
          action: "/credit-analysis",
        },
        {
          id: "view_loans",
          title: "Meus Empréstimos",
          description: "Visualize seus empréstimos ativos",
          action: "/dashboard?tab=loans",
        },
        {
          id: "payment_history",
          title: "Histórico de Pagamentos",
          description: "Consulte seu histórico",
          action: "/dashboard?tab=payments",
        },
      ]

      return {
        user,
        metrics,
        notifications: notifications.slice(0, 10),
        recentActivity,
        quickActions,
      }
    } catch (error) {
      console.error("Error loading borrower dashboard:", error)
      return null
    }
  }

  // Carrega dados do dashboard para investidores
  static async getInvestorDashboard(userId: string): Promise<DashboardData | null> {
    try {
      // Verifica se usuário existe e é investidor
      const user = await AuthController.getCurrentUser(userId)
      if (!user || user.profileType !== "INVESTOR") {
        return null
      }

      // Busca investimentos do usuário
      const investments = await InvestmentController.getInvestmentsByInvestor(userId)

      // Calcula métricas do investidor
      const metrics = AnalyticsModel.calculateInvestorMetrics(userId, investments)

      // Busca notificações do usuário
      const notifications = NotificationModel.getNotificationsByUser(userId)

      // Atividade recente (últimos 5 investimentos)
      const recentActivity = investments.slice(0, 5).map((investment) => ({
        id: investment.id,
        type: "investment",
        description: `Investimento de R$ ${investment.amount.toLocaleString()}`,
        status: investment.status,
        date: investment.startDate,
      }))

      // Ações rápidas para investidores
      const quickActions = [
        {
          id: "browse_opportunities",
          title: "Oportunidades",
          description: "Explore novos investimentos",
          action: "/investor/dashboard?tab=opportunities",
        },
        {
          id: "portfolio",
          title: "Meu Portfólio",
          description: "Visualize seus investimentos",
          action: "/investor/dashboard?tab=investments",
        },
        {
          id: "returns",
          title: "Retornos",
          description: "Acompanhe seus ganhos",
          action: "/investor/dashboard?tab=returns",
        },
      ]

      return {
        user,
        metrics,
        notifications: notifications.slice(0, 10),
        recentActivity,
        quickActions,
      }
    } catch (error) {
      console.error("Error loading investor dashboard:", error)
      return null
    }
  }

  // Marca notificação como lida
  static async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    // Verifica se notificação pertence ao usuário
    const notifications = NotificationModel.getNotificationsByUser(userId)
    const notification = notifications.find((n) => n.id === notificationId)

    if (!notification) {
      return false
    }

    return NotificationModel.markAsRead(notificationId)
  }

  // Conta notificações não lidas do usuário
  static async getUnreadNotificationCount(userId: string): Promise<number> {
    return NotificationModel.getUnreadCount(userId)
  }
}
