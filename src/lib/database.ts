import { PrismaClient } from '@prisma/client'

// Configuração global do Prisma para evitar múltiplas instâncias
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Instância única do Prisma Client
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Em desenvolvimento, mantém a instância global para evitar recriação
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
