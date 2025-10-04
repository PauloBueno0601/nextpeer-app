import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function simulateHash(input: string): string {
  const data = new TextEncoder().encode(input)
  let h = 0
  for (let i = 0; i < data.length; i++) {
    h = (h * 31 + data[i]) >>> 0
  }
  return `0x${h.toString(16).padStart(8, '0')}${Math.abs(h * 2654435761 >>> 0).toString(16)}`
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const emprestimoId = params.id
    let contrato: any = null
    // Se o banco estiver configurado, você pode reativar a consulta abaixo
    // contrato = await prisma.contratoCcb.findUnique({ where: { emprestimoId } })
    // if (contrato) {
    //   return NextResponse.json({
    //     success: true,
    //     contract: {
    //       id: contrato.emprestimoId,
    //       loanId: contrato.emprestimoId,
    //       investorId: contrato.investidorId,
    //       borrowerId: contrato.tomadorId,
    //       hashContrato: contrato.hashContrato,
    //       simulatedAddress: `0x${simulateHash(emprestimoId).slice(6, 46)}`,
    //       pdfUrl: contrato.pdfUrl ?? `/api/contracts/${emprestimoId}/pdf`,
    //     }
    //   })
    // }

    // fallback simulado
    const hashContrato = simulateHash(emprestimoId)
    const simulatedAddress = `0x${simulateHash(`addr:${emprestimoId}`).slice(6, 46)}`

    return NextResponse.json({
      success: true,
      contract: {
        id: emprestimoId,
        loanId: emprestimoId,
        investorId: 'investidor_simulado',
        borrowerId: 'tomador_simulado',
        hashContrato,
        simulatedAddress,
        pdfUrl: `/api/contracts/${emprestimoId}/pdf`,
      }
    })
  } catch (error) {
    // Não derrubamos o fluxo; retornamos contrato simulado
    const emprestimoId = params.id
    const hashContrato = simulateHash(emprestimoId)
    const simulatedAddress = `0x${simulateHash(`addr:${emprestimoId}`).slice(6, 46)}`

    return NextResponse.json({
      success: true,
      contract: {
        id: emprestimoId,
        loanId: emprestimoId,
        investorId: 'investidor_simulado',
        borrowerId: 'tomador_simulado',
        hashContrato,
        simulatedAddress,
        pdfUrl: `/api/contracts/${emprestimoId}/pdf`,
      }
    })
  }
}


