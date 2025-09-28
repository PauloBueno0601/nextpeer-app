"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, X } from "lucide-react"
import type { Notification } from "@/models/Notification"

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onDismiss?: (notificationId: string) => void
  className?: string
}

export function NotificationPanel({ notifications, onMarkAsRead, onDismiss, className }: NotificationPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "loan_funded":
        return "default"
      case "payment_received":
        return "outline"
      case "payment_due":
        return "destructive"
      case "investment_opportunity":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "loan_funded":
        return "💰"
      case "payment_received":
        return "✅"
      case "payment_due":
        return "⏰"
      case "investment_opportunity":
        return "📈"
      default:
        return "🔔"
    }
  }

  if (notifications.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bell className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhuma notificação</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notificações</span>
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge variant="destructive">{notifications.filter((n) => !n.read).length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-colors ${
              notification.read ? "bg-muted/50" : "bg-card border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-lg">{getTypeIcon(notification.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <Badge variant={getTypeColor(notification.type)} className="text-xs">
                      {notification.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.createdAt.toLocaleDateString()} às {notification.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {!notification.read && onMarkAsRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {onDismiss && (
                  <Button variant="ghost" size="sm" onClick={() => onDismiss(notification.id)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
