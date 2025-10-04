#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configuração Rápida - NexPeer');
console.log('================================');

// 1. Verificar se .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env.local...');
  
  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="nexpeer-jwt-secret-key-2024"

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env.local criado!');
} else {
  console.log('✅ Arquivo .env.local já existe');
}

// 2. Alterar schema para SQLite
console.log('🔧 Configurando SQLite...');
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Substituir PostgreSQL por SQLite
schemaContent = schemaContent.replace(
  'provider = "postgresql"',
  'provider = "sqlite"'
);
schemaContent = schemaContent.replace(
  'url      = env("DATABASE_URL")',
  'url      = "file:./dev.db"'
);

// Remover @db.Decimal
schemaContent = schemaContent.replace(/@db\.Decimal\(\d+,\s*\d+\)/g, '');

fs.writeFileSync(schemaPath, schemaContent);
console.log('✅ Schema configurado para SQLite');

// 3. Executar migrações
console.log('🗄️ Executando migrações...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Migrações executadas!');
} catch (error) {
  console.log('⚠️ Erro nas migrações, tentando db push...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Banco criado com db push!');
  } catch (pushError) {
    console.log('❌ Erro ao criar banco:', pushError.message);
    process.exit(1);
  }
}

// 4. Executar seed
console.log('🌱 Executando seed de dados...');
try {
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  console.log('✅ Dados de demonstração criados!');
} catch (error) {
  console.log('❌ Erro no seed:', error.message);
}

console.log('');
console.log('🎉 CONFIGURAÇÃO CONCLUÍDA!');
console.log('');
console.log('📊 Dados de teste:');
console.log('   Tomador: ana@nexpeer.com / 123456');
console.log('   Investidor: maria@nexpeer.com / 123456');
console.log('');
console.log('🚀 Para iniciar: npm run dev');
console.log('🌐 Acesse: http://localhost:3001');
