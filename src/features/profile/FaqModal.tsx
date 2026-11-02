import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  X,
  MessageCircle,
  Package,
  ShieldAlert,
  QrCode,
  Sparkles,
  CreditCard,
  Phone
} from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupport: () => void;
}

interface FaqItem {
  id: string;
  category: 'delivery' | 'id' | 'sos' | 'prime' | 'payment';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    category: 'delivery',
    question: 'Qual o prazo de entrega em Belém e Ananindeua?',
    answer: 'Nossos micro-hubs parceiros (Doca, Batista Campos e BR-316 em Ananindeua) operam com entregas expressas de 15 a 35 minutos para os Top 100 SKUs mais pedidos. Você pode acompanhar a rota em tempo real no mapa!',
  },
  {
    id: 'f2',
    category: 'delivery',
    question: 'Como funciona o Modo Emergência Noturno (20h às 08h)?',
    answer: 'Durante a madrugada, a interface filtra automaticamente apenas itens essenciais: farmácia veterinária, rações de alta necessidade, antialérgicos, curativos e antipulgas, com atendimento ininterrupto na Região Metropolitana.',
  },
  {
    id: 'f3',
    category: 'id',
    question: 'O que é o iPet ID e como veterinários acessam?',
    answer: 'O iPet ID é o passaporte digital unificado do seu pet. Cada pet possui um QR Code único. Ao ser escaneado por um veterinário ou clínica credenciada, exibe instantaneamente a carteira de vacinação, alergias, peso, microchip e contato de emergência do tutor.',
  },
  {
    id: 'f4',
    category: 'id',
    question: 'Posso cadastrar mais de um pet na mesma conta?',
    answer: 'Sim! Você pode cadastrar quantos cães e gatos desejar. Cada um tem seu perfil individual, fotos, documentos e acompanhamento de consumo de ração.',
  },
  {
    id: 'f5',
    category: 'sos',
    question: 'Como funciona o Radar iPet SOS de 3km?',
    answer: 'Se o pet desaparecer, você aciona o botão "Emitir Alerta SOS". O sistema dispara notificações push instantâneas via Firebase para todos os tutores e clínicas parceiras no raio de 3 km (com coordenadas geolocalizadas em Belém e Ananindeua). Quem avistar o pet pode enviar fotos e ligar para você.',
  },
  {
    id: 'f6',
    category: 'prime',
    question: 'O que está incluso na assinatura iPet Prime?',
    answer: 'O iPet Prime oferece frete grátis ilimitado 24/7 sem valor mínimo de pedido, 10% de cashback em compras no app e mimos surpresa mensais para o seu pet. Custa R$ 29,90/mês e pode ser cancelado a qualquer momento.',
  },
  {
    id: 'f7',
    category: 'prime',
    question: 'Qual a diferença entre iPet Prime e iPet Protect?',
    answer: 'O Prime foca em entregas grátis e vantagens no marketplace. O iPet Protect inclui a inserção subsidiada de microchip homologado, teleorientação veterinária 24h e cobertura de pronto atendimento de emergência.',
  },
  {
    id: 'f8',
    category: 'payment',
    question: 'Quais as formas de pagamento aceitas?',
    answer: 'Aceitamos PIX com confirmação em tempo real e desconto de 5%, além de cartões de crédito (Visa, Mastercard, Elo) com parcelamento em até 6x sem juros.',
  },
];

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onOpenSupport }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('f1');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'delivery', label: 'Entregas 24h' },
    { id: 'id', label: 'iPet ID' },
    { id: 'sos', label: 'SOS Radar' },
    { id: 'prime', label: 'Assinaturas' },
    { id: 'payment', label: 'Pagamentos' },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#22333B]">
                Perguntas Frequentes (FAQ)
              </h3>
              <p className="text-xs text-[#6B7A83]">
                Tire dúvidas rápidas sobre o Super App iPet
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

        {/* Search Bar */}
        <div className="p-4 border-b border-stone-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquise por dúvidas (entrega, microchip, SOS...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-hidden focus:border-[#00A896]"
            />
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#00A896] text-white shadow-2xs'
                    : 'bg-stone-100 text-[#6B7A83] hover:text-[#22333B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-stone-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-xs">Nenhuma resposta encontrada para "{search}".</p>
              <button
                onClick={onOpenSupport}
                className="text-xs font-bold text-[#00A896] underline cursor-pointer"
              >
                Falar com o Suporte 24h
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-100/60 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#22333B]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6B7A83] transition-transform duration-200 shrink-0 ${
                        isExpanded ? 'rotate-180 text-[#00A896]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3.5 pb-3.5 pt-1 text-xs text-[#6B7A83] leading-relaxed border-t border-stone-100/80 bg-white"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Banner */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#22333B]">Ainda precisa de ajuda?</p>
            <p className="text-[11px] text-[#6B7A83]">Fale com nosso Chatbot e atendentes</p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenSupport();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chatbot & Suporte 24h</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
