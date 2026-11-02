import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Package,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DeliveryMap } from '../../components/map/DeliveryMap';

interface OrdersScreenProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ orders, onReorder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || null);

  const activeOrder = orders.find(
    (o) => o.status === 'out_for_delivery' || o.status === 'picking' || o.status === 'confirmed'
  );

  const currentDisplayOrder = selectedOrder || activeOrder || orders[0];

  const steps: Array<{ status: OrderStatus; label: string; time: string }> = [
    { status: 'confirmed', label: 'Pedido Confirmado', time: '10:10' },
    { status: 'picking', label: 'Separado no Micro-Hub', time: '10:16' },
    { status: 'out_for_delivery', label: 'Entregador em Rota Rápida', time: '10:24' },
    { status: 'delivered', label: 'Entregue na Portaria', time: 'Previsto 10:38' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'picking': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const activeStepIndex = currentDisplayOrder ? getStepIndex(currentDisplayOrder.status) : 2;

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-[#22333B]">Acompanhar Pedidos</h1>
            <p className="text-[11px] text-[#6B7A83]">Rastreamento em tempo real de micro-hubs 24/7</p>
          </div>
          {activeOrder && (
            <span className="text-xs font-bold text-[#00A896] bg-[#E4F6F3] px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00A896]" />
              Em Rota (14 min)
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        {currentDisplayOrder && (
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-stone-200/80 space-y-5">
            {/* Order meta */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#00A896]">
                  {currentDisplayOrder.id}
                </span>
                <p className="text-xs text-[#6B7A83] mt-0.5">
                  Origem: <strong>{currentDisplayOrder.hubName}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#22333B]">
                  R$ {currentDisplayOrder.total.toFixed(2).replace('.', ',')}
                </span>
                <p className="text-[10px] text-[#52B788] font-bold">Frete Grátis iPet Prime</p>
              </div>
            </div>

            {/* Interactive Leaflet Delivery Map (Belém & Ananindeua context) */}
            <DeliveryMap
              orderId={currentDisplayOrder.id}
              courierName={currentDisplayOrder.courierName || 'Rodrigo Mendonça'}
              courierPhone={currentDisplayOrder.courierPhone || '(91) 98124-7790'}
              hubName={currentDisplayOrder.hubName}
              destinationAddress={currentDisplayOrder.address}
              etaMinutes={currentDisplayOrder.etaMinutes || 14}
            />

            {/* Courier Profile & Contact Bar */}
            <div className="p-3.5 rounded-[18px] bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#00A896]/10 border border-[#00A896]/30 flex items-center justify-center font-bold text-base text-[#00A896]">
                  RM
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs sm:text-sm text-[#22333B]">
                      {currentDisplayOrder.courierName || 'Rodrigo Mendonça'}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">
                      ★ 4.9
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7A83]">
                    Entregador Parceiro • Moto Elétrica Eco-Friendly
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${currentDisplayOrder.courierPhone || '11971204491'}`}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 text-[#00A896] hover:bg-[#E4F6F3] flex items-center justify-center transition-colors shadow-xs"
                  title="Ligar para o entregador"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/5511971204491"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#52B788] text-white flex items-center justify-center hover:bg-[#439c73] transition-colors shadow-xs"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83]">
                Progresso da Entrega
              </h4>

              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= activeStepIndex;
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-[#00A896] text-white'
                              : 'bg-stone-200 text-[#6B7A83]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        {idx < steps.length - 1 && (
                          <div
                            className={`w-0.5 h-6 my-1 ${
                              idx < activeStepIndex ? 'bg-[#00A896]' : 'bg-stone-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-[#00A896]' : 'text-[#22333B]'
                            }`}
                          >
                            {step.label}
                          </h5>
                          <span className="text-[11px] font-mono text-[#6B7A83]">
                            {step.time}
                          </span>
                        </div>
                        {isCurrent && (
                          <p className="text-[11px] text-[#6B7A83] mt-0.5">
                            O entregador retirou o pacote lacrado e está a 1.2 km da sua portaria.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items inside this order */}
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold text-[#6B7A83] uppercase mb-2">
                Itens deste Pedido ({currentDisplayOrder.items.length})
              </h4>
              <div className="space-y-2">
                {currentDisplayOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-[#22333B] font-semibold">
                      {item.qty}x {item.product.name}
                    </span>
                    <span className="font-mono text-[#6B7A83]">
                      R$ {(item.product.price * item.qty).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Older Orders History */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base text-[#22333B]">
            Histórico de Pedidos Anteriores
          </h3>

          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className="p-4 bg-white rounded-[20px] border border-stone-200/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#00A896] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#22333B]">{ord.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      ord.status === 'delivered' ? 'bg-[#E8F7F0] text-[#52B788]' : 'bg-[#E4F6F3] text-[#00A896]'
                    }`}>
                      {ord.status === 'delivered' ? 'Entregue' : 'Em Rota'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7A83]">
                    {ord.items.length} itens • {ord.hubName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-[#22333B]">
                  R$ {ord.total.toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(ord);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#FF9F1C] hover:text-white text-xs font-bold text-[#22333B] transition-colors cursor-pointer"
                >
                  Pedir de Novo
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
