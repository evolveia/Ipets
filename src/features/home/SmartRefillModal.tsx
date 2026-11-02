import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, Product } from '../../types';
import { X, Sparkles, Calendar, Scale, Activity, ArrowRight, CheckCircle2, Bot } from 'lucide-react';

interface SmartRefillModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  suggestedProduct?: Product;
}

export const SmartRefillModal: React.FC<SmartRefillModalProps> = ({
  pet,
  isOpen,
  onClose,
  onAddToCart,
  suggestedProduct,
}) => {
  const [weight, setWeight] = useState(pet.weightKg);
  const [activityLevel, setActivityLevel] = useState<'baixa' | 'moderada' | 'alta'>('moderada');
  const [bagSizeKg, setBagSizeKg] = useState(15);
  const [daysRemaining, setDaysRemaining] = useState(4);
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen) return null;

  // Calculo nutricional baseado em porte e atividade
  const activityMultiplier = activityLevel === 'baixa' ? 0.9 : activityLevel === 'alta' ? 1.25 : 1.0;
  const calculatedDailyGrams = Math.round(
    pet.species === 'gato'
      ? weight * 13 * activityMultiplier
      : (weight < 10 ? weight * 22 : weight < 25 ? weight * 16 : weight * 12.5) * activityMultiplier
  );

  const totalBagDays = Math.round((bagSizeKg * 1000) / calculatedDailyGrams);

  const handleReplenishNow = () => {
    if (suggestedProduct) {
      onAddToCart(suggestedProduct, 1);
      setIsScheduled(true);
      setTimeout(() => {
        setIsScheduled(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200 overflow-hidden relative"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#22333B]">
                Cesta Inteligente iPet (IA)
              </h3>
              <p className="text-[11px] text-[#6B7A83]">
                Previsão de consumo e reposição para {pet.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#6B7A83] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-4">
          {/* Status banner */}
          <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#FFF3E0] to-[#FDF8F3] border border-[#FF9F1C]/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9F1C] text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#22333B]">Status do Saco Atual</span>
                <span className="text-[10px] font-bold text-[#E63946] bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                  Restam ~{daysRemaining} dias
                </span>
              </div>
              <p className="text-[11px] text-[#6B7A83] mt-0.5">
                Com base no consumo diário de {calculatedDailyGrams}g, a ração de {pet.name} acabará na próxima quinta-feira!
              </p>
            </div>
          </div>

          {/* Interactive Calculation Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 p-3 rounded-[16px] border border-stone-200/70">
              <label className="text-[10px] font-bold uppercase text-[#6B7A83] block mb-1">
                Peso Atual ({pet.name})
              </label>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#00A896]" />
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 1)}
                  className="w-full bg-white px-2 py-1 rounded-lg border border-stone-200 text-xs font-mono font-bold text-[#22333B]"
                />
                <span className="text-xs text-[#6B7A83]">kg</span>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-[16px] border border-stone-200/70">
              <label className="text-[10px] font-bold uppercase text-[#6B7A83] block mb-1">
                Nível de Atividade
              </label>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#FF9F1C]" />
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="w-full bg-white px-2 py-1 rounded-lg border border-stone-200 text-xs font-bold text-[#22333B]"
                >
                  <option value="baixa">Baixa (Passeios curtos)</option>
                  <option value="moderada">Moderada (1 a 2h diárias)</option>
                  <option value="alta">Alta (Muito ativo/Esporte)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculated Nutrition Card */}
          <div className="bg-[#E4F6F3]/60 p-3.5 rounded-[18px] border border-[#00A896]/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B7A83] font-semibold">Dosagem Diária Recomendada:</span>
              <span className="font-display font-extrabold text-base text-[#00A896]">
                {calculatedDailyGrams} g / dia
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-[#00A896]/20">
              <span className="text-[#6B7A83]">Duração de um saco de 15kg:</span>
              <span className="font-mono font-bold text-[#22333B]">{totalBagDays} dias</span>
            </div>
          </div>

          {/* Suggested Item */}
          {suggestedProduct && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-[16px] border border-stone-200">
              <img
                src={suggestedProduct.imageUrl}
                alt={suggestedProduct.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#00A896] uppercase">Ração Cadastrada</p>
                <h5 className="text-xs font-bold text-[#22333B] truncate">{suggestedProduct.name}</h5>
                <p className="text-xs font-bold text-[#22333B]">
                  R$ {suggestedProduct.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-[14px] bg-stone-100 hover:bg-stone-200 text-[#6B7A83] text-xs font-bold cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={handleReplenishNow}
            className="flex-1 py-3 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FF9F1C]/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            {isScheduled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Adicionado à Cesta!</span>
              </>
            ) : (
              <>
                <span>Repor Agora (Entrega em 24 min)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
