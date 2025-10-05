const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testando conexão com o banco...')
    
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Testar uma query simples
    const userCount = await prisma.usuario.count()
    console.log(`✅ Usuários no banco: ${userCount}`)
    
    // Testar criação de usuário
    const testUser = await prisma.usuario.create({
      data: {
        nome: 'Teste',
        sobrenome: 'Conexão',
        email: 'teste-conexao@teste.com',
        senhaHash: 'hash-teste',
        cpf: '99999999999',
        telefone: '11999999999',
        tipoPerfil: 'TOMADOR'
      }
    })
    
    console.log('✅ Usuário de teste criado:', testUser.id)
    
    // Limpar usuário de teste
    await prisma.usuario.delete({
      where: { id: testUser.id }
    })
    
    console.log('✅ Usuário de teste removido')
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
