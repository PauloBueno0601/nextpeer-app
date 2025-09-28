import { AuthController } from "./AuthController"
import { LoanController } from "./LoanController"
import { InvestmentController } from "./InvestmentController"
import { NotificationModel } from "@/models/Notification"
import { AnalyticsModel, type DashboardMetrics } from "@/models/Analytics"
import type { User } from "@/types"

export interface DashboardData {
  user: User
  metrics: DashboardMetrics
  notifications: any[]
  recentActivity: any[]
  quickActions: any[]
}

export class DashboardController {
  static async getBorrowerDashboard(userId: string): Promise<DashboardData | null> {
    try {
      const user = await AuthController.getCurrentUser(userId)
      if (!user || user.profileType !== "BORROWER") {
        return null
      }

      // Get user's loans
      const loans = await LoanController.getLoansByBorrower(userId)

      // Calculate metrics
      const metrics = AnalyticsModel.calculateBorrowerMetrics(userId, loans)

      // Get notifications
      const notifications = NotificationModel.getNotificationsByUser(userId)

      // Recent activity (simplified)
      const recentActivity = loans.slice(0, 5).map((loan) => ({
        id: loan.id,
        type: "loan",
        description: `Empréstimo de R$ ${loan.amount.toLocaleString()}`,
        status: loan.status,
        date: loan.updatedAt,
      }))

      // Quick actions for borrowers
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

  static async getInvestorDashboard(userId: string): Promise<DashboardData | null> {
    try {
      const user = await AuthController.getCurrentUser(userId)
      if (!user || user.profileType !== "INVESTOR") {
        return null
      }

      // Get user's investments
      const investments = await InvestmentController.getInvestmentsByInvestor(userId)

      // Calculate metrics
      const metrics = AnalyticsModel.calculateInvestorMetrics(userId, investments)

      // Get notifications
      const notifications = NotificationModel.getNotificationsByUser(userId)

      // Recent activity
      const recentActivity = investments.slice(0, 5).map((investment) => ({
        id: investment.id,
        type: "investment",
        description: `Investimento de R$ ${investment.amount.toLocaleString()}`,
        status: investment.status,
        date: investment.startDate,
      }))

      // Quick actions for investors
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

  static async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    // Verify notification belongs to user
    const notifications = NotificationModel.getNotificationsByUser(userId)
    const notification = notifications.find((n) => n.id === notificationId)

    if (!notification) {
      return false
    }

    return NotificationModel.markAsRead(notificationId)
  }

  static async getUnreadNotificationCount(userId: string): Promise<number> {
    return NotificationModel.getUnreadCount(userId)
  }
}
