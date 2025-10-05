// Importações necessárias para o sistema de métricas do dashboard
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Função GET: Buscar métricas personalizadas do dashboard
export async function GET(request: NextRequest) {
  try {
    // Verificar se o token de autorização foi fornecido
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Extrair ID do usuário do token JWT
    const token = authHeader.split(' ')[1]
    const [userId] = Buffer.from(token, 'base64').toString().split(':')

    // Buscar tipo de perfil do usuário para personalizar métricas
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { tipoPerfil: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Personalizar métricas baseado no tipo de usuário
    if (user.tipoPerfil === 'TOMADOR') {
      // MÉTRICAS PARA TOMADOR DE EMPRÉSTIMOS
      
      // Buscar todos os empréstimos do tomador
      const emprestimos = await prisma.emprestimo.findMany({
        where: { tomadorId: userId },
        select: {
          valorSolicitado: true,
          valorAprovado: true,
          status: true
        }
      })

      // Buscar perfil de crédito do tomador
      const perfilTomador = await prisma.perfilTomador.findUnique({
        where: { usuarioId: userId },
        select: {
          scoreCredito: true,
          limiteCredito: true
        }
      })

      // Calcular totais de empréstimos
      const totalSolicitado = emprestimos.reduce((sum, emp) => sum + Number(emp.valorSolicitado), 0)
      const totalAprovado = emprestimos.reduce((sum, emp) => sum + Number(emp.valorAprovado || 0), 0)
      const ativosCount = emprestimos.filter(emp => 
        ['FINANCIADO', 'ATIVO'].includes(emp.status)
      ).length
      
      const scoreCredito = perfilTomador?.scoreCredito || 0
      const limiteCredito = perfilTomador?.limiteCredito || 50000
      const limiteDisponivel = Number(limiteCredito) - totalAprovado

      return NextResponse.json({
        success: true,
        metrics: {
          totalSolicitado,
          totalAprovado,
          ativosCount,
          scoreCredito,
          limiteCredito: Number(limiteCredito),
          limiteDisponivel: Math.max(0, limiteDisponivel)
        }
      })

    } else {
      // Métricas para investidor
      const investimentos = await prisma.investimento.findMany({
        where: { investidorId: userId },
        select: {
          valorInvestido: true,
          status: true
        }
      })

      const perfilInvestidor = await prisma.perfilInvestidor.findUnique({
        where: { usuarioId: userId },
        select: {
          rendaMensal: true,
          patrimonioTotal: true,
          limiteInvestimento: true
        }
      })

      const totalInvestido = investimentos.reduce((sum, inv) => sum + Number(inv.valorInvestido), 0)
      const investimentosAtivos = investimentos.filter(inv => 
        inv.status === 'ATIVO'
      ).length
      
      // Calcular retorno estimado (12% ao ano)
      const retornoEstimado = totalInvestido * 0.12
      const limiteInvestimento = perfilInvestidor?.limiteInvestimento || 100000
      const saldoDisponivel = Number(limiteInvestimento) - totalInvestido

      return NextResponse.json({
        success: true,
        metrics: {
          totalInvestido,
          investimentosAtivos,
          retornoEstimado,
          limiteInvestimento: Number(limiteInvestimento),
          saldoDisponivel: Math.max(0, saldoDisponivel)
        }
      })
    }

  } catch (error) {
    console.error('Erro ao buscar métricas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
