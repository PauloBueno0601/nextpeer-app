const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function testCompanyRegister() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🧪 Testando registro de empresa...')
    
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const company = await prisma.usuario.create({
      data: {
        nome: 'Tech Solutions LTDA',
        email: 'contato@techsolutions.com',
        senhaHash: hashedPassword,
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Tech Solutions LTDA',
        nomeFantasia: 'Tech Solutions',
        telefone: '11987654321',
        tipoPerfil: 'INVESTOR',
        tipoPessoa: 'JURIDICA',
        cpf: null // Empresa não tem CPF
      }
    })
    
    console.log('✅ Empresa criada:', company.id)
    
    // Criar perfil de investidor
    await prisma.perfilInvestidor.create({
      data: {
        usuarioId: company.id,
        perfilRisco: 'MODERADO'
      }
    })
    
    console.log('✅ Perfil de investidor criado')
    
    // Limpar
    await prisma.perfilInvestidor.delete({
      where: { usuarioId: company.id }
    })
    
    await prisma.usuario.delete({
      where: { id: company.id }
    })
    
    console.log('✅ Empresa removida')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testCompanyRegister()
