const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log(' Iniciando seed de dados...')

  // Limpar dados existentes
  await prisma.repasse.deleteMany()
  await prisma.parcela.deleteMany()
  await prisma.contratoCcb.deleteMany()
  await prisma.investimento.deleteMany()
  await prisma.emprestimo.deleteMany()
  await prisma.notificacao.deleteMany()
  await prisma.logAcao.deleteMany()
  await prisma.historicoScore.deleteMany()
  await prisma.perfilTomador.deleteMany()
  await prisma.perfilInvestidor.deleteMany()
  await prisma.usuario.deleteMany()

  // Criar usuários de demonstração
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Tomador 1
  const tomador1 = await prisma.usuario.create({
    data: {
      nome: 'Ana',
      sobrenome: 'Silva',
      email: 'ana@nexpeer.com',
      senhaHash: hashedPassword,
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      tipoPerfil: 'TOMADOR',
      statusKyc: 'APROVADO'
    }
  })

  // Tomador 2
  const tomador2 = await prisma.usuario.create({
    data: {
      nome: 'Carlos',
      sobrenome: 'Santos',
      email: 'carlos@nexpeer.com',
      senhaHash: hashedPassword,
      cpf: '987.654.321-00',
      telefone: '(11) 88888-8888',
      tipoPerfil: 'TOMADOR',
      statusKyc: 'APROVADO'
    }
  })

  // Investidor 1
  const investidor1 = await prisma.usuario.create({
    data: {
      nome: 'Maria',
      sobrenome: 'Oliveira',
      email: 'maria@nexpeer.com',
      senhaHash: hashedPassword,
      cpf: '456.789.123-00',
      telefone: '(11) 77777-7777',
      tipoPerfil: 'INVESTIDOR',
      statusKyc: 'APROVADO'
    }
  })

  // Investidor 2
  const investidor2 = await prisma.usuario.create({
    data: {
      nome: 'João',
      sobrenome: 'Costa',
      email: 'joao@nexpeer.com',
      senhaHash: hashedPassword,
      cpf: '789.123.456-00',
      telefone: '(11) 66666-6666',
      tipoPerfil: 'INVESTIDOR',
      statusKyc: 'APROVADO'
    }
  })

  // Criar perfis
  await prisma.perfilTomador.createMany({
    data: [
      {
        usuarioId: tomador1.id,
        scoreCredito: 780,
        limiteCredito: 15000
      },
      {
        usuarioId: tomador2.id,
        scoreCredito: 720,
        limiteCredito: 10000
      }
    ]
  })

  await prisma.perfilInvestidor.createMany({
    data: [
      {
        usuarioId: investidor1.id,
        rendaMensal: 15000,
        patrimonioTotal: 200000,
        perfilRisco: 'MODERADO',
        limiteInvestimento: 50000
      },
      {
        usuarioId: investidor2.id,
        rendaMensal: 25000,
        patrimonioTotal: 500000,
        perfilRisco: 'AGRESSIVO',
        limiteInvestimento: 100000
      }
    ]
  })

  // Criar empréstimos
  const emprestimo1 = await prisma.emprestimo.create({
    data: {
      tomadorId: tomador1.id,
      status: 'FINANCIADO',
      valorSolicitado: 5000,
      valorAprovado: 5000,
      taxaJuros: 1.8,
      prazoMeses: 12,
      finalidade: 'Reforma da loja',
      financiadoEm: new Date()
    }
  })

  const emprestimo2 = await prisma.emprestimo.create({
    data: {
      tomadorId: tomador2.id,
      status: 'PENDENTE',
      valorSolicitado: 8000,
      taxaJuros: 2.1,
      prazoMeses: 18,
      finalidade: 'Capital de giro'
    }
  })

  // Criar investimento
  await prisma.investimento.create({
    data: {
      emprestimoId: emprestimo1.id,
      investidorId: investidor1.id,
      valorInvestido: 5000,
      status: 'ATIVO'
    }
  })

  // Criar parcelas
  const parcelas = []
  for (let i = 1; i <= 12; i++) {
    const dataVencimento = new Date()
    dataVencimento.setMonth(dataVencimento.getMonth() + i)
    
    parcelas.push({
      emprestimoId: emprestimo1.id,
      dataVencimento,
      valorParcela: 506.90,
      status: i === 1 ? 'PAGO' : 'PENDENTE',
      pagoEm: i === 1 ? new Date() : null
    })
  }

  await prisma.parcela.createMany({
    data: parcelas
  })

  // Criar notificações
  await prisma.notificacao.createMany({
    data: [
      {
        usuarioId: tomador1.id,
        titulo: 'Empréstimo Aprovado',
        mensagem: 'Seu empréstimo de R$ 5.000 foi 100% financiado!',
        tipo: 'EMPRESTIMO_FINANCIADO'
      },
      {
        usuarioId: investidor1.id,
        titulo: 'Pagamento Recebido',
        mensagem: 'Ana Silva realizou o pagamento da parcela 1/12',
        tipo: 'PAGAMENTO_RECEBIDO'
      }
    ]
  })

  console.log(' Seed de dados concluído!')
  console.log(` Usuários criados: 4`)
  console.log(` Empréstimos criados: 2`)
  console.log(` Investimentos criados: 1`)
  console.log(` Parcelas criadas: 12`)
  console.log(` Notificações criadas: 2`)
}

main()
  .catch((e) => {
    console.error(' Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
