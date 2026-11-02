import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, promptToInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running standalone or user closed banner, hide
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      promptToInstall();
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#00A896] to-[#027368] text-white px-3.5 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs z-40 sticky top-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center">
            <img src="/brand/ipet-logo.png" alt="iPet" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs truncate">Instale o Super App iPet</p>
            <p className="text-[10px] text-teal-100 truncate">
              Acesso rápido offline, notificações e entregas 24h
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-teal-200 hover:text-white cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Install Guided Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-sm bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200 text-center space-y-4 text-[#22333B]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E4F6F3] text-[#00A896] mx-auto flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-[#22333B]">
                  Instalar no iPhone / iPad
                </h3>
                <p className="text-xs text-[#6B7A83] mt-1">
                  Adicione o iPet diretamente à tela inicial do seu dispositivo:
                </p>
              </div>

              <div className="space-y-3 text-left text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0">
                    1
                  </div>
                  <p className="flex items-center gap-1">
                    Toque no botão <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-blue-500" /> na barra inferior do Safari.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0">
                    2
                  </div>
                  <p className="flex items-center gap-1">
                    Role e toque em <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3.5 h-3.5 inline text-stone-700" />.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0">
                    3
                  </div>
                  <p>
                    Confirme tocando em <strong>Adicionar</strong> no canto superior direito.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
