// Usando fetch nativo do Node.js

async function testCompanyRegistration() {
  try {
    console.log('Testando cadastro de empresa via API...');
    
    const response = await fetch('http://localhost:3001/api/auth/register-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razaoSocial: 'Empresa Teste API',
        nomeFantasia: 'Teste API Corp',
        cnpj: '22.333.444/0001-55',
        email: 'empresa-api3@teste.com',
        telefone: '11999999999',
        nomeRepresentante: 'João',
        sobrenomeRepresentante: 'Silva',
        cpfRepresentante: '222.333.444-55',
        cargoRepresentante: 'Diretor',
        senha: '123456',
        tipoPerfil: 'INVESTOR',
        tipoPessoa: 'JURIDICA'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Cadastro de empresa realizado com sucesso!');
      console.log('Resposta:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Erro no cadastro de empresa:');
      console.log('Status:', response.status);
      console.log('Resposta:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testCompanyRegistration();
