# NexPeer - Documentação Completa 

##  Visão Geral

**NexPeer** é uma plataforma de empréstimos P2P (peer-to-peer) que democratiza o acesso ao crédito através de tecnologia de ponta. Conectamos diretamente tomadores (CPF e CNPJ) e investidores, criando um ecossistema de crédito mais justo, transparente e eficiente.

###  Proposta de Valor

- **Democratização do Crédito**: Acesso amplo para pessoas físicas e pequenos negócios
- **Transparência Total**: Score dinâmico baseado em dados reais do Open Finance
- **Segurança Avançada**: Autenticação biométrica e contratos em blockchain
- **Eficiência Digital**: Processo 100% digital com aprovação em 24h

---

##  Stack Tecnológica

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface baseados em Radix UI
- **Lucide React** - Ícones modernos

### Backend
- **Next.js API Routes** - API REST integrada
- **Prisma ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados principal (Supabase)
- **bcryptjs** - Criptografia de senhas
- **JWT** - Autenticação por tokens

### Integrações e Serviços
- **Supabase** - Banco de dados PostgreSQL em nuvem
- **PDF-lib** - Geração de contratos em PDF
- **React-PDF** - Renderização de documentos
- **Vercel Analytics** - Análise de performance

### Segurança e Compliance
- **Autenticação Biométrica** - Verificação facial simulada
- **Blockchain** - Hash de contratos para imutabilidade
- **Open Finance** - Análise de dados financeiros em tempo real
- **LGPD** - Conformidade com proteção de dados

---

##  Arquitetura do Sistema

### Estrutura de Dados (Prisma Schema)

```sql
-- Usuários (Pessoas Físicas e Jurídicas)
usuarios
├── id (PK)
├── email (unique)
├── cpf (unique)
├── cnpj (unique, para empresas)
├── tipoPerfil (TOMADOR/INVESTOR)
├── statusKyc (pendente/aprovado/rejeitado)
└── dados biométricos

-- Perfis Específicos
perfil_tomador
├── scoreCredito
├── limiteCredito
└── openFinanceFake (JSON)

perfil_investidor
├── rendaMensal
├── patrimonioTotal
├── perfilRisco
└── limiteInvestimento

-- Empréstimos e Investimentos
emprestimos
├── tomadorId (FK)
├── valorSolicitado
├── valorAprovado
├── taxaJuros
├── status (PENDENTE/FINANCIADO/QUITADO)
└── parcelas[]

investimentos
├── emprestimoId (FK)
├── investidorId (FK)
├── valorInvestido
└── status

-- Contratos e Blockchain
contratos_ccb
├── hashContrato (blockchain)
├── pdfUrl
├── assinadoTomador
├── assinadoInvestidor
└── executadoEm

-- Sistema de Pagamentos
parcelas
├── dataVencimento
├── valorParcela
├── status (pendente/pago/atrasado)
└── repasses[]

repasses
├── valorRepassado
├── taxaPlataforma
└── dataRepassado
```

---

##  Fluxo Completo da Aplicação

### 1. **Onboarding e Autenticação**

#### Para Tomadores (CPF)
1. **Cadastro Inicial**
   - Dados pessoais (nome, CPF, email, telefone)
   - Definição de senha segura
   - Tipo de perfil: TOMADOR

2. **Verificação Biométrica**
   - Captura de foto do usuário
   - Validação de documento (RG)
   - Simulação de autenticação facial
   - Status KYC: pendente → aprovado

3. **Análise de Crédito**
   - Integração com Open Finance (simulada)
   - Cálculo de score dinâmico
   - Definição de limite de crédito

#### Para Investidores
1. **Cadastro e Perfil de Risco**
   - Dados pessoais ou empresariais
   - Questionário de perfil de risco
   - Definição de tolerância ao risco
   - Limite de investimento

#### Para Empresas (CNPJ)
1. **Cadastro Empresarial**
   - Dados da empresa (razão social, CNPJ)
   - Dados do representante legal
   - Tipo de pessoa: JURIDICA
   - Perfil: TOMADOR ou INVESTOR

### 2. **Sistema de Scoring Dinâmico**

#### Algoritmo de Análise de Crédito
```typescript
// Fatores Positivos (+pontos)
- Fluxo de caixa positivo (+150)
- Capacidade de poupança/investimento (+100)
- Renda estável (salário) (+50)
- Pagamento integral da fatura (+50)

// Fatores Negativos (-pontos)
- Fluxo de caixa negativo (-150)
- Uso de cheque especial (-200)
- Pagamento parcial da fatura (-250)
- Saldo negativo (-100)

// Score Final: 300-950 pontos
```

#### Classificação de Risco
- **A (Excelente)**: 800-950 pontos → 1,5% ao mês
- **B (Bom)**: 700-799 pontos → 2,0% ao mês
- **C (Regular)**: 600-699 pontos → 2,5% ao mês
- **D (Alto)**: 500-599 pontos → 3,0% ao mês
- **E (Muito Alto)**: 300-499 pontos → 3,5% ao mês

### 3. **Fluxo de Empréstimo**

#### Para Tomadores
1. **Solicitação de Empréstimo**
   - Valor solicitado
   - Finalidade do empréstimo
   - Prazo em meses
   - Taxa de juros (baseada no score)

2. **Análise Automática**
   - Verificação de score atual
   - Validação de limite de crédito
   - Aprovação/rejeição automática

3. **Disponibilização no Marketplace**
   - Empréstimo fica visível para investidores
   - Status: PENDENTE

#### Para Investidores
1. **Marketplace de Oportunidades**
   - Lista de empréstimos disponíveis
   - Informações do tomador (anonimizadas)
   - Score de crédito e análise de risco
   - Detalhes financeiros

2. **Análise de Investimento**
   - Perfil de risco do investidor
   - Compatibilidade com o empréstimo
   - Cálculo de retorno esperado

3. **Realização do Investimento**
   - Confirmação do valor
   - Criação do contrato CCB
   - Assinatura digital

### 4. **Sistema de Contratos e Blockchain**

#### Geração de Contrato CCB
1. **Criação do Documento**
   - Dados do tomador e investidor
   - Condições do empréstimo
   - Cláusulas contratuais
   - Geração de PDF

2. **Registro em Blockchain**
   - Hash do contrato
   - Timestamp de criação
   - Endereço do smart contract
   - Imutabilidade garantida

3. **Assinatura Digital**
   - Assinatura do tomador
   - Assinatura do investidor
   - Validação biométrica
   - Execução do contrato

### 5. **Sistema de Pagamentos**

#### Gestão de Parcelas
1. **Criação Automática**
   - Cálculo de parcelas mensais
   - Datas de vencimento
   - Valores com juros

2. **Controle de Pagamentos**
   - Status: pendente/pago/atrasado
   - Notificações automáticas
   - Histórico de pagamentos

3. **Repasses para Investidores**
   - Cálculo de repasse proporcional
   - Taxa da plataforma
   - Transferência automática

---

##  Principais Funcionalidades

### Dashboard do Tomador
- **Visão Geral**: Empréstimos ativos, parcelas pendentes
- **Solicitar Empréstimo**: Formulário simplificado
- **Análise de Crédito**: Score atual e histórico
- **Meus Empréstimos**: Histórico completo
- **Perfil**: Dados pessoais e financeiros

### Dashboard do Investidor
- **Portfólio**: Investimentos ativos e retornos
- **Oportunidades**: Marketplace de empréstimos
- **Análise de Risco**: Perfil e compatibilidade
- **Relatórios**: Performance e métricas
- **Contratos**: Documentos assinados

### Dashboard da Empresa
- **Visão Empresarial**: Métricas específicas para CNPJ
- **Gestão de Empréstimos**: Para empresas tomadoras
- **Investimentos Corporativos**: Para empresas investidoras
- **Relatórios Financeiros**: Análise de performance

### Sistema de Notificações
- **Empréstimo Aprovado**: Confirmação de financiamento
- **Vencimento de Parcela**: Lembretes de pagamento
- **Novas Oportunidades**: Para investidores
- **Atualizações de Score**: Mudanças no perfil de crédito

### Chatbot "Ello"
- **Suporte 24/7**: Assistente virtual inteligente
- **Temas Disponíveis**:
  - Inadimplência e recuperação
  - Conceitos de P2P Lending
  - Segurança e compliance
  - Dúvidas sobre investimentos
  - Suporte técnico

---

## 🔌 APIs e Endpoints

### Autenticação
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/register-company
```

### Empréstimos
```
GET  /api/loans              # Listar empréstimos do usuário
POST /api/loans              # Criar novo empréstimo
POST /api/borrower/submit-loan  # Submeter empréstimo
```

### Investimentos
```
GET  /api/investments                    # Listar investimentos
POST /api/investments                    # Realizar investimento
GET  /api/investments/opportunities      # Oportunidades disponíveis
```

### Contratos
```
GET  /api/contracts/[id]           # Detalhes do contrato
GET  /api/contracts/[id]/pdf        # Download do PDF
POST /api/investor/contract        # Assinar contrato
```

### Dashboard e Métricas
```
GET  /api/dashboard/metrics        # Métricas gerais
GET  /api/user/profile            # Perfil do usuário
GET  /api/notifications           # Notificações
```

### Análise de Crédito
```
POST /api/credit-analysis         # Análise de score
GET  /api/investor/risk-profile   # Perfil de risco
POST /api/investor/submit-profile # Salvar perfil
```

---

##  Segurança e Compliance

### Autenticação Biométrica
- **Verificação Facial**: Simulação de reconhecimento
- **Validação de Documento**: RG/CNH com OCR
- **Prevenção de Fraude**: Detecção de tentativas de falsificação

### Proteção de Dados (LGPD)
- **Criptografia**: Senhas com bcrypt
- **Anonimização**: Dados sensíveis protegidos
- **Auditoria**: Logs de todas as ações
- **Consentimento**: Termos de uso e privacidade

### Blockchain e Imutabilidade
- **Hash de Contratos**: SHA-256 para cada CCB
- **Timestamp**: Registro temporal
- **Smart Contracts**: Execução automática
- **Transparência**: Auditoria pública

---

##  Métricas e Analytics

### KPIs Principais
- **Volume de Empréstimos**: Total financiado
- **Taxa de Aprovação**: % de empréstimos aprovados
- **Inadimplência**: % de atrasos e defaults
- **Retorno Médio**: ROI para investidores
- **Satisfação**: NPS dos usuários

### Dashboards Específicos
- **Tomadores**: Score, limite, histórico
- **Investidores**: Portfólio, retornos, risco
- **Empresas**: Métricas corporativas
- **Admin**: Visão geral da plataforma

---

## Demonstração Prática

### Cenários de Teste

#### 1. **Tomador - Ana Silva (Score Alto)**
- **Perfil**: Funcionária CLT, renda estável
- **Score**: 850 pontos (Classe A)
- **Empréstimo**: R$ 15.000 para reforma
- **Taxa**: 1,5% ao mês (18% ao ano)
- **Resultado**: Aprovação imediata

#### 2. **Tomador - Carlos Santos (Score Médio)**
- **Perfil**: Autônomo, renda variável
- **Score**: 650 pontos (Classe C)
- **Empréstimo**: R$ 8.000 para capital de giro
- **Taxa**: 2,5% ao mês (30% ao ano)
- **Resultado**: Aprovação com taxa maior

#### 3. **Investidor - Maria Investidora**
- **Perfil**: Conservador, R$ 50.000 para investir
- **Estratégia**: Diversificação em múltiplos empréstimos
- **Retorno Esperado**: 18-24% ao ano
- **Risco**: Baixo a moderado

### Fluxo de Demonstração

1. **Acesso à Plataforma**
   - URL: [Link do deploy]
   - Login com perfis pré-configurados
   - Navegação intuitiva

2. **Jornada do Tomador**
   - Solicitar empréstimo
   - Análise de crédito em tempo real
   - Aprovação automática
   - Acompanhamento no dashboard

3. **Jornada do Investidor**
   - Análise de perfil de risco
   - Marketplace de oportunidades
   - Análise detalhada de cada empréstimo
   - Realização de investimento

4. **Sistema de Contratos**
   - Geração automática de CCB
   - Assinatura digital
   - Registro em blockchain
   - Download do PDF

5. **Gestão de Pagamentos**
   - Criação de parcelas
   - Controle de vencimentos
   - Repasses automáticos
   - Relatórios de performance

---

##  Diferenciais Competitivos

### 1. **Score Dinâmico vs Score Tradicional**
- **Tradicional**: Baseado apenas no passado
- **NexPeer**: Análise em tempo real do comportamento
- **Resultado**: Aprovação de bons pagadores ignorados pelo sistema

### 2. **Segurança Biométrica**
- **Prevenção de Fraude**: Identidade verificada
- **Compliance**: Conformidade com regulamentações
- **Confiança**: Ambiente seguro para todos

### 3. **Blockchain e Transparência**
- **Imutabilidade**: Contratos invioláveis
- **Auditoria**: Transparência total
- **Confiança**: Investidores seguros

### 4. **Acesso Amplo**
- **CPF e CNPJ**: Pessoas e empresas
- **Score Justo**: Análise comportamental
- **Taxas Competitivas**: Melhor que bancos tradicionais

---

##  Modelo de Negócio e Monetização

###  Estratégia de Receita

#### 1. **Taxa de Intermediação (Principal)**
- **Taxa sobre Empréstimos**: 2-5% do valor total do empréstimo
- **Taxa sobre Investimentos**: 1-3% do valor investido
- **Taxa de Originação**: Cobrada na aprovação do empréstimo
- **Receita Recorrente**: A cada nova transação na plataforma

#### 2. **Taxa de Performance para Investidores**
- **Taxa de Sucesso**: 0,5-1% sobre retornos obtidos
- **Taxa de Gestão**: 0,25% ao ano sobre patrimônio investido
- **Taxa de Resgate Antecipado**: 1% sobre valor resgatado

#### 3. **Serviços Premium**
- **Análise de Crédito Avançada**: R$ 29,90 por análise
- **Consultoria Financeira**: R$ 99,90 por sessão
- **Relatórios Personalizados**: R$ 19,90 por relatório
- **API para Terceiros**: R$ 0,10 por consulta


### 💡 Fontes de Receita Detalhadas

#### **1. Taxa de Originação (60% da receita)**
```
Exemplo Prático:
- Empréstimo: R$ 10.000
- Taxa NexPeer: 3% = R$ 300
- Valor para tomador: R$ 9.700
- Receita da plataforma: R$ 300
```

###  Modelo de Parcerias

#### **Parcerias Estratégicas**
- **Bancos Digitais**: Integração com Open Finance
- **Fintechs**: White-label da plataforma
- **Corporações**: Soluções B2B para funcionários

#### **Receita de Parcerias**
- **Taxa de Integração**: R$ 10.000 por parceiro
- **Revenue Share**: 20% da receita do parceiro
- **Licenciamento**: R$ 50.000 por implementação

###  Métricas de Monetização

#### **KPIs Financeiros**
- **ARPU (Average Revenue Per User)**: R$ 50/mês
- **LTV (Lifetime Value)**: R$ 1.200 por usuário
- **CAC (Customer Acquisition Cost)**: R$ 100
- **Payback Period**: 2,4 meses

#### **Eficiência Operacional**
- **Margem Bruta**: 85%
- **Margem Operacional**: 40%
- **ROI**: 300% em 3 anos
- **Break-even**: 18 meses

###  Oportunidades de Expansão

#### **Novos Produtos**
- **Cartão de Crédito NexPeer**: Taxa de intermediação
- **Conta Digital**: Taxa de transação
- **Seguros**: Comissão sobre vendas
- **Investimentos**: Taxa de gestão

#### **Mercados Adjacentes**
- **Consórcios P2P**: Nova categoria de produto
- **Financiamento Imobiliário**: Mercado de R$ 200 bi
- **Crédito Rural**: Agricultura e pecuária
- **Exportação**: Comércio exterior

###  Diferenciais de Monetização

#### **vs Bancos Tradicionais**
- **Menor Spread**: Taxas mais justas
- **Maior Volume**: Mais transações
- **Eficiência**: Menos intermediários

#### **vs Fintechs Concorrentes**
- **Tecnologia Superior**: IA e blockchain
- **Segurança**: Biometria avançada
- **Transparência**: Dados abertos

#### **vs Plataformas P2P**
- **Score Dinâmico**: Análise em tempo real
- **Compliance**: Total conformidade
- **Escalabilidade**: Arquitetura robusta

---

##  Impacto e Benefícios

### Para Tomadores
- **Acesso ao Crédito**: Democratização do financiamento
- **Taxas Justas**: Melhores condições que bancos
- **Processo Rápido**: Aprovação em 24h
- **Transparência**: Score explicado e justo

### Para Investidores
- **Retornos Maiores**: 18-24% ao ano
- **Diversificação**: Múltiplos empréstimos
- **Transparência**: Análise detalhada de risco
- **Liquidez**: Controle total dos investimentos

### Para o Mercado
- **Inovação**: Tecnologia disruptiva
- **Inclusão**: Acesso amplo ao crédito
- **Eficiência**: Redução de intermediários
- **Transparência**: Dados abertos e auditáveis

---

## Roadmap Futuro

### Fase 1 (Atual)
- ✅ Plataforma MVP
- ✅ Sistema de scoring
- ✅ Contratos digitais
- ✅ Blockchain básico

### Fase 2 
- 🔄 Integração real com Open Finance
- 🔄 Autenticação biométrica real
- 🔄 Smart contracts completos
- 🔄 App mobile nativo

### Fase 3 
- 🔄 IA para análise de risco
- 🔄 Marketplace secundário
- 🔄 Produtos financeiros avançados
- 🔄 Expansão internacional

---

##  Contato e Suporte

### Links Úteis
* **Repositório no GitHub:** https://github.com/PauloBueno0601/nextpeer-app
* **Apresentação de Slides:** [Canva](https://www.canva.com/design/DAG05XMxLCk/uyqRZEqmb42vLjTyc9zbRQ/edit?utm_content=DAG05XMxLCk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- **Deploy**: https://nextpeer-app.vercel.app/

### Suporte Técnico
- **Chatbot Ello**: Disponível 24/7 na plataforma
- **Email**: suporte@nexpeer.com
- **Documentação**: Completa no repositório

---

##  Conclusão

O **NexPeer** representa uma revolução no mercado de crédito brasileiro, combinando tecnologia de ponta com uma proposta de valor clara: democratizar o acesso ao crédito justo e transparente.

### Principais Conquistas
-  **Tecnologia Completa**: Stack moderna e robusta
-  **Segurança Avançada**: Biometria e blockchain
-  **Experiência Superior**: UX/UI excepcional
-  **Compliance Total**: LGPD e regulamentações
-  **Escalabilidade**: Arquitetura preparada para crescimento

### Próximos Passos
1. **Validação de Mercado**: Testes com usuários reais
2. **Parcerias Estratégicas**: Bancos e fintechs
3. **Regulamentação**: Aprovação do Banco Central
4. **Expansão**: Mercado nacional e internacional

**NexPeer**: A camada de confiança para o crédito descentralizado! 
