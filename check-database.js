const { PrismaClient } = require('@prisma/client')

async function checkDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Verificando estrutura do banco de dados...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida')
    
    // Verificar tabelas principais
    console.log('\n📊 Verificando tabelas:')
    
    try {
      const usuarios = await prisma.usuario.count()
      console.log(`✅ usuarios: ${usuarios} registros`)
    } catch (e) {
      console.log(`❌ usuarios: ${e.message}`)
    }
    
    try {
      const emprestimos = await prisma.emprestimo.count()
      console.log(`✅ emprestimos: ${emprestimos} registros`)
    } catch (e) {
      console.log(`❌ emprestimos: ${e.message}`)
    }
    
    try {
      const investimentos = await prisma.investimento.count()
      console.log(`✅ investimentos: ${investimentos} registros`)
    } catch (e) {
      console.log(`❌ investimentos: ${e.message}`)
    }
    
    try {
      const perfilTomador = await prisma.perfilTomador.count()
      console.log(`✅ perfil_tomador: ${perfilTomador} registros`)
    } catch (e) {
      console.log(`❌ perfil_tomador: ${e.message}`)
    }
    
    try {
      const perfilInvestidor = await prisma.perfilInvestidor.count()
      console.log(`✅ perfil_investidor: ${perfilInvestidor} registros`)
    } catch (e) {
      console.log(`❌ perfil_investidor: ${e.message}`)
    }
    
    try {
      const parcelas = await prisma.parcela.count()
      console.log(`✅ parcelas: ${parcelas} registros`)
    } catch (e) {
      console.log(`❌ parcelas: ${e.message}`)
    }
    
    try {
      const notificacoes = await prisma.notificacao.count()
      console.log(`✅ notificacoes: ${notificacoes} registros`)
    } catch (e) {
      console.log(`❌ notificacoes: ${e.message}`)
    }
    
    // Testar criação de usuário
    console.log('\n🧪 Testando criação de usuário...')
    try {
      const testUser = await prisma.usuario.create({
        data: {
          nome: 'Teste',
          sobrenome: 'Conexão',
          email: 'teste-conexao-' + Date.now() + '@teste.com',
          senhaHash: 'hash-teste',
          cpf: '99999999999',
          telefone: '11999999999',
          tipoPerfil: 'TOMADOR'
        }
      })
      
      console.log('✅ Usuário criado:', testUser.id)
      
      // Limpar
      await prisma.usuario.delete({
        where: { id: testUser.id }
      })
      
      console.log('✅ Usuário removido')
      
    } catch (e) {
      console.log(`❌ Erro ao criar usuário: ${e.message}`)
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
