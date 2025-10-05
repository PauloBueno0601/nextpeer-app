import { NextResponse } from 'next/server'

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

    // Dados mockados
    const hashContrato = simulateHash(`${loanId}|${investorId}|${principal}|${monthlyRate}|${termMonths}`)
    const simulatedAddress = `0x${simulateHash(loanId).slice(6, 46)}`

    // Dados mockados baseados no loanId
    const mockData = {
      "emp_1": {
        borrowerName: "Ana Costa",
        investorName: "Maria Oliveira",
        borrowerCpf: "123.456.789-00",
        investorCpfCnpj: "987.654.321-00"
      }
    }

    const data = mockData[loanId as keyof typeof mockData] || {
      borrowerName: "Tomador (simulado)",
      investorName: "Investidor (simulado)",
      borrowerCpf: "(informar)",
      investorCpfCnpj: "(informar)"
    }

    const baseParams = `userType=investidor&principal=${encodeURIComponent(principal)}&prazoMeses=${encodeURIComponent(termMonths)}&taxaMes=${encodeURIComponent(monthlyRate)}&borrowerName=${encodeURIComponent(data.borrowerName)}&borrowerCpf=${encodeURIComponent(data.borrowerCpf)}&borrowerAddress=${encodeURIComponent('(informar)')}&investorName=${encodeURIComponent(data.investorName)}&investorCpfCnpj=${encodeURIComponent(data.investorCpfCnpj)}&investorAddress=${encodeURIComponent('(informar)')}`

    const responseContract = {
      id: loanId,
      loanId: loanId,
      investorId,
      borrowerId: 'tomador_simulado',
      hashContrato,
      simulatedAddress,
      pdfUrl: `/api/contracts/${loanId}/pdf?${baseParams}`,
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