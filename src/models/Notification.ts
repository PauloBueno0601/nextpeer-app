export interface Notification {
  id: string
  userId: string
  type: "loan_funded" | "payment_received" | "payment_due" | "investment_opportunity" | "system"
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

export class NotificationModel {
  private static notifications: Notification[] = []

  static createNotification(
    userId: string,
    type: Notification["type"],
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Notification {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
    }

    this.notifications.push(notification)
    return notification
  }

  static getNotificationsByUser(userId: string): Notification[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  }

  static getUnreadCount(userId: string): number {
    return this.notifications.filter((n) => n.userId === userId && !n.read).length
  }

  // Template methods for common notifications
  static notifyLoanFunded(borrowerId: string, loanAmount: number): Notification {
    return this.createNotification(
      borrowerId,
      "loan_funded",
      "Empréstimo 100% Financiado!",
      `Seu empréstimo de R$ ${loanAmount.toLocaleString()} foi totalmente financiado e está ativo.`,
      { amount: loanAmount },
    )
  }

  static notifyPaymentReceived(investorId: string, amount: number, loanId: string): Notification {
    return this.createNotification(
      investorId,
      "payment_received",
      "Pagamento Recebido",
      `Você recebeu R$ ${amount.toLocaleString()} do seu investimento.`,
      { amount, loanId },
    )
  }

  static notifyPaymentDue(borrowerId: string, amount: number, dueDate: Date): Notification {
    return this.createNotification(
      borrowerId,
      "payment_due",
      "Pagamento Vencendo",
      `Sua parcela de R$ ${amount.toLocaleString()} vence em ${dueDate.toLocaleDateString()}.`,
      { amount, dueDate },
    )
  }
}
