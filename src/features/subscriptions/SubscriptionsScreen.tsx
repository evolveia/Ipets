import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, Pet } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface SubscriptionsScreenProps {
  user: UserProfile;
  activePet: Pet;
  onSubscribePrime: () => void;
  onSubscribeProtect: () => void;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({
  user,
  activePet,
  onSubscribePrime,
  onSubscribeProtect,
}) => {
  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-[#22333B]">
              Assinaturas & Proteção
            </h1>
            <p className="text-[11px] text-[#6B7A83]">
              Planos iPet Prime, iPet Protect e status do microchip
            </p>
          </div>
          <span className="text-xs font-bold text-[#FF9F1C] bg-[#FFF3E0] px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Tutor Prime
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        {/* Microchip ISO Status Card */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#22333B]">
                  Status do Microchip ISO ({activePet.name})
                </h3>
                <p className="text-[11px] text-[#6B7A83]">Padrão Internacional ISO 11784/11785</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#52B788] bg-[#E8F7F0] px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Implantado
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6B7A83] block">
                Código do Microchip
              </span>
              <span className="font-mono font-bold text-[#00A896]">
                {activePet.microchipCode || '981098102345892'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6B7A83] block">
                Clínica Credenciada
              </span>
              <span className="font-semibold text-[#22333B]">Hospital VetCare 24h</span>
            </div>
          </div>

          <p className="text-xs text-[#6B7A83] leading-relaxed">
            O microchip de {activePet.name} está vinculado diretamente ao seu passaporte digital 
            <strong> iPet ID</strong>. Em caso de perda, qualquer leitor em clínicas ou centros de zoonoses 
            localiza o tutor instantaneamente.
          </p>
        </div>

        {/* Plan Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* iPet Prime */}
          <div className="bg-white rounded-[24px] p-5 border-2 border-[#FF9F1C] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-[#22333B]">iPet Prime</h3>
                <span className="text-[10px] font-bold uppercase bg-[#FF9F1C] text-white px-2 py-0.5 rounded-full">
                  Plano Ativo
                </span>
              </div>
              <p className="text-xs text-[#6B7A83]">Economia máxima em rações e entregas rápidas.</p>

              <div className="my-4 flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#6B7A83]">R$</span>
                <span className="font-display text-3xl font-black text-[#22333B]">24,90</span>
                <span className="text-xs font-semibold text-[#6B7A83]">/mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#22333B]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  <strong>Frete Grátis ilimitado</strong> em todos os pedidos acima de R$ 49
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  <strong>5% de Cashback</strong> automático em rações
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  Cesta Inteligente com cálculo de reposição
                </li>
              </ul>
            </div>

            <button
              onClick={onSubscribePrime}
              className="w-full mt-5 py-3 rounded-[14px] bg-[#FFF3E0] text-[#FF9F1C] font-bold text-xs cursor-pointer hover:bg-[#ffe6c2] transition-colors"
            >
              Gerenciar Assinatura Prime
            </button>
          </div>

          {/* iPet Protect */}
          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-[#22333B]">iPet Protect</h3>
                <span className="text-[10px] font-bold uppercase bg-[#00A896] text-white px-2 py-0.5 rounded-full">
                  Plano Ativo
                </span>
              </div>
              <p className="text-xs text-[#6B7A83]">Proteção de emergência veterinária e microchip.</p>

              <div className="my-4 flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#6B7A83]">R$</span>
                <span className="font-display text-3xl font-black text-[#22333B]">49,90</span>
                <span className="text-xs font-semibold text-[#6B7A83]">/mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#22333B]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  <strong>Microchip ISO gratuito</strong> com implantação em clínica
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  <strong>Teleorientação 24h</strong> ilimitada por chat/vídeo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                  Cobertura emergencial de até <strong>R$ 2.000/ano</strong>
                </li>
              </ul>
            </div>

            <button
              onClick={onSubscribeProtect}
              className="w-full mt-5 py-3 rounded-[14px] bg-[#E4F6F3] text-[#00A896] font-bold text-xs cursor-pointer hover:bg-teal-100 transition-colors"
            >
              Gerenciar Cobertura Médica
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
