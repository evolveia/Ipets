import React from 'react';
import { motion } from 'motion/react';
import { FileText, X, CheckCircle2, Shield } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 rounded-2xl bg-[#E4F6F3] text-[#00A896] flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#22333B]">
                Termos de Uso da Plataforma
              </h3>
              <p className="text-xs text-[#6B7A83]">
                iPet Tecnologia e Comércio Pet Ltda. • Última atualização: 2026
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
            <h4 className="font-bold text-sm text-[#00A896]">1. Objeto e Definições</h4>
            <p className="text-stone-600">
              A plataforma <strong>iPet</strong> é um super app de intermediação de Quick Commerce 24/7, gestão de passaporte digital de saúde animal (<strong>iPet ID</strong>) e rede comunitária de proteção e resgate animal (<strong>iPet SOS + Protect</strong>), com operações centralizadas na Região Metropolitana de Belém e Ananindeua - PA.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">2. Quick Commerce e Micro-Hubs 24/7</h4>
            <p className="text-stone-600">
              O catálogo reúne os Top 100 SKUs de maior giro em nutrição, farmácia e higiene veterinária. Os pedidos são separados e despachados por micro-hubs de bairro cadastrados (pet shops e atacarejos credenciados). O prazo de entrega estimado exibido no mapa de rastreamento é calculado dinamicamente de acordo com tráfego e condições climáticas locais.
            </p>
            <p className="text-stone-600">
              O <em>Modo Emergência Noturno</em> (20h às 08h) prioriza medicamentos de urgência, antialérgicos, rações terapêuticas e itens de primeiros socorros para animais em situação de vulnerabilidade.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">3. Passaporte Digital iPet ID e Microchipagem</h4>
            <p className="text-stone-600">
              O tutor é o único responsável pela veracidade dos dados médicos, certificados de vacinas e fotos inseridos no perfil do pet. O QR Code permite que clínicas e médicos veterinários com CRMV ativo visualizem o histórico de saúde para agilizar diagnósticos emergenciais.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">4. Rede Comunitária iPet SOS</h4>
            <p className="text-stone-600">
              Ao emitir um alerta de pet desaparecido, o tutor autoriza a exibição da foto, nome do pet, último endereço visto e telefone de contato para a comunidade de tutores e clínicas parceiras no raio configurado (1 a 5 km). É expressamente proibido o uso da ferramenta para emitir alertas falsos ou trotes, sob pena de suspensão imediata da conta e responsabilização cível.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">5. Assinaturas Recorrentes e Cancelamento</h4>
            <p className="text-stone-600">
              Os planos <strong>iPet Prime</strong> (frete grátis ilimitado e cashback) e <strong>iPet Protect</strong> (inserção subsidiada de microchip e teleorientação veterinária) são renovados automaticamente a cada 30 dias. O cancelamento pode ser efetuado a qualquer momento no perfil do usuário, sem multas ou taxas rescisórias.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#00A896]">6. Foro e Legislação Aplicável</h4>
            <p className="text-stone-600">
              Estes termos são regidos pelas leis da República Federativa do Brasil e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990). Fica eleito o Foro da Comarca de Belém, Estado do Pará, para dirimir eventuais controvérsias.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#52B788] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Documento Válido e Registrado</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Entendido e Concordo
          </button>
        </div>
      </motion.div>
    </div>
  );
};
