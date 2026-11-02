import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/brand/Logo';
import {
  Zap,
  ShieldCheck,
  Radio,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Moon,
  LogIn
} from 'lucide-react';

interface LandingPageProps {
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Nazaré (Doca)');

  // 3 Slides com imagens de pets e tutores se divertindo em parques
  const heroSlides = [
    {
      id: 0,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=85',
      badge: 'Quick Commerce 24/7 • Top 100 SKUs',
      title: 'Mais tempo para brincar, zero estresse com ração e saúde.',
      description: 'Conectamos seu bairro aos micro-hubs parceiros com os produtos essenciais do seu pet entregues na sua porta em até 25 minutos.',
    },
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=85',
      badge: 'iPet ID • Passaporte Digital',
      title: 'O histórico de saúde do seu pet sempre protegido.',
      description: 'Vacinas, consultas, exames e microchip ISO acessíveis instantaneamente por QR Code por qualquer veterinário.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1600&q=85',
      badge: 'Rede SOS Comunitária • Raio 3 km',
      title: 'Uma comunidade inteira cuidando de quem você ama.',
      description: 'Se o seu pet fugir ou se assustar, ative o radar comunitário: push imediato para vizinhos e clínicas parceiras na região.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Garantir início pelo topo
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const neighborhoodTimes: Record<string, { time: string; hub: string; distance: string }> = {
    'Nazaré (Doca)': { time: '18 min', hub: 'Hub Belém Doca 24h', distance: '1.2 km' },
    'Batista Campos': { time: '20 min', hub: 'Pet Shop & Clínica Batista Campos', distance: '1.5 km' },
    'Umarizal': { time: '22 min', hub: 'Darkstore Pet Umarizal 24h', distance: '1.8 km' },
    'Ananindeua (BR-316)': { time: '24 min', hub: 'Atacarejo Pet Ananindeua BR-316', distance: '2.1 km' },
    'Cidade Nova': { time: '25 min', hub: 'Hub Ananindeua Coqueiro Express', distance: '2.3 km' },
  };

  const activeHubInfo = neighborhoodTimes[selectedNeighborhood] || neighborhoodTimes['Nazaré (Doca)'];

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] selection:bg-[#00A896]/20">
      {/* Navigation Header - Apenas Logo e Botão Fazer Login */}
      <header className="sticky top-0 z-30 bg-[#FDF8F3]/95 backdrop-blur-md border-b border-stone-200/70 px-4 md:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size="md" showTagline={false} />

          {/* Único Botão de Ação: Fazer Login */}
          <button
            onClick={onGoToAuth}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-[12px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Fazer Login</span>
          </button>
        </div>
      </header>

      {/* HERO BANNER PREMIUM COM SLIDER (3 SLIDES DE PETS E TUTORES EM PARQUES) */}
      <section className="relative px-3 sm:px-6 pt-4 pb-8 max-w-6xl mx-auto">
        <div className="relative h-[480px] sm:h-[520px] md:h-[540px] rounded-[28px] overflow-hidden shadow-2xl border border-stone-200/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {/* Background Park Image */}
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent max-w-2xl" />

              {/* Slide Content */}
              <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end max-w-2xl text-white space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-bold border border-white/20 w-fit">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{heroSlides[currentSlide].badge}</span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                  {heroSlides[currentSlide].title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed max-w-lg">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Hero CTA Único: Fazer Login */}
                <div className="pt-2">
                  <button
                    onClick={onGoToAuth}
                    className="py-3 px-6 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF9F1C]/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>Fazer Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Arrow Controls */}
          <button
            onClick={handlePrevSlide}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Próximo slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === index ? 'w-7 bg-[#FF9F1C]' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO DEDICADA: MODO EMERGÊNCIA NOTURNO 24/7 (COM IMAGEM DE FUNDO TUTOR + CÃO) */}
      <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="relative rounded-[26px] overflow-hidden shadow-xl border border-stone-800 bg-[#0E1B20] text-white">
          <img
            src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1400&q=80"
            alt="Tutor com cachorro em ambiente acolhedor"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B20] via-[#0E1B20]/85 to-transparent" />

          <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Moon className="w-3.5 h-3.5 animate-pulse" />
              <span>Plantão Noturno 20h às 08h</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E8F1F2] leading-snug">
              Modo Emergência Ativo 24/7 em São Paulo e capitais.
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              <strong>Ração e farmácia de madrugada na sua porta!</strong> Chega de desespero se o saco de ração acabar às 23h ou se o seu pet precisar de um antipulgas ou curativo urgente. Nossos micro-hubs de bairro operam ininterruptamente sem cobrança de taxas abusivas.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <p className="font-bold text-amber-300">Tempo Médio</p>
                <p className="text-stone-200 mt-0.5">24 minutos na porta</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <p className="font-bold text-amber-300">Top 100 SKUs</p>
                <p className="text-stone-200 mt-0.5">Ração, areia e remédios</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
                <p className="font-bold text-amber-300">Sem Sobretaxa</p>
                <p className="text-stone-200 mt-0.5">Mesmo preço diurno</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onGoToAuth}
                className="py-3 px-6 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <span>Fazer Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator & Live Metrics Section */}
      <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Metrics summary */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A896] bg-[#E4F6F3] px-3 py-1 rounded-full">
              Rapidez Comprovada
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#22333B]">
              Seu bairro conectado em minutos
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7A83] leading-relaxed">
              Diferente de pet shops convencionais que levam dias, o iPet opera com micro-hubs locais de alta rotatividade. Selecione sua região e veja o tempo real de entrega.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <p className="font-display text-xl font-bold text-[#00A896]">+15.000</p>
                <p className="text-[11px] text-[#6B7A83] mt-0.5">Pets cadastrados</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <p className="font-display text-xl font-bold text-[#FF9F1C]">24 min</p>
                <p className="text-[11px] text-[#6B7A83] mt-0.5">Entrega média</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <p className="font-display text-xl font-bold text-[#E63946]">384</p>
                <p className="text-[11px] text-[#6B7A83] mt-0.5">Pets achados no SOS</p>
              </div>
            </div>
          </div>

          {/* Delivery Simulator Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[24px] p-5 shadow-lg border border-stone-200/80">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00A896] animate-ping" />
                  <span className="text-xs font-bold text-[#22333B]">Simulador de Entrega no Bairro</span>
                </div>
                <span className="text-[11px] font-semibold text-[#00A896] bg-[#E4F6F3] px-2.5 py-0.5 rounded-full">
                  Disponível Agora
                </span>
              </div>

              <div className="mt-3">
                <label className="text-[11px] font-bold text-[#6B7A83] block mb-1.5 uppercase">
                  Escolha o bairro em SP:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(neighborhoodTimes).map((neighborhood) => (
                    <button
                      key={neighborhood}
                      onClick={() => setSelectedNeighborhood(neighborhood)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedNeighborhood === neighborhood
                          ? 'bg-[#00A896] text-white shadow-xs'
                          : 'bg-stone-100 text-[#6B7A83] hover:text-[#22333B]'
                      }`}
                    >
                      {neighborhood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Result */}
              <div className="mt-4 p-3.5 rounded-[18px] bg-gradient-to-br from-[#FDF8F3] to-[#FFF3E0] border border-[#FF9F1C]/25 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7A83] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    Tempo estimado na sua porta:
                  </p>
                  <p className="text-xs font-bold text-[#22333B] mt-0.5">
                    {activeHubInfo.hub} ({activeHubInfo.distance})
                  </p>
                </div>
                <span className="font-display font-extrabold text-2xl text-[#00A896]">
                  {activeHubInfo.time}
                </span>
              </div>

              <button
                onClick={onGoToAuth}
                className="w-full mt-4 py-2.5 rounded-[12px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span>Fazer Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Showcase */}
      <section className="px-4 sm:px-6 py-12 bg-white border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A896] bg-[#E4F6F3] px-3 py-1 rounded-full">
              Os 3 Pilares iPet
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#22333B]">
              Tudo o que seu pet precisa em uma única plataforma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="bg-[#FDF8F3] rounded-[22px] p-5 border border-stone-200/70 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00A896] text-white flex items-center justify-center mb-3 shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#22333B] mb-1.5">
                  1. Quick Commerce 24/7
                </h3>
                <p className="text-xs text-[#6B7A83] leading-relaxed mb-3">
                  Micro-hubs de bairro com estoque dos Top 100 SKUs de alta rotatividade. Modo Emergência noturno entre 20h e 08h com entrega média em 24 min.
                </p>
                <ul className="space-y-1.5 text-xs font-semibold text-[#22333B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896]" />
                    Entrega expressa em minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896]" />
                    Cesta Inteligente com reposição por IA
                  </li>
                </ul>
              </div>
              <div
                onClick={onGoToAuth}
                className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#00A896] flex items-center gap-1 cursor-pointer"
              >
                <span>Fazer Login</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FDF8F3] rounded-[22px] p-5 border border-stone-200/70 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FF9F1C] text-white flex items-center justify-center mb-3 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#22333B] mb-1.5">
                  2. iPet ID: Passaporte Digital
                </h3>
                <p className="text-xs text-[#6B7A83] leading-relaxed mb-3">
                  Cadastre múltiplos pets com foto, raça, alergias e histórico de vacinas. Gere um QR Code oficial para o veterinário ler na clínica.
                </p>
                <ul className="space-y-1.5 text-xs font-semibold text-[#22333B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    Carteira de vacinação digital
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    Alertas preventivos de revacinação
                  </li>
                </ul>
              </div>
              <div
                onClick={onGoToAuth}
                className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#FF9F1C] flex items-center gap-1 cursor-pointer"
              >
                <span>Fazer Login</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FDF8F3] rounded-[22px] p-5 border border-stone-200/70 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center mb-3 shadow-sm">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#22333B] mb-1.5">
                  3. iPet SOS + Protect
                </h3>
                <p className="text-xs text-[#6B7A83] leading-relaxed mb-3">
                  Se um pet se perder, ative o radar comunitário: disparamos alertas num raio de 3 km para vizinhos e clínicas. Microchip ISO subsidiado.
                </p>
                <ul className="space-y-1.5 text-xs font-semibold text-[#22333B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
                    Push urgente com foto e localização
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
                    Microchip ISO com cobertura médica
                  </li>
                </ul>
              </div>
              <div
                onClick={onGoToAuth}
                className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#E63946] flex items-center gap-1 cursor-pointer"
              >
                <span>Fazer Login</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 px-4 sm:px-8 py-6 text-xs text-[#6B7A83]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" showTagline={false} />
          <p>© 2026 iPet Tecnologia e Serviços Pet S.A. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <button onClick={onGoToAuth} className="hover:text-[#00A896] cursor-pointer font-bold">
              Fazer Login
            </button>
            <span className="hover:text-[#00A896] cursor-pointer">Termos</span>
            <span className="hover:text-[#00A896] cursor-pointer">Privacidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
