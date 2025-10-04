import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'

export const runtime = 'nodejs'

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function porExtensoBRL(valor: number): string {
  // implementação simplificada apenas para rótulo
  return `${formatBRL(valor)} (valor por extenso simplificado)`
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const emprestimoId = params.id
    const url = new URL(req.url)
    const qpPrincipal = url.searchParams.get('principal')
    const qpMeses = url.searchParams.get('prazoMeses')
    const qpTaxaMes = url.searchParams.get('taxaMes')

    type ContratoData = {
      numeroCedula: string
      tomador: { nome: string; cpf: string; endereco: string }
      investidor: { nome: string; cpfCnpj: string; endereco: string }
      plataforma: { razao: string; cnpj: string; endereco: string }
      credito: {
        valorPrincipal: number
        valorExtenso: string
        dataEmissao: string
        taxaMes: number
        taxaAno: number
        cetAno: number
        prazoMeses: number
        valorParcela: number
      }
      blockchain: { hashContrato: string; smartAddress: string }
      fechamento: { local: string; data: string }
    }
    // Construção de dados via query params (sem acesso ao DB)
    const valorPrincipal = Number(qpPrincipal ?? 5000)
    const prazoMeses = Number(qpMeses ?? 12)
    const taxaMes = Number(qpTaxaMes ?? 0.018)
    const taxaAno = Math.pow(1 + taxaMes, 12) - 1
    const fator = taxaMes > 0 ? (taxaMes * Math.pow(1 + taxaMes, prazoMeses)) / (Math.pow(1 + taxaMes, prazoMeses) - 1) : 1 / prazoMeses
    const parcela = Math.round(valorPrincipal * fator * 100) / 100

    const borrowerName = url.searchParams.get('borrowerName') ?? 'Tomador (simulado)'
    const borrowerCpf = url.searchParams.get('borrowerCpf') ?? '(informar)'
    const borrowerAddress = url.searchParams.get('borrowerAddress') ?? '(informar)'
    const investorName = url.searchParams.get('investorName') ?? 'Investidor (simulado)'
    const investorCpfCnpj = url.searchParams.get('investorCpfCnpj') ?? '(informar)'
    const investorAddress = url.searchParams.get('investorAddress') ?? '(informar)'

    const data: ContratoData = {
      numeroCedula: `NP-${emprestimoId}`,
      tomador: { nome: borrowerName, cpf: borrowerCpf, endereco: borrowerAddress },
      investidor: { nome: investorName, cpfCnpj: investorCpfCnpj, endereco: investorAddress },
      plataforma: { razao: 'NextPeer Plataforma P2P (QI Tech)', cnpj: '00.000.000/0000-00', endereco: '(informar)' },
      credito: {
        valorPrincipal,
        valorExtenso: porExtensoBRL(valorPrincipal),
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        taxaMes,
        taxaAno,
        cetAno: taxaAno,
        prazoMeses,
        valorParcela: parcela,
      },
      blockchain: {
        hashContrato: `0x${Buffer.from(emprestimoId).toString('hex').slice(0, 40)}`,
        smartAddress: `0x${Buffer.from(emprestimoId).toString('hex').slice(0, 40)}`,
      },
      fechamento: { local: 'São Paulo', data: new Date().toLocaleDateString('pt-BR') },
    }

    // pdf-lib rendering (estável)
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    let y = 800
    const margin = 50
    const lh = 14
    const draw = (text: string, bold = false) => {
      page.drawText(text, { x: margin, y, size: 11, font: bold ? fontBold : font })
      y -= lh
    }

    draw('CÉDULA DE CRÉDITO BANCÁRIO', true)
    y -= 8
    draw(`Número da Cédula: ${data.numeroCedula}`)
    y -= 6
    draw('2. Qualificação das Partes', true)
    draw(`Tomador: ${data.tomador.nome} | CPF: ${data.tomador.cpf}`)
    draw(`Investidor: ${data.investidor.nome} | CPF/CNPJ: ${data.investidor.cpfCnpj}`)
    draw(`Plataforma: ${data.plataforma.razao} | CNPJ: ${data.plataforma.cnpj}`)
    y -= 6
    draw('3. Condições do Crédito', true)
    draw(`Valor: ${formatBRL(data.credito.valorPrincipal)} - ${data.credito.valorExtenso}`)
    draw(`Taxa: ${(data.credito.taxaMes * 100).toFixed(2)}% a.m. / ${(data.credito.taxaAno * 100).toFixed(2)}% a.a.`)
    draw(`Prazo: ${data.credito.prazoMeses} meses | Parcela: ${formatBRL(data.credito.valorParcela)}`)
    y -= 6
    draw('4. Cláusulas Gerais', true)
    draw('Pagamento nas datas de vencimento. Inadimplência: multa 2% e juros 1% a.m.')
    draw('Liquidação antecipada permitida. Foro: São Paulo/SP.')
    y -= 6
    draw('5. Garantias e Registro', true)
    draw(`Hash: ${data.blockchain.hashContrato}`)
    draw(`Smart Contract: ${data.blockchain.smartAddress}`)
    y -= 6
    draw('6. Fecho e Assinaturas', true)
    draw(`Local/Data: ${data.fechamento.local}, ${data.fechamento.data}`)
    y -= 8
    draw('____________________________________')
    draw(`${data.investidor.nome} - Credor`)
    draw('____________________________________')
    draw(`${data.tomador.nome} - Devedor`)

    const pdfBytes = await pdfDoc.save()
    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="contrato-ccb-${emprestimoId}.pdf"`
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}


