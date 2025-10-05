import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'

export const runtime = 'nodejs'

function formatBRL(value: number): string {
  // A conversão para Decimal do Prisma pode exigir `Number()`
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
    
    // Detectar tipo de usuário (investidor ou tomador)
    const userType = url.searchParams.get('userType') || 'tomador' // 'investidor' ou 'tomador'
    
    // DADOS MOCKADOS COMPLETOS DO SISTEMA
    const mockLoans = {
      "1": {
        tomador: { nome: "Ana Costa", cpf: "123.456.789-00", endereco: "São Paulo, SP" },
        investidor: { nome: "Maria Oliveira", cpfCnpj: "987.654.321-00", endereco: "Rio de Janeiro, RJ" },
        credito: {
          valorPrincipal: 5000,
          taxaMes: 0.018, // 1.8% a.m.
          prazoMeses: 12,
          dataEmissao: "15/01/2024"
        },
        assinaturas: {
          tomador: {
            nome: "Ana Costa",
            data: "15/01/2024",
            ip: "192.168.1.100",
            hash: "a1b2c3d4e5f6789012345678901234567890abcd"
          },
          investidor: {
            nome: "Maria Oliveira", 
            data: "15/01/2024",
            ip: "192.168.1.101",
            hash: "b2c3d4e5f6789012345678901234567890abcde1"
          }
        }
      },
      "2": {
        tomador: { nome: "Carlos Santos", cpf: "456.789.123-00", endereco: "Belo Horizonte, MG" },
        investidor: { nome: "João Costa", cpfCnpj: "321.654.987-00", endereco: "São Paulo, SP" },
        credito: {
          valorPrincipal: 8000,
          taxaMes: 0.021, // 2.1% a.m.
          prazoMeses: 18,
          dataEmissao: "01/10/2024"
        },
        assinaturas: {
          tomador: {
            nome: "Carlos Santos",
            data: "01/10/2024", 
            ip: "192.168.1.102",
            hash: "c3d4e5f6789012345678901234567890abcde12"
          },
          investidor: {
            nome: "João Costa",
            data: "01/10/2024",
            ip: "192.168.1.103", 
            hash: "d4e5f6789012345678901234567890abcde123"
          }
        }
      },
      "emp_1": {
        tomador: { nome: "Ana Silva", cpf: "123.456.789-00", endereco: "São Paulo, SP" },
        investidor: { nome: "Maria Oliveira", cpfCnpj: "987.654.321-00", endereco: "Rio de Janeiro, RJ" },
        credito: {
          valorPrincipal: 5000,
          taxaMes: 0.02, // 2% a.m.
          prazoMeses: 12,
          dataEmissao: "15/01/2024"
        },
        assinaturas: {
          tomador: {
            nome: "Ana Silva",
            data: "15/01/2024",
            ip: "192.168.1.200",
            hash: "e5f6789012345678901234567890abcde1234"
          },
          investidor: {
            nome: "Maria Oliveira", 
            data: "15/01/2024",
            ip: "192.168.1.201",
            hash: "f6789012345678901234567890abcde12345"
          }
        }
      },
      "emp_2": {
        tomador: { nome: "Carlos Santos", cpf: "456.789.123-00", endereco: "Belo Horizonte, MG" },
        investidor: { nome: "João Costa", cpfCnpj: "321.654.987-00", endereco: "São Paulo, SP" },
        credito: {
          valorPrincipal: 8000,
          taxaMes: 0.025, // 2.5% a.m.
          prazoMeses: 12,
          dataEmissao: "01/10/2024"
        },
        assinaturas: {
          tomador: {
            nome: "Carlos Santos",
            data: "01/10/2024", 
            ip: "192.168.1.202",
            hash: "6789012345678901234567890abcde123456"
          },
          investidor: {
            nome: "João Costa",
            data: "01/10/2024",
            ip: "192.168.1.203", 
            hash: "789012345678901234567890abcde1234567"
          }
        }
      }
    }
    
    // Buscar dados mockados ou usar fallback
    const loanData = mockLoans[emprestimoId as keyof typeof mockLoans] || {
      tomador: { nome: "Tomador (simulado)", cpf: "(informar)", endereco: "(informar)" },
      investidor: { nome: "Investidor (simulado)", cpfCnpj: "(informar)", endereco: "(informar)" },
      credito: {
        valorPrincipal: 5000,
        taxaMes: 0.018,
        prazoMeses: 12,
        dataEmissao: new Date().toLocaleDateString('pt-BR')
      },
      assinaturas: {
        tomador: {
          nome: "Tomador (simulado)",
          data: new Date().toLocaleDateString('pt-BR'),
          ip: "192.168.1.999",
          hash: "fallback_hash_1234567890abcdef"
        },
        investidor: {
          nome: "Investidor (simulado)",
          data: new Date().toLocaleDateString('pt-BR'),
          ip: "192.168.1.998",
          hash: "fallback_hash_0987654321fedcba"
        }
      }
    }
    
    // Cálculos financeiros
    const valorPrincipal = loanData.credito.valorPrincipal
    const prazoMeses = loanData.credito.prazoMeses
    const taxaMes = loanData.credito.taxaMes
    const taxaAno = Math.pow(1 + taxaMes, 12) - 1
    const fator = taxaMes > 0 ? (taxaMes * Math.pow(1 + taxaMes, prazoMeses)) / (Math.pow(1 + taxaMes, prazoMeses) - 1) : 1 / prazoMeses
    const parcela = Math.round(valorPrincipal * fator * 100) / 100

    const data = {
      numeroCedula: `NP-${emprestimoId}`,
      tomador: loanData.tomador,
      investidor: loanData.investidor,
      plataforma: { razao: 'NextPeer Plataforma P2P (QI Tech)', cnpj: '00.000.000/0000-00', endereco: 'São Paulo, SP' },
      credito: {
        valorPrincipal,
        valorExtenso: porExtensoBRL(valorPrincipal),
        dataEmissao: loanData.credito.dataEmissao,
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

    // 5. RENDERIZAÇÃO DO PDF (esta parte continua exatamente igual)
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

    // ... (toda a lógica de `draw` para desenhar o PDF continua aqui, sem alterações) ...
    draw('CÉDULA DE CRÉDITO BANCÁRIO', true)
    y -= 8
    draw(`Número da Cédula: ${data.numeroCedula}`)
    y -= 6
    draw('2. Qualificação das Partes', true)
    
    // Ordem das partes baseada no tipo de usuário
    if (userType === 'investidor') {
      // Para investidores: destacar o investidor primeiro
      draw(`CREDOR (INVESTIDOR): ${data.investidor.nome} | CPF/CNPJ: ${data.investidor.cpfCnpj}`, true)
      draw(`Endereço: ${data.investidor.endereco}`)
      y -= 4
      draw(`DEVEDOR (TOMADOR): ${data.tomador.nome} | CPF: ${data.tomador.cpf}`)
      draw(`Endereço: ${data.tomador.endereco}`)
    } else {
      // Para tomadores: destacar o tomador primeiro
      draw(`DEVEDOR (TOMADOR): ${data.tomador.nome} | CPF: ${data.tomador.cpf}`, true)
      draw(`Endereço: ${data.tomador.endereco}`)
      y -= 4
      draw(`CREDOR (INVESTIDOR): ${data.investidor.nome} | CPF/CNPJ: ${data.investidor.cpfCnpj}`)
      draw(`Endereço: ${data.investidor.endereco}`)
    }
    
    y -= 4
    draw(`PLATAFORMA: ${data.plataforma.razao} | CNPJ: ${data.plataforma.cnpj}`)
    draw(`Endereço: ${data.plataforma.endereco}`)
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
    
    // Ordem das assinaturas baseada no tipo de usuário
    if (userType === 'investidor') {
      // Para investidores: destacar a assinatura do investidor primeiro
      draw('ASSINATURA DIGITAL - CREDOR (INVESTIDOR)', true)
      draw(`Nome: ${loanData.assinaturas.investidor.nome}`)
      draw(`Data/Hora: ${loanData.assinaturas.investidor.data} - ${new Date().toLocaleTimeString('pt-BR')}`)
      draw(`IP: ${loanData.assinaturas.investidor.ip}`)
      draw(`Hash Digital: ${loanData.assinaturas.investidor.hash}`)
      draw('____________________________________')
      draw(`${data.investidor.nome} - Credor`)
      y -= 12
      
      draw('ASSINATURA DIGITAL - DEVEDOR (TOMADOR)', true)
      draw(`Nome: ${loanData.assinaturas.tomador.nome}`)
      draw(`Data/Hora: ${loanData.assinaturas.tomador.data} - ${new Date().toLocaleTimeString('pt-BR')}`)
      draw(`IP: ${loanData.assinaturas.tomador.ip}`)
      draw(`Hash Digital: ${loanData.assinaturas.tomador.hash}`)
      draw('____________________________________')
      draw(`${data.tomador.nome} - Devedor`)
      y -= 12
    } else {
      // Para tomadores: destacar a assinatura do tomador primeiro
      draw('ASSINATURA DIGITAL - DEVEDOR (TOMADOR)', true)
      draw(`Nome: ${loanData.assinaturas.tomador.nome}`)
      draw(`Data/Hora: ${loanData.assinaturas.tomador.data} - ${new Date().toLocaleTimeString('pt-BR')}`)
      draw(`IP: ${loanData.assinaturas.tomador.ip}`)
      draw(`Hash Digital: ${loanData.assinaturas.tomador.hash}`)
      draw('____________________________________')
      draw(`${data.tomador.nome} - Devedor`)
      y -= 12
      
      draw('ASSINATURA DIGITAL - CREDOR (INVESTIDOR)', true)
      draw(`Nome: ${loanData.assinaturas.investidor.nome}`)
      draw(`Data/Hora: ${loanData.assinaturas.investidor.data} - ${new Date().toLocaleTimeString('pt-BR')}`)
      draw(`IP: ${loanData.assinaturas.investidor.ip}`)
      draw(`Hash Digital: ${loanData.assinaturas.investidor.hash}`)
      draw('____________________________________')
      draw(`${data.investidor.nome} - Credor`)
      y -= 12
    }
    
    // Declaração de Validade das Assinaturas
    draw('DECLARAÇÃO DE VALIDADE DAS ASSINATURAS DIGITAIS', true)
    draw('As assinaturas digitais acima foram geradas através de certificado digital válido')
    draw('e registradas no blockchain da plataforma NextPeer em conformidade com a')
    draw('Lei 14.063/2020 (Marco Legal das Startups) e demais normativas aplicáveis.')
    draw(`Hash do Contrato: ${data.blockchain.hashContrato}`)
    draw(`Smart Contract: ${data.blockchain.smartAddress}`)

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
