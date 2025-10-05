const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function testRegister() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testando registro de usuário...')
    
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const user = await prisma.usuario.create({
      data: {
        nome: 'Teste',
        sobrenome: 'Registro',
        email: 'teste-registro@teste.com',
        senhaHash: hashedPassword,
        cpf: '88888888888',
        telefone: '11888888888',
        tipoPerfil: 'TOMADOR'
      }
    })
    
    console.log('✅ Usuário criado com sucesso:', user.id)
    
    // Limpar usuário de teste
    await prisma.usuario.delete({
      where: { id: user.id }
    })
    
    console.log('✅ Usuário de teste removido')
    
  } catch (error) {
    console.error('❌ Erro no registro:', error.message)
    console.error('Detalhes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()
