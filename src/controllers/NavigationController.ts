import type { User } from "@/models/User"

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  badge?: number
  active?: boolean
  children?: NavigationItem[]
}

export class NavigationController {
  static getBorrowerNavigation(user: User, currentPath: string): NavigationItem[] {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: "home",
        active: currentPath === "/dashboard",
      },
      {
        id: "loans",
        label: "Empréstimos",
        path: "/dashboard?tab=loans",
        icon: "credit-card",
        active: currentPath.includes("tab=loans"),
      },
      {
        id: "payments",
        label: "Boletos",
        path: "/dashboard?tab=payments",
        icon: "receipt",
        active: currentPath.includes("tab=payments"),
      },
      {
        id: "profile",
        label: "Perfil",
        path: "/dashboard?tab=profile",
        icon: "user",
        active: currentPath.includes("tab=profile"),
      },
    ]
  }

  static getInvestorNavigation(user: User, currentPath: string): NavigationItem[] {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/investor/dashboard",
        icon: "home",
        active: currentPath === "/investor/dashboard",
      },
      {
        id: "opportunities",
        label: "Oportunidades",
        path: "/investor/dashboard?tab=opportunities",
        icon: "trending-up",
        active: currentPath.includes("tab=opportunities"),
      },
      {
        id: "investments",
        label: "Investimentos",
        path: "/investor/dashboard?tab=investments",
        icon: "pie-chart",
        active: currentPath.includes("tab=investments"),
      },
      {
        id: "returns",
        label: "Retornos",
        path: "/investor/dashboard?tab=returns",
        icon: "dollar-sign",
        active: currentPath.includes("tab=returns"),
      },
      {
        id: "profile",
        label: "Perfil",
        path: "/investor/dashboard?tab=profile",
        icon: "user",
        active: currentPath.includes("tab=profile"),
      },
    ]
  }

  static getPublicNavigation(currentPath: string): NavigationItem[] {
    return [
      {
        id: "home",
        label: "Início",
        path: "/",
        active: currentPath === "/",
      },
      {
        id: "login",
        label: "Entrar",
        path: "/login",
        active: currentPath === "/login",
      },
      {
        id: "signup",
        label: "Cadastrar",
        path: "/signup",
        active: currentPath === "/signup",
      },
    ]
  }

  static getBreadcrumbs(currentPath: string, user?: User): NavigationItem[] {
    const breadcrumbs: NavigationItem[] = []

    // Parse path segments
    const segments = currentPath.split("/").filter(Boolean)

    // Add home
    breadcrumbs.push({
      id: "home",
      label: user ? "Dashboard" : "Início",
      path: user ? (user.profileType === "INVESTOR" ? "/investor/dashboard" : "/dashboard") : "/",
    })

    // Add path segments
    let currentSegmentPath = ""
    segments.forEach((segment, index) => {
      currentSegmentPath += `/${segment}`

      let label = segment
      switch (segment) {
        case "investor":
          label = "Investidor"
          break
        case "dashboard":
          label = "Dashboard"
          break
        case "loan-details":
          label = "Detalhes do Empréstimo"
          break
        case "contract-confirmation":
          label = "Confirmação"
          break
        case "credit-analysis":
          label = "Análise de Crédito"
          break
        case "financial-data":
          label = "Dados Financeiros"
          break
        case "risk-profile":
          label = "Perfil de Risco"
          break
      }

      breadcrumbs.push({
        id: segment,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        path: currentSegmentPath,
        active: index === segments.length - 1,
      })
    })

    return breadcrumbs
  }
}
