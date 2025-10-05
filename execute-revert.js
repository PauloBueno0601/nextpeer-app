const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.brkpqghnsaydripywndf:bbgnexpeer@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
});

async function executeRevert() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados');
    
    // Executar o script SQL
    const fs = require('fs');
    const sql = fs.readFileSync('revert-cpf-constraint.sql', 'utf8');
    
    await client.query(sql);
    console.log('CPF revertido para obrigatório com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.end();
  }
}

executeRevert();
