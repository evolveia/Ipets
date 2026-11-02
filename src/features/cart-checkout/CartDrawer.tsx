import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, UserAddress } from '../../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutSuccess: (orderData: any) => void;
  userAddress: UserAddress;
  isPrimeUser: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCheckoutSuccess,
  userAddress,
  isPrimeUser,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const deliveryFee = isPrimeUser ? 0 : subtotal > 80 ? 0 : 9.90;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'IPET10' || couponCode.trim().toUpperCase() === 'PRIME') {
      setDiscountAmount(15);
    } else {
      setDiscountAmount(10);
    }
  };

  const handleFinishOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00A896', '#FF9F1C', '#52B788', '#FFD166'],
        });
      } catch (err) {
        // silent fallback
      }

      setIsSubmitting(false);
      setIsCheckingOut(false);
      onCheckoutSuccess({
        id: `PED-${Math.floor(10000 + Math.random() * 90000)}`,
        items: [...items],
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total,
        paymentMethod: paymentMethod === 'pix' ? 'Pix Instantâneo (QR Code)' : 'Cartão de Crédito **** 4092',
        address: `${userAddress.street}, ${userAddress.number} - ${userAddress.neighborhood}`,
        hubName: userAddress.hubName,
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="w-full max-w-md bg-[#FDF8F3] h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#22333B]">
                {isCheckingOut ? 'Finalizar Pedido Express' : 'Cesta de Compras'}
              </h3>
              <p className="text-[11px] text-[#6B7A83]">
                {items.length} {items.length === 1 ? 'item' : 'itens'} no {userAddress.hubName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#6B7A83] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6B7A83]">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-2xl">
                🐾
              </div>
              <h4 className="font-display font-bold text-lg text-[#22333B]">Sua cesta está vazia</h4>
              <p className="text-xs text-[#6B7A83] max-w-xs mt-1 mb-4">
                Explore os Top 100 SKUs essenciais com entrega em até 30 minutos na sua porta.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-[12px] bg-[#00A896] text-white text-xs font-bold cursor-pointer"
              >
                Ver Produtos do Bairro
              </button>
            </div>
          ) : !isCheckingOut ? (
            /* Items List */
            <>
              {isPrimeUser && (
                <div className="p-3 rounded-[16px] bg-[#FFF3E0] border border-[#FF9F1C]/30 flex items-center gap-2.5 text-xs text-[#22333B]">
                  <Sparkles className="w-4 h-4 text-[#FF9F1C] shrink-0" />
                  <span>
                    <strong>iPet Prime ativo:</strong> Você ganhou <strong>Frete Grátis</strong> e R${' '}
                    {(subtotal * 0.05).toFixed(2).replace('.', ',')} de cashback neste pedido!
                  </span>
                </div>
              )}

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-[18px] border border-stone-200/70 shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-[#22333B] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] font-bold text-[#00A896] mt-0.5">
                        R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </p>

                      {/* Quantity row */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQty(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-[#E63946] p-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cupom (ex: IPET10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-[12px] bg-white border border-stone-200 text-xs font-semibold uppercase focus:outline-none focus:border-[#00A896]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[12px] bg-stone-200 hover:bg-stone-300 text-xs font-bold text-[#22333B] cursor-pointer"
                >
                  Aplicar
                </button>
              </form>
            </>
          ) : (
            /* Checkout Step */
            <div className="space-y-4">
              {/* Delivery Address Review */}
              <div className="bg-white p-3.5 rounded-[18px] border border-stone-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase text-[#6B7A83]">
                    Endereço de Entrega
                  </span>
                  <span className="text-[10px] font-bold text-[#00A896] bg-[#E4F6F3] px-2 py-0.5 rounded-full">
                    {userAddress.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#22333B]">
                  {userAddress.street}, {userAddress.number} {userAddress.complement}
                </p>
                <p className="text-[11px] text-[#6B7A83]">
                  {userAddress.neighborhood} · {userAddress.city}
                </p>

                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#00A896]">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Previsão de entrega: 18 - 25 min
                  </span>
                  <span className="font-bold">Rota Expressa</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-3.5 rounded-[18px] border border-stone-200/80">
                <span className="text-[11px] font-bold uppercase text-[#6B7A83] block mb-2">
                  Forma de Pagamento
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-[#00A896] bg-[#E4F6F3]/50 text-[#00A896]'
                        : 'border-stone-200 hover:border-stone-300 text-[#22333B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5" />
                      {paymentMethod === 'pix' && <CheckCircle2 className="w-4 h-4 text-[#00A896]" />}
                    </div>
                    <p className="font-bold text-xs mt-1">Pix Instantâneo</p>
                    <p className="text-[10px] text-[#6B7A83]">Aprovação em 5s</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#00A896] bg-[#E4F6F3]/50 text-[#00A896]'
                        : 'border-stone-200 hover:border-stone-300 text-[#22333B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5" />
                      {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-[#00A896]" />}
                    </div>
                    <p className="font-bold text-xs mt-1">Cartão de Crédito</p>
                    <p className="text-[10px] text-[#6B7A83]">**** 4092</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B7A83]">
                <span>Subtotal</span>
                <span className="font-mono">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-[#6B7A83]">
                <span>Entrega Expressa</span>
                <span className="font-mono">
                  {deliveryFee === 0 ? (
                    <span className="text-[#00A896] font-bold">Grátis (iPet Prime)</span>
                  ) : (
                    `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#52B788] font-semibold">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono">- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#22333B] font-bold text-sm pt-2 border-t border-stone-100">
                <span>Total</span>
                <span className="font-display text-lg text-[#00A896]">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-sm shadow-md shadow-[#FF9F1C]/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>Avançar para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="py-3 px-4 rounded-[14px] bg-stone-100 text-[#6B7A83] text-xs font-bold cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleFinishOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-[14px] bg-[#00A896] hover:bg-[#027368] text-white font-bold text-sm shadow-md shadow-[#00A896]/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirmar Pedido Express</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
