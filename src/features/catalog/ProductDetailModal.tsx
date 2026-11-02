import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Pet } from '../../types';
import { X, Star, ShieldCheck, Plus, Minus, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  activePet: Pet;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  activePet,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  const isMatchedWithPet =
    (product.targetPet === 'ambos') ||
    (activePet.species === 'cao' && product.targetPet === 'cao') ||
    (activePet.species === 'gato' && product.targetPet === 'gato');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="bg-white w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header image area */}
          <div className="relative h-64 bg-stone-100 shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FF9F1C] text-white text-[11px] font-bold shadow-md">
                {product.badge}
              </span>
            )}

            {product.isTop100 && (
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-[#00A896] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Top 100 SKU #{product.top100Rank}
              </span>
            )}
          </div>

          {/* Product content */}
          <div className="p-6 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7A83] mb-1">
                <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {product.rating.toFixed(1)} ({product.reviewsCount} avaliações)
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#22333B] leading-snug">
                {product.name}
              </h3>
            </div>

            {/* Smart Pet Compatibility Tag */}
            {isMatchedWithPet ? (
              <div className="p-3 rounded-[16px] bg-[#E4F6F3] border border-[#00A896]/30 flex items-center gap-2.5 text-xs text-[#00A896]">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  <strong>Compatível com {activePet.name}</strong> ({activePet.breed}). Nutrição e peso adequados.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-[16px] bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>
                  Atenção: este item é voltado para outra espécie/porte. Verifique antes de adicionar para {activePet.name}.
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#6B7A83] leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div>
                <p className="text-[11px] font-semibold text-[#6B7A83]">Preço no Micro-Hub 24/7</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black text-[#22333B]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#6B7A83] line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-stone-100 rounded-xl p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-[#22333B] flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm w-4 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-[#22333B] flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-stone-50 border-t border-stone-200/80">
            <button
              onClick={handleAdd}
              className={`w-full py-3.5 rounded-[14px] font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                addedAnimation
                  ? 'bg-[#52B788] scale-98'
                  : 'bg-[#FF9F1C] hover:bg-[#F08B07] shadow-[#FF9F1C]/25'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {addedAnimation
                  ? 'Adicionado à Cesta!'
                  : `Adicionar à Cesta • R$ ${(product.price * qty).toFixed(2).replace('.', ',')}`}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
