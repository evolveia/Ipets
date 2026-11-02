import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, X, CheckCircle2, Lock, Eye, Database, FileCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F7F0] text-[#52B788] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#22333B]">
                Política de Privacidade & LGPD
              </h3>
              <p className="text-xs text-[#6B7A83]">
                Em conformidade com a Lei Federal nº 13.709/2018 (LGPD)
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#22333B] leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              1. Nosso Compromisso com a sua Privacidade
            </h4>
            <p className="text-stone-600">
              No <strong>iPet Super App</strong>, respeitamos a privacidade dos tutores e a proteção dos dados dos animais de estimação. Todas as informações coletadas são tratadas com sigilo e criptografia de ponta a ponta (AES-256 e HTTPS/TLS).
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              2. Dados Coletados e Finalidade
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>
                <strong>Dados do Tutor:</strong> Nome completo, e-mail, telefone/WhatsApp e endereço de entrega, necessários para faturamento e despacho de mercadorias.
              </li>
              <li>
                <strong>Dados dos Pets (iPet ID):</strong> Nome, raça, espécie, data de nascimento, peso, fotos, número de microchip e registros médicos veterinários.
              </li>
              <li>
                <strong>Geolocalização:</strong> Coletada de forma estrita e consentida apenas para entrega expressa em Belém/Ananindeua e ativação do radar comunitário de busca de pets (raio de 3 km).
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896] flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              3. Compartilhamento e Firebase Cloud Messaging
            </h4>
            <p className="text-stone-600">
              O iPet <strong>jamais comercializa</strong> seus dados pessoais para terceiros. O compartilhamento ocorre apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>Entregadores credenciados (apenas primeiro nome e endereço durante a rota ativa).</li>
              <li>Clínicas e médicos veterinários mediante escaneamento presencial do QR Code do iPet ID.</li>
              <li>Serviço Firebase Cloud Messaging (FCM) para entrega segura de notificações push no seu navegador/aplicativo.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              4. Seus Direitos como Titular (Art. 18 da LGPD)
            </h4>
            <p className="text-stone-600">
              Você tem direito de confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou inexatos, revogar o consentimento de notificações ou solicitar a exclusão definitiva da sua conta a qualquer momento na aba de perfil ou via suporte oficial.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">5. Encarregado de Proteção de Dados (DPO)</h4>
            <p className="text-stone-600">
              Para exercer qualquer direito ou sanar dúvidas relativas à LGPD, entre em contato com nosso DPO através do e-mail <strong>privacidade@ipet.app.br</strong> ou pelo WhatsApp do suporte oficial <strong>(91) 99615-6672</strong>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#52B788] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>LGPD Compliance 100% Ativo</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
