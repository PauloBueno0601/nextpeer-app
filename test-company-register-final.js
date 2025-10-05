const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.brkpqghnsaydripywndf:bbgnexpeer@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
    }
  }
});

async function testCompanyRegister() {
  try {
    console.log('Testando cadastro de empresa com CPF obrigatório...');
    
    // Dados de teste
    const companyData = {
      razaoSocial: 'Empresa Teste LTDA',
      nomeFantasia: 'Teste Corp',
      cnpj: '98.765.432/0001-10',
      email: 'empresa2@teste.com',
      telefone: '11999999999',
      nomeRepresentante: 'João',
      sobrenomeRepresentante: 'Silva',
      cpfRepresentante: '98765432100', // CPF obrigatório (sem formatação)
      cargoRepresentante: 'Diretor',
      senha: '123456',
      tipoPerfil: 'INVESTOR',
      tipoPessoa: 'JURIDICA'
    };

    // Criar usuário empresa
    const user = await prisma.usuario.create({
      data: {
        nome: companyData.razaoSocial,
        sobrenome: companyData.nomeRepresentante, // Sobrenome obrigatório
        email: companyData.email,
        senhaHash: 'hashed_password_here',
        cpf: companyData.cpfRepresentante, // CPF obrigatório
        cnpj: companyData.cnpj,
        razaoSocial: companyData.razaoSocial,
        nomeFantasia: companyData.nomeFantasia,
        telefone: companyData.telefone,
        tipoPerfil: companyData.tipoPerfil,
        tipoPessoa: 'JURIDICA'
      }
    });

    console.log('✅ Usuário empresa criado com sucesso!');
    console.log('ID:', user.id);
    console.log('Nome:', user.nome);
    console.log('CPF:', user.cpf);
    console.log('CNPJ:', user.cnpj);
    console.log('Tipo Pessoa:', user.tipoPessoa);

    // Criar perfil investidor
    await prisma.perfilInvestidor.create({
      data: {
        usuarioId: user.id
      }
    });

    console.log('✅ Perfil investidor criado com sucesso!');

    // Limpar dados de teste
    await prisma.perfilInvestidor.delete({
      where: { usuarioId: user.id }
    });
    
    await prisma.usuario.delete({
      where: { id: user.id }
    });

    console.log('✅ Dados de teste removidos com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCompanyRegister();
