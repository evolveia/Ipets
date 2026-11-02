import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../brand/Logo';
import { Sparkles, ArrowRight, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const pillars = [
    {
      icon: Zap,
      title: 'Quick Commerce 24/7',
      desc: 'Top 100 SKUs dos Pet shops mais próximos entregues em até 25 min.',
    },
    {
      icon: ShieldCheck,
      title: 'iPet ID Digital',
      desc: 'Passaporte único com vacinas, exames e QR Code para veterinários.',
    },
    {
      icon: HeartHandshake,
      title: 'Rede SOS + Protect',
      desc: 'Radar comunitário geolocalizado de 3 km e microchipagem com cobertura médica.',
    },
  ];

  // Progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 4;
        if (next > 33 && next <= 66) setActiveStep(1);
        if (next > 66) setActiveStep(2);
        return next > 100 ? 100 : next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Automatically lead to landing page when loading completes
  useEffect(() => {
    if (progress >= 100) {
      const autoNav = setTimeout(() => {
        onComplete();
      }, 450);
      return () => clearTimeout(autoNav);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 text-[#22333B] overflow-hidden"
    >
      {/* Background Image: Pessoas brincando com seus pets em um parque ensolarado e verdejante */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1920&q=85"
          alt="Pessoas brincando alegremente com seus pets em parque ensolarado"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
        />
        {/* Subtle, soft transparent vignette overlay that leaves people and pets visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
      </div>

      {/* Top bar */}
      <div className="w-full flex items-center justify-between max-w-md pt-2 z-10">
        <span className="text-[12px] font-bold text-[#00A896] tracking-wider uppercase flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#00A896] animate-ping" />
          iPet Super App
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-white/90 hover:text-white transition-colors py-1.5 px-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 cursor-pointer shadow-md"
        >
          Pular introdução
        </button>
      </div>

      {/* Main Logo & Hero Animation Card */}
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-md text-center z-10 py-2">
        {/* Logo Card with frosted glass effect */}
        <div className="relative mb-4 bg-white/95 backdrop-blur-md p-5 rounded-[28px] shadow-2xl border border-white/60">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-3 rounded-[32px] bg-gradient-to-r from-[#00A896]/30 to-[#FF9F1C]/35 blur-xl -z-10"
          />

          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size="xl" showTagline={false} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md text-center"
        >
          Ração, saúde e segurança <br />
          <span className="text-[#52B788] drop-shadow-sm">em minutos para o seu pet</span>
        </motion.h1>

        {/* Animated Pillar Feature Card */}
        <div className="w-full mt-2 h-24 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-md rounded-[22px] p-4 border border-white/80 shadow-xl flex items-center gap-3.5 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E4F6F3] text-[#00A896] flex items-center justify-center shrink-0 shadow-xs">
                {React.createElement(pillars[activeStep].icon, { className: 'w-6 h-6' })}
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-bold text-sm text-[#22333B]">
                  {pillars[activeStep].title}
                </h4>
                <p className="text-xs text-[#6B7A83] leading-snug">
                  {pillars[activeStep].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress & Walking Paw Prints Card */}
      <div className="w-full max-w-md pb-4 flex flex-col gap-3 z-10 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-[24px] border border-white/80 shadow-2xl">
        {/* Progress track */}
        <div className="relative w-full h-3 bg-stone-200/90 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00A896] via-[#2ec4b6] to-[#FF9F1C] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />

          {/* Walking paw indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-2 text-[#22333B] transition-all duration-75"
            style={{ left: `${Math.min(progress, 96)}%` }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.35 }}
              className="w-4 h-4 text-white drop-shadow"
            >
              🐾
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B7A83]">
          <span className="flex items-center gap-1.5 text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C] shrink-0" />
            <span className="truncate">Carregando informações dos Pet shops mais próximo de você</span>
          </span>
          <span className="font-mono font-bold text-[#00A896] shrink-0 ml-2">{progress}%</span>
        </div>

        {/* Status notice when 100% or button fallback */}
        <div className="text-center pt-0.5">
          {progress >= 100 ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold text-[#00A896] flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#00A896] animate-ping" />
              <span>Concluído! Abrindo Landing Page iPet...</span>
            </motion.div>
          ) : (
            <span className="text-[10px] text-stone-400">
              Conectando aos micro-hubs 24h em Belém & Ananindeua
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
