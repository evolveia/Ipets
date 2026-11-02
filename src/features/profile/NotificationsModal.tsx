import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Radio,
  Package,
  ShieldAlert,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  getPushPermissionStatus,
  requestPushPermission,
  getStoredFcmToken,
  sendOrderStatusPush,
  sendSosAlertPush,
  sendRefillReminderPush,
  PushPermissionStatus,
} from '../../services/firebase/push';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [permission, setPermission] = useState<PushPermissionStatus>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Notification category toggles
  const [orderPushEnabled, setOrderPushEnabled] = useState(true);
  const [sosPushEnabled, setSosPushEnabled] = useState(true);
  const [refillPushEnabled, setRefillPushEnabled] = useState(true);
  const [promoPushEnabled, setPromoPushEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getPushPermissionStatus());
      setFcmToken(getStoredFcmToken());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const result = await requestPushPermission();
    setIsRequesting(false);
    setPermission(result.status);
    setFcmToken(result.token);

    if (result.status === 'granted') {
      onShowToast('🔔 Notificações Push & FCM ativadas com sucesso!');
    } else if (result.status === 'denied') {
      onShowToast('⚠️ Permissão de notificações bloqueada no navegador.');
    }
  };

  const handleCopyToken = () => {
    if (!fcmToken) return;
    navigator.clipboard.writeText(fcmToken);
    setIsCopied(true);
    onShowToast('Token FCM copiado para a área de transferência!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTestOrderPush = () => {
    const success = sendOrderStatusPush('PED-98214', 'Entregador Rodrigo saiu para entrega na Av. Nazaré', 14);
    if (success) {
      onShowToast('🔔 Push de Pedido disparado via Firebase/Web Push!');
    } else {
      onShowToast('⚠️ Ative as notificações no botão acima para testar.');
    }
  };

  const handleTestSosPush = () => {
    const success = sendSosAlertPush('Bento (Pug)', 'Batista Campos / Belém', 1.8);
    if (success) {
      onShowToast('🚨 Push de Alerta SOS disparado via Firebase/Web Push!');
    } else {
      onShowToast('⚠️ Ative as notificações no botão acima para testar.');
    }
  };

  const handleTestRefillPush = () => {
    const success = sendRefillReminderPush('Pipoca', 4);
    if (success) {
      onShowToast('🍽️ Push de Reposição disparado com sucesso!');
    } else {
      onShowToast('⚠️ Ative as notificações no botão acima para testar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F6F3] text-[#00A896] flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#22333B]">
                Central de Notificações
              </h3>
              <p className="text-xs text-[#6B7A83]">
                Firebase Cloud Messaging (FCM) & Alertas
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Permission Status Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#6B7A83]">
                Status da Permissão Push
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  permission === 'granted'
                    ? 'bg-[#E8F7F0] text-[#52B788]'
                    : permission === 'denied'
                    ? 'bg-[#FDE8E9] text-[#E63946]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {permission === 'granted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {permission === 'denied' && <AlertCircle className="w-3.5 h-3.5" />}
                {permission === 'granted'
                  ? 'Ativado (Concedida)'
                  : permission === 'denied'
                  ? 'Bloqueado no Navegador'
                  : 'Pendente / Não solicitado'}
              </span>
            </div>

            <p className="text-xs text-[#6B7A83] leading-relaxed">
              O iPet utiliza o <strong>Firebase Cloud Messaging (FCM)</strong> para avisar em tempo real quando o entregador sair para a sua casa e quando pets forem avistados no raio de 3km.
            </p>

            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>{isRequesting ? 'Solicitando...' : 'Habilitar Notificações em Tempo Real'}</span>
              </button>
            )}

            {/* FCM Token Display */}
            {fcmToken && (
              <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-600">Dispositivo Registrado (FCM Token):</span>
                  <button
                    onClick={handleCopyToken}
                    className="text-[#00A896] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#52B788]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-white border border-stone-200 font-mono text-[10px] text-stone-600 truncate">
                  {fcmToken}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Push Simulation Tests */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83]">
              Testar Notificações em Tempo Real (FCM)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleTestOrderPush}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#00A896] hover:bg-[#E4F6F3]/30 text-left cursor-pointer transition-colors shadow-2xs space-y-1"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#22333B]">Status Pedido</p>
                <p className="text-[10px] text-[#6B7A83]">Entregador em rota</p>
              </button>

              <button
                onClick={handleTestSosPush}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#E63946] hover:bg-[#FDE8E9]/30 text-left cursor-pointer transition-colors shadow-2xs space-y-1"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FDE8E9] text-[#E63946] flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#22333B]">Radar SOS 3km</p>
                <p className="text-[10px] text-[#6B7A83]">Pet avistado</p>
              </button>

              <button
                onClick={handleTestRefillPush}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#FF9F1C] hover:bg-[#FFF3E0]/30 text-left cursor-pointer transition-colors shadow-2xs space-y-1"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FFF3E0] text-[#FF9F1C] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#22333B]">Reposição Ração</p>
                <p className="text-[10px] text-[#6B7A83]">Resta ~4 dias</p>
              </button>
            </div>
          </div>

          {/* Preferences Toggles */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83]">
              Preferências de Alerta
            </h4>

            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 text-xs">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#22333B]">Rastreamento de Pedidos 24h</p>
                  <p className="text-[11px] text-[#6B7A83]">Saída do micro-hub e chegada na portaria</p>
                </div>
                <button
                  onClick={() => setOrderPushEnabled(!orderPushEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    orderPushEnabled ? 'bg-[#00A896]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      orderPushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#22333B]">Radar Comunitário SOS (3 km)</p>
                  <p className="text-[11px] text-[#6B7A83]">Avisos de pets desaparecidos no seu bairro</p>
                </div>
                <button
                  onClick={() => setSosPushEnabled(!sosPushEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    sosPushEnabled ? 'bg-[#E63946]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      sosPushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#22333B]">Cesta Inteligente de Reposição</p>
                  <p className="text-[11px] text-[#6B7A83]">Lembrete preditivo antes da ração acabar</p>
                </div>
                <button
                  onClick={() => setRefillPushEnabled(!refillPushEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    refillPushEnabled ? 'bg-[#00A896]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      refillPushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#22333B]">Promoções & Cashback Prime</p>
                  <p className="text-[11px] text-[#6B7A83]">Ofertas relâmpago de micro-hubs parceiros</p>
                </div>
                <button
                  onClick={() => setPromoPushEnabled(!promoPushEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    promoPushEnabled ? 'bg-[#00A896]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      promoPushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Salvar Preferências
          </button>
        </div>
      </motion.div>
    </div>
  );
};
