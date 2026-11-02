import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Pet } from '../../types';
import {
  MessageCircle,
  X,
  Send,
  Phone,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activePet: Pet;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionWhatsApp?: boolean;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  user,
  activePet,
}) => {
  const WHATSAPP_NUMBER = '91996156672';
  const WHATSAPP_DISPLAY = '(91) 99615-6672';
  const [protocol] = useState(`IPET-${Math.floor(100000 + Math.random() * 900000)}`);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Dúvida Geral');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Olá, ${user.name}! 🐾 Sou o iPet Assistente 24h. Estou aqui para cuidar de você e do(a) seu pet ${activePet.name}.\n\nSelecione um tópico rápido abaixo ou digite sua mensagem. Ao final, você pode encaminhar todo o histórico com 1 clique para o WhatsApp oficial do nosso time humano: ${WHATSAPP_DISPLAY}.`,
      timestamp: 'Agora',
    },
  ]);

  const quickTopics = [
    { label: '🚚 Atraso ou status de entrega', topic: 'Entrega de Pedido' },
    { label: '🚨 Pet Desaparecido / SOS Urgente', topic: 'Alerta SOS Urgente' },
    { label: '💉 Microchip & Passaporte iPet ID', topic: 'Microchip e iPet ID' },
    { label: '💳 Assinatura iPet Prime & Protect', topic: 'Assinatura e Cobrança' },
    { label: '👨‍⚕️ Falar com Atendente Humano', topic: 'Atendimento Humano' },
  ];

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const generateWhatsAppLink = (customNote?: string) => {
    const defaultAddress = user.addresses[0]
      ? `${user.addresses[0].street}, ${user.addresses[0].number} - ${user.addresses[0].neighborhood}, ${user.addresses[0].city}`
      : 'Belém / Ananindeua - PA';

    const lastUserMsg = customNote || messages.filter((m) => m.sender === 'user').pop()?.text || 'Solicitação de suporte via Super App';

    const text = `🐾 *SUPORTE iPET 24H — ATENDIMENTO* 🐾
📋 *Protocolo:* #${protocol}
👤 *Tutor:* ${user.name}
📱 *Telefone:* ${user.phone}
🐶 *Pet Ativo:* ${activePet.name} (${activePet.species === 'cao' ? 'Cão' : 'Gato'} • ${activePet.breed})
📍 *Endereço:* ${defaultAddress}
🏷️ *Assunto:* ${selectedTopic}
💬 *Relato:* "${lastUserMsg}"
⏱️ *Data/Hora:* ${new Date().toLocaleString('pt-BR')}

_Enviado automaticamente pelo Super App iPet._`;

    return `https://wa.me/55${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Agora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Automated bot reasoning
    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('entrega') || lower.includes('pedido') || lower.includes('atraso')) {
        setSelectedTopic('Entrega de Pedido 24h');
        botReply = `Entendi! Nosso micro-hub parceiro na sua região (Doca ou Ananindeua BR-316) está monitorando sua entrega com entregadores de prontidão. Já gerei seu protocolo #${protocol}. Clique no botão verde abaixo para enviar os dados para nosso operador no WhatsApp ${WHATSAPP_DISPLAY}.`;
      } else if (lower.includes('sos') || lower.includes('desaparecido') || lower.includes('fugiu') || lower.includes('perdido')) {
        setSelectedTopic('Emergência SOS Pet');
        botReply = `🚨 Prioridade Máxima de SOS! Recomendamos emitir o Alerta no menu 'iPet SOS' imediatamente para disparar o radar no raio de 3 km. Já deixei as informações prontas para envio prioritário no WhatsApp ${WHATSAPP_DISPLAY}.`;
      } else if (lower.includes('microchip') || lower.includes('vacina') || lower.includes('id') || lower.includes('qr code')) {
        setSelectedTopic('iPet ID e Microchip');
        botReply = `Perfeito! O ${activePet.name} possui passaporte digital. A inserção e leitura de microchips homologados é realizada em nossa rede de clínicas veterinárias credenciadas em Belém e Ananindeua. Posso direcionar para o agendamento?`;
      } else {
        botReply = `Compreendido! Registrei sua solicitação sob o protocolo #${protocol}. Para prosseguir com o atendimento personalizado em tempo real, encaminhe essas informações para o nosso suporte oficial no WhatsApp.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: 'Agora',
          actionWhatsApp: true,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl border border-stone-200 flex flex-col h-[600px] max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[#00A896] text-white flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#52B788] border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#22333B]">
                  Chatbot & Suporte 24h
                </h3>
                <span className="text-[10px] font-bold text-[#00A896] bg-[#E4F6F3] px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-[#6B7A83]">
                Protocolo: <strong className="text-[#22333B]">#{protocol}</strong> • WhatsApp {WHATSAPP_DISPLAY}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Topics Pills */}
        <div className="px-4 py-2.5 bg-stone-50/50 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickTopics.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedTopic(item.topic);
                handleSendMessage(item.label);
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-[11px] font-bold text-[#22333B] whitespace-nowrap cursor-pointer transition-colors shrink-0 shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF7F2]/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-[#00A896] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#00A896] text-white rounded-br-xs'
                    : 'bg-white text-[#22333B] border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[9px] text-right font-medium ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </span>

                {msg.actionWhatsApp && (
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <p className="text-[10px] text-stone-500 font-medium">
                      Encaminhar dados e protocolo para o atendimento humano:
                    </p>
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#52B788] hover:bg-[#439c73] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 no-underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Mandar Informações para o {WHATSAPP_DISPLAY}</span>
                    </a>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#FF9F1C] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Floating Quick Action: Direct Call & Direct WhatsApp */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[11px] text-stone-600 font-semibold">
              Central Belém & Ananindeua
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#00A896] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Ligar</span>
            </a>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#52B788] hover:bg-[#439c73] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Oficial</span>
            </a>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua dúvida ou relato aqui..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-hidden focus:border-[#00A896]"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] disabled:opacity-40 text-white cursor-pointer transition-transform active:scale-95 shrink-0"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
