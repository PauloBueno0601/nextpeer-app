const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    // Testar conexão
    await prisma.$connect()
    console.log(' Conexão com banco de dados estabelecida!')
    
    // Testar uma query simples
    const userCount = await prisma.usuario.count()
    console.log(`Total de usuários: ${userCount}`)
    
  } catch (error) {
    console.error(' Erro na conexão:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
