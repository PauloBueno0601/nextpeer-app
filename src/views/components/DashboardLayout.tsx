"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType } from "@/types"

interface DashboardLayoutProps {
  user: UserType
  children: ReactNode
  notifications?: number
  onLogout?: () => void
}

export function DashboardLayout({ user, children, notifications = 0, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">NexPeer</h1>
              <Badge variant={user.profileType === "INVESTOR" ? "default" : "secondary"}>
                {user.profileType === "INVESTOR" ? "Investidor" : "Tomador"}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{notifications}</Badge>
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
