# NexPeer - Plataforma de Empréstimos P2P

Uma plataforma de empréstimos peer-to-peer desenvolvida com Next.js 14, TypeScript e Prisma.
Acesse a aplicação através do link: http://nextpeer-app.vercel.app

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: JWT personalizado
- **UI**: Radix UI, Shadcn/ui

##  Funcionalidades

-  Cadastro de usuários individuais
-  Cadastro de empresas
-  Sistema de autenticação
-  Dashboard para investidores e tomadores
-  Análise de crédito
-  Sistema de contratos
-  Verificação de identidade

##  Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   DATABASE_URL="sua_url_do_banco"
   JWT_SECRET="seu_jwt_secret"
   ```

4. Execute as migrações:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

##  Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── borrower/          # Páginas do tomador
│   ├── investor/          # Páginas do investidor
│   └── company/           # Páginas da empresa
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── hooks/                 # Custom hooks
└── types/                 # Definições TypeScript
```

##  Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run start` - Inicia o servidor de produção
- `npx prisma studio` - Abre o Prisma Studio

##  Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM. O schema está definido em `prisma/schema.prisma`.

### Principais Tabelas:
- `usuarios` - Usuários do sistema
- `emprestimos` - Solicitações de empréstimo
- `investimentos` - Investimentos realizados
- `contratos_ccb` - Contratos CCB
- `perfil_tomador` - Perfil do tomador
- `perfil_investidor` - Perfil do investidor

##  Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no servidor
2. Execute `npm run build`
3. Inicie com `npm run start`

##  Licença

Este projeto está sob a licença MIT.

## Documentação
Para acessar a documentação completa da aplicação, acesse o arquivo DOCUMENTACAO_HACKATHON.md, localizado dentro na pasta ```docs``` deste repositório.
