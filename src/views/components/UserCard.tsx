import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/models/User"

interface UserCardProps {
  user: User
  showType?: boolean
  className?: string
}

export function UserCard({ user, showType = true, className }: UserCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          {showType && (
            <Badge variant={user.profileType === "INVESTOR" ? "default" : "secondary"}>
              {user.profileType === "INVESTOR" ? "Investidor" : "Tomador"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>CPF: {user.cpf}</p>
        </div>
      </CardContent>
    </Card>
  )
}
