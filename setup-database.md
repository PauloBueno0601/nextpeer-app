# 🚀 Configuração do Banco de Dados - NexPeer

## ⚠️ **PROBLEMA IDENTIFICADO**
O Prisma está com erro de permissão no Windows. Vamos resolver isso.

## 🔧 **SOLUÇÕES (Escolha uma):**

### **OPÇÃO 1: Supabase (RECOMENDADO para Hackathon)**
```bash
# 1. Criar projeto no Supabase (supabase.com)
# 2. Copiar a DATABASE_URL do projeto
# 3. Criar arquivo .env.local com:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="seu-jwt-secret-aqui"

# 4. Executar migrações
npx prisma db push
npx prisma generate

# 5. Executar seed
node prisma/seed.js
```

### **OPÇÃO 2: PostgreSQL Local**
```bash
# 1. Instalar PostgreSQL
# 2. Criar banco 'nextpeer'
# 3. Configurar .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextpeer"

# 4. Executar migrações
npx prisma migrate dev
npx prisma generate

# 5. Executar seed
node prisma/seed.js
```

### **OPÇÃO 3: SQLite (Mais simples)**
```bash
# 1. Alterar schema.prisma:
# datasource db {
#   provider = "sqlite"
#   url      = "file:./dev.db"
# }

# 2. Executar
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
```

## 🎯 **PRÓXIMOS PASSOS APÓS CONFIGURAR BANCO:**

1. **Testar aplicação**: `npm run dev`
2. **Verificar login**: Usar credenciais do seed
3. **Testar fluxos**: Empréstimos e investimentos
4. **Polir UX**: Loading states e error handling

## 📊 **DADOS DE TESTE (após seed):**
- **Tomador**: ana@nexpeer.com / 123456
- **Investidor**: maria@nexpeer.com / 123456
- **Empréstimos**: 2 empréstimos de exemplo
- **Investimentos**: 1 investimento ativo
