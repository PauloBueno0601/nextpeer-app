import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

function toCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function simulateHash(input: string): string {
  const data = new TextEncoder().encode(input)
  let h = 0
  for (let i = 0; i < data.length; i++) {
    h = (h * 31 + data[i]) >>> 0
  }
  return `0x${h.toString(16).padStart(8, '0')}${Math.abs(h * 2654435761 >>> 0).toString(16)}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { loanId, investorId, principal, monthlyRate, termMonths } = body ?? {}

    if (!loanId || !investorId || !principal || !monthlyRate || !termMonths) {
      return NextResponse.json({ success: false, error: 'Parâmetros inválidos' }, { status: 400 })
    }

    // Fetch core entities
    const emprestimo = await prisma.emprestimo.findUnique({
      where: { id: loanId },
      include: { tomador: true, contratoCcb: true }
    })

    if (!emprestimo) {
      return NextResponse.json({ success: false, error: 'Empréstimo não encontrado' }, { status: 404 })
    }

    const investidor = await prisma.usuario.findUnique({ where: { id: investorId } })
    if (!investidor) {
      return NextResponse.json({ success: false, error: 'Investidor não encontrado' }, { status: 404 })
    }

    // Ensure or simulate contract record
    const hashContrato = simulateHash(`${loanId}|${investorId}|${principal}|${monthlyRate}|${termMonths}`)
    const simulatedAddress = `0x${simulateHash(loanId).slice(6, 46)}`

    let contrato = await prisma.contratoCcb.findUnique({ where: { emprestimoId: loanId } })

    const borrowerName = `${emprestimo.tomador.nome} ${emprestimo.tomador.sobrenome}`
    const investorName = `${investidor.nome} ${investidor.sobrenome}`
    const borrowerCpf = emprestimo.tomador.cpf
    const investorCpfCnpj = investidor.cpf
    const baseParams = `principal=${encodeURIComponent(principal)}&prazoMeses=${encodeURIComponent(termMonths)}&taxaMes=${encodeURIComponent(monthlyRate)}&borrowerName=${encodeURIComponent(borrowerName)}&borrowerCpf=${encodeURIComponent(borrowerCpf)}&borrowerAddress=${encodeURIComponent('(informar)')}&investorName=${encodeURIComponent(investorName)}&investorCpfCnpj=${encodeURIComponent(investorCpfCnpj)}&investorAddress=${encodeURIComponent('(informar)')}`

    if (!contrato) {
      contrato = await prisma.contratoCcb.create({
        data: {
          emprestimoId: loanId,
          investidorId: investorId,
          tomadorId: emprestimo.tomadorId,
          hashContrato,
          pdfUrl: `/api/contracts/${loanId}/pdf?${baseParams}`
        }
      })
    } else if (!contrato.hashContrato || !contrato.pdfUrl) {
      contrato = await prisma.contratoCcb.update({
        where: { emprestimoId: loanId },
        data: {
          hashContrato: contrato.hashContrato ?? hashContrato,
          pdfUrl: contrato.pdfUrl ?? `/api/contracts/${loanId}/pdf?${baseParams}`
        }
      })
    }

    const responseContract = {
      id: contrato.emprestimoId,
      loanId: contrato.emprestimoId,
      investorId,
      borrowerId: emprestimo.tomadorId,
      hashContrato: contrato.hashContrato ?? hashContrato,
      simulatedAddress,
      pdfUrl: contrato.pdfUrl ?? `/api/contracts/${loanId}/pdf`,
      financialTerms: {
        principal,
        monthlyRate,
        annualRate: Math.pow(1 + monthlyRate, 12) - 1,
        termMonths,
      }
    }

    return NextResponse.json({ success: true, contract: responseContract })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}


