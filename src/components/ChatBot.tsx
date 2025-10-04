'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, ShieldAlert, TrendingUp, Banknote, Lightbulb, Lock, Percent } from 'lucide-react';

// Tipagem para as mensagens do chat
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isThemeSelection?: boolean;
  isQuestionSelection?: boolean;
  theme?: string;
}

// Tipagem para as props do componente (apenas className, opcional)
interface ChatBotProps {
  className?: string;
}

// ESTRUTURA DE TEMAS E PERGUNTAS
const THEMES = {
  'inadimplencia': {
    title: 'Inadimplência',
    icon: ShieldAlert,
    questions: [
      {
        question: "O que acontece se o tomador não pagar?",
        answer: "Proteção Total contra Inadimplência:\n\n1. Seguro Garantido: 100% do valor investido protegido por seguro\n2. Fundo de Reserva: 5% de cada empréstimo vai para fundo de proteção\n3. Recuperação Ativa: Parceiros especializados em cobrança\n4. Garantias Reais: Alguns empréstimos têm garantias (imóveis, veículos)\n5. Diversificação: Sistema recomenda espalhar investimentos\n6. Transparência: Relatórios mensais sobre recuperação\n\n Seu dinheiro está sempre protegido!"
      },
      {
        question: "E se o tomador sumir ou não conseguir pagar?",
        answer: "Cenários de Inadimplência Cobertos:\n\nCenário 1 - Atraso Temporário:\n• Cobrança amigável por 30 dias\n• Juros de mora: 1% ao mês\n• Negociação de parcelas\n\nCenário 2 - Inadimplência Total:\n• Ativação do seguro em 60 dias\n• Recuperação via parceiros especializados\n• Seu investimento é 100% reembolsado\n\nCenário 3 - Falência/Divórcio:\n• Seguro cobre 100% do valor\n• Processo de recuperação continua\n• Você não perde nada!"
      },
      {
        question: "Como funciona o seguro contra inadimplência?",
        answer: "Seguro NexPeer - Proteção Total:\n\nCobertura:\n• 100% do valor investido + juros\n• Ativação automática em 60 dias de atraso\n• Sem burocracias ou comprovações\n\nComo Funciona:\n1. Tomador atrasa pagamento\n2. Sistema tenta recuperação por 60 dias\n3. Seguro é ativado automaticamente\n4. Você recebe 100% do valor em 5 dias úteis\n\nCusto: Já incluído na taxa do empréstimo - você não paga nada extra!"
      }
    ]
  },
  'investimentos': {
    title: 'Investimentos',
    icon: TrendingUp,
    questions: [
      {
        question: "Como calcular meu retorno de investimento?",
        answer: "Calculadora de Retorno NexPeer:\n\nFórmula Simples:\n• Investimento: R$ 1.000\n• Taxa: 2% ao mês\n• Prazo: 12 meses\n• Retorno Total: R$ 1.268\n• Lucro: R$ 268 (26,8% ao ano)\n\nComparação com Poupança:\n• Poupança: 6% ao ano\n• NexPeer: 26,8% ao ano\n• Diferença: 4,5x mais lucro!\n\nDica: Diversifique em vários empréstimos para reduzir riscos!"
      },
      {
        question: "Qual o mínimo para investir?",
        answer: "Investimento Mínimo NexPeer:\n\nValor Mínimo: R$ 100\nRecomendado: R$ 1.000+\n\nPor que R$ 100?\n• Democratização do investimento\n• Permite diversificação\n• Teste sem grandes riscos\n• Acesso para todos\n\nEstratégia Recomendada:\n• Comece com R$ 500-1.000\n• Diversifique em 5-10 empréstimos\n• Reinvesta os retornos\n• Acompanhe mensalmente\n\nSeu dinheiro trabalhando para você!"
      },
      {
        question: "Como diversificar meus investimentos?",
        answer: "Estratégia de Diversificação NexPeer:\n\nRegra dos 5:\n• Máximo 20% em um empréstimo\n• Mínimo 5 empréstimos diferentes\n• Misture perfis de risco (A, B, C)\n• Diferentes prazos (6, 12, 24 meses)\n• Setores diversos (pessoal, negócios)\n\nExemplo Prático:\n• R$ 1.000 total\n• 5 empréstimos de R$ 200 cada\n• 2 risco A, 2 risco B, 1 risco C\n• Prazos variados\n\nResultado: Risco reduzido, retorno garantido!"
      }
    ]
  },
  'emprestimos': {
    title: 'Empréstimos',
    icon: Banknote,
    questions: [
      {
        question: "Como solicitar um empréstimo?",
        answer: "Solicitação de Empréstimo NexPeer:\n\nPasso a Passo:\n1. Cadastro (2 minutos)\n2. Preenchimento do perfil financeiro\n3. Upload de documentos\n4. Análise automática (24h)\n5. Aprovação e condições\n6. Assinatura digital\n7. Dinheiro na conta em 1 dia útil\n\nValores: R$ 500 a R$ 50.000\nPrazos: 6 a 36 meses\nTaxas: 18% a 42% ao ano\n\nVantagens:\n• Sem burocracias\n• Aprovação rápida\n• Taxas justas\n• Transparência total\n\nSeu crédito aprovado em 24h!"
      },
      {
        question: "Quais documentos preciso enviar?",
        answer: "Documentos Necessários:\n\nObrigatórios:\n• RG ou CNH (frente e verso)\n• CPF\n• Comprovante de renda (3 últimos meses)\n• Comprovante de residência\n• Extrato bancário (3 meses)\n\nOpcionais (melhoram aprovação):\n• Holerite\n• Declaração de IR\n• Contrato de trabalho\n• Comprovante de outros rendimentos\n\nDica: Quanto mais documentos, maior chance de aprovação e melhores condições!"
      }
    ]
  },
  'conceitos': {
    title: 'Conceitos',
    icon: Lightbulb,
    questions: [
      {
        question: "O que é P2P Lending?",
        answer: "P2P Lending (Peer-to-Peer):\n\nConceito: Empréstimos diretos entre pessoas, sem bancos intermediários\n\nVantagens:\n• Taxas melhores para tomadores\n• Retornos maiores para investidores\n• Processo 100% digital\n• Transparência total\n\nComo Funciona:\n1. Tomador solicita empréstimo\n2. Investidores escolhem onde investir\n3. Plataforma conecta as partes\n4. Contrato digital é assinado\n5. Dinheiro vai direto para tomador\n\nÉ o futuro do crédito!"
      },
      {
        question: "Qual a diferença entre P2P e banco tradicional?",
        answer: "P2P vs Banco Tradicional:\n\nBANCO TRADICIONAL:\n• Taxas altas (15-25% ao ano)\n• Processo burocrático\n• Aprovação demorada\n• Spread bancário alto\n• Pouca transparência\n\nP2P NEXPEER:\n• Taxas justas (18-42% ao ano)\n• Aprovação em 24h\n• Processo 100% digital\n• Transparência total\n• Retornos melhores para investidores\n\nResultado: Todos ganham mais!"
      },
      {
        question: "O que é análise de crédito?",
        answer: "Análise de Crédito NexPeer:\n\nDados Analisados:\n• Renda e capacidade de pagamento\n• Histórico de crédito (SPC/Serasa)\n• Dados comportamentais digitais\n• Verificação de identidade\n• Análise de padrão de gastos\n\nClassificação de Risco:\n• A: Excelente (1,5% ao mês)\n• B: Bom (2,0% ao mês)\n• C: Regular (2,5% ao mês)\n• D: Alto (3,0% ao mês)\n• E: Muito Alto (3,5% ao mês)\n\nResultado: Aprovação inteligente e justa!"
      }
    ]
  },
  'seguranca': {
    title: 'Segurança',
    icon: Lock,
    questions: [
      {
        question: "É seguro investir no NexPeer?",
        answer: "Segurança Total NexPeer:\n\nRegulamentação:\n• Autorizado pelo Banco Central\n• Compliance com LGPD\n• Auditoria independente\n• Seguro contra inadimplência\n\nTecnologia:\n• Blockchain para transparência\n• Criptografia de ponta\n• Dados protegidos\n• Backup em nuvem\n\nTransparência:\n• Relatórios mensais\n• Auditoria pública\n• Histórico completo\n• Suporte 24/7\n\nSeu dinheiro 100% protegido!"
      },
      {
        question: "O que acontece se a NexPeer fechar?",
        answer: "Plano de Contingência NexPeer:\n\nProteções Garantidas:\n• Seguro Independente: Cobertura mesmo se fecharmos\n• Fundo de Reserva: 5% de cada empréstimo separado\n• Auditoria Externa: Controle independente\n• Regulamentação: Banco Central supervisiona\n\nSe Fecharmos (cenário improvável):\n• Todos os contratos continuam válidos\n• Seguro continua ativo\n• Recuperação de crédito continua\n• Investidores recebem normalmente\n\nGarantia: Seu dinheiro está sempre protegido!"
      }
    ]
  },
  'taxas': {
    title: 'Taxas e Custos',
    icon: Percent,
    questions: [
      {
        question: "Quais são as taxas de juros?",
        answer: "Taxas NexPeer - Transparentes e Justas:\n\nPara Tomadores:\n• Risco A: 18% ao ano (1,5% ao mês)\n• Risco B: 24% ao ano (2,0% ao mês)\n• Risco C: 30% ao ano (2,5% ao mês)\n• Risco D: 36% ao ano (3,0% ao mês)\n• Risco E: 42% ao ano (3,5% ao mês)\n\nPara Investidores:\n• Taxa de administração: 1% ao ano\n• Sem taxas ocultas\n• Sem IOF\n• Transparência total\n\nComparação:\n• Cartão de crédito: 300%+ ao ano\n• Cheque especial: 200%+ ao ano\n• NexPeer: 18-42% ao ano\n\nAs melhores taxas do mercado!"
      },
      {
        question: "Há taxas ocultas?",
        answer: "Zero Taxas Ocultas NexPeer:\n\nO que você paga:\n• Taxa de juros (divulgada)\n• IOF (obrigatório por lei)\n• Taxa de administração (1% ao ano)\n\nO que você NÃO paga:\n• Taxa de abertura\n• Taxa de análise\n• Taxa de manutenção\n• Taxa de antecipação\n• Taxa de renegociação\n• Taxa de consulta\n\nTransparência Total:\n• Simulador online\n• Contrato claro\n• Sem surpresas\n• Suporte para dúvidas\n\nHonestidade é nosso diferencial!"
      }
    ]
  }
};


export default function ChatBot({ className }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Ello, assistente virtual do NexPeer. Escolha um tema para começar:',
      isUser: false,
      timestamp: new Date(),
      isThemeSelection: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // >>> INÍCIO DA LÓGICA DO CHAT (SEU CÓDIGO) <<<
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showThemeSelection = () => {
    const themeMessage: Message = {
      id: Date.now().toString(),
      text: 'Escolha um tema para continuar:',
      isUser: false,
      timestamp: new Date(),
      isThemeSelection: true
    };
    setMessages(prev => [...prev, themeMessage]);
    setCurrentTheme(null);
  };
  
  const handleThemeSelection = (themeKey: string) => {
    const theme = THEMES[themeKey as keyof typeof THEMES];
    if (!theme) return;

    const themeMessage: Message = {
      id: Date.now().toString(),
      text: `Você escolheu: ${theme.title}\n\nEscolha uma pergunta:`,
      isUser: false,
      timestamp: new Date(),
      isQuestionSelection: true,
      theme: themeKey
    };
    
    setMessages(prev => [...prev, themeMessage]);
    setCurrentTheme(themeKey);
  };

  const handleQuestionSelection = (questionIndex: number) => {
    if (!currentTheme) return;
    
    const theme = THEMES[currentTheme as keyof typeof THEMES];
    if (!theme || !theme.questions[questionIndex]) return;

    const question = theme.questions[questionIndex];
    
    const answerMessage: Message = {
      id: Date.now().toString(),
      text: question.answer,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, answerMessage]);
    
    setTimeout(() => {
      showThemeSelection();
    }, 1000);
  };

  const handleUnknownInput = () => {
    const unknownMessage: Message = {
      id: Date.now().toString(),
      text: "Desculpe, não entendi sua pergunta. Vou mostrar os temas disponíveis novamente:",
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, unknownMessage]);
    
    setTimeout(() => {
      showThemeSelection();
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      handleUnknownInput();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // >>> FIM DA LÓGICA DO CHAT <<<



  return (
    <div className={`chatbot-container ${className}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="chatbot-button"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="chatbot-window">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Ello - Assistente NexPeer</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!message.isUser && <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />}
                    <div className="flex-1">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {message.text}
                      </div>
                    </div>
                    {message.isUser && <User className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Theme Selection */}
          {messages[messages.length - 1]?.isThemeSelection && (
            <div className="p-2 border-t bg-muted/30">
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(THEMES).map(([key, theme]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="text-xs h-12 px-1 hover:bg-primary hover:text-primary-foreground flex flex-col items-center justify-center gap-1"
                    onClick={() => handleThemeSelection(key)}
                  >
                    <theme.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs leading-tight text-center">{theme.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Question Selection */}
          {messages[messages.length - 1]?.isQuestionSelection && currentTheme && (
            <div className="p-2 border-t bg-muted/30">
              <div className="space-y-1">
                {THEMES[currentTheme as keyof typeof THEMES]?.questions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-auto p-2 hover:bg-primary hover:text-primary-foreground text-left justify-start"
                    onClick={() => handleQuestionSelection(index)}
                  >
                    {question.question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}