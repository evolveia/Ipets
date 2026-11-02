import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Pet, Product } from '../../types';
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingBag,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Radio,
  Star,
  Plus,
  ArrowRight,
  Tag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { SmartRefillModal } from './SmartRefillModal';
import { ProductDetailModal } from '../catalog/ProductDetailModal';

interface HomeScreenProps {
  user: UserProfile;
  activePet: Pet;
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  cartCount: number;
  onOpenCart: () => void;
  onGoToSos: () => void;
  onGoToPrime: () => void;
  isEmergencyMode: boolean;
  onToggleEmergencyMode: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  activePet,
  pets,
  onSelectPet,
  products,
  onAddToCart,
  cartCount,
  onOpenCart,
  onGoToSos,
  onGoToPrime,
  isEmergencyMode,
  onToggleEmergencyMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Full-width Hero Banner Slides (Lançamentos, Promoções e Serviços)
  const heroSlides = [
    {
      id: 0,
      badge: 'NOVO LANÇAMENTO EM BELÉM & ANANINDEUA',
      badgeColor: 'bg-white text-[#E85D04]',
      title: 'Linha Royal Canin & N&D Farmina Prime',
      description: 'Fórmulas Super Premium com entrega expressa em até 25 minutos na sua porta.',
      ctaText: 'Ver Lançamento',
      gradient: 'from-[#FF9F1C] via-[#F08B07] to-[#E85D04]',
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
      actionCategory: 'racao',
    },
    {
      id: 1,
      badge: 'SUPER PROMOÇÃO DA SEMANA • ATÉ 35% OFF',
      badgeColor: 'bg-white text-[#00A896]',
      title: 'Festival de Antipulgas & Carrapatos',
      description: 'Bravecto, Simparic e NexGard Spectra com entrega 24h e cashback em dobro para tutores.',
      ctaText: 'Aproveitar Ofertas',
      gradient: 'from-[#00A896] via-[#028f80] to-[#027368]',
      imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=1200&q=80',
      actionCategory: 'farmacia',
    },
    {
      id: 2,
      badge: 'SERVIÇOS & CUIDADOS VETERINÁRIOS',
      badgeColor: 'bg-white text-[#4361EE]',
      title: 'Teleorientação Veterinária 24h & Banho VIP',
      description: 'Agende banho, tosa e consultas veterinárias na rede credenciada de Belém e Ananindeua.',
      ctaText: 'Agendar Cuidado',
      gradient: 'from-[#4361EE] via-[#3F37C9] to-[#3A0CA3]',
      imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
      actionServices: true,
    },
    {
      id: 3,
      badge: 'CLUBE IPET PRIME • BENEFÍCIO EXCLUSIVO',
      badgeColor: 'bg-amber-300 text-purple-950',
      title: 'Frete Grátis 24/7 Ilimitado em Belém',
      description: 'Economize mais de R$ 140/mês com entregas expressas grátis e mimos mensais para seu pet.',
      ctaText: 'Conhecer Prime',
      gradient: 'from-[#7209B7] via-[#560BAD] to-[#3A0CA3]',
      imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
      actionPrime: true,
    },
  ];

  // Auto-advance hero slides every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { id: 'all', label: 'Top 100 Geral', icon: Sparkles },
    { id: 'racao', label: 'Rações', icon: Zap },
    { id: 'farmacia', label: 'Farmácia & Pulgas', icon: Star },
    { id: 'higiene', label: 'Higiene & Tapetes', icon: Sparkles },
    { id: 'petiscos', label: 'Petiscos & Churu', icon: Zap },
    { id: 'brinquedos', label: 'Brinquedos', icon: Sparkles },
  ];

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    if (isEmergencyMode && !prod.isEmergencyEssential) {
      return false;
    }
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeFoodProduct = products.find((p) => p.sku === activePet.currentFoodSku) || products[0];

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-300 ${
        isEmergencyMode ? 'bg-[#0E1B20] text-[#E8F1F2]' : 'bg-[#FDF8F3] text-[#22333B]'
      }`}
    >
      {/* Sticky App Header - Belém & Ananindeua Context */}
      <header
        className={`sticky top-0 z-30 px-3.5 sm:px-6 py-2.5 border-b backdrop-blur-md transition-colors ${
          isEmergencyMode
            ? 'bg-[#15262C]/95 border-amber-500/20'
            : 'bg-white/95 border-stone-200/80 shadow-xs'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Location & Hub Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-bold text-[#00A896]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {user.addresses[0]?.street}, {user.addresses[0]?.number}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6B7A83] shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#6B7A83] truncate mt-0.5 flex items-center gap-1.5">
              <span>{user.addresses[0]?.hubName}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-[#52B788] font-bold">Entrega em 24 min</span>
            </p>
          </div>

          {/* Active Pet Switcher Pill */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                isEmergencyMode
                  ? 'bg-[#0E1B20] border-stone-700 text-stone-200 hover:border-amber-400'
                  : 'bg-stone-50 border-stone-200 hover:border-[#00A896] text-[#22333B]'
              }`}
            >
              <img
                src={activePet.photoUrl}
                alt={activePet.name}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#00A896]"
              />
              <span className="text-xs font-bold">{activePet.name}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7A83]" />
            </button>

            {/* Dropdown for other pets */}
            {isPetDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-40 text-[#22333B]">
                <p className="text-[10px] font-bold uppercase text-[#6B7A83] px-2.5 py-1">
                  Trocar Pet Ativo:
                </p>
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      onSelectPet(pet);
                      setIsPetDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left cursor-pointer transition-colors ${
                      pet.id === activePet.id
                        ? 'bg-[#E4F6F3] font-bold text-[#00A896]'
                        : 'hover:bg-stone-100 text-xs text-[#22333B]'
                    }`}
                  >
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#00A896]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">{pet.name}</p>
                      <p className="text-[10px] text-[#6B7A83] truncate">{pet.breed}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Cesta"
            className="relative p-2 sm:p-2.5 rounded-full bg-[#FF9F1C] hover:bg-[#F08B07] text-white shadow-sm cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#E63946] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-3.5 space-y-4">
        {/* HERO BANNER PRINCIPAL COM INFORMAÇÕES DE LANÇAMENTO, PROMOÇÕES E SERVIÇOS */}
        <section aria-label="Hero Banner de Destaques e Lançamentos">
          <div className="relative h-[210px] sm:h-[235px] md:h-[260px] rounded-[24px] overflow-hidden shadow-lg border border-stone-200/80">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentHeroSlide].gradient} flex items-center justify-between p-5 sm:p-7 text-white`}
              >
                {/* Background image preview with fade */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 overflow-hidden opacity-30 sm:opacity-50 pointer-events-none">
                  <img
                    src={heroSlides[currentHeroSlide].imageUrl}
                    alt={heroSlides[currentHeroSlide].title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30" />
                </div>

                {/* Content Left */}
                <div className="relative z-10 max-w-[80%] sm:max-w-[70%] space-y-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${heroSlides[currentHeroSlide].badgeColor}`}
                  >
                    {heroSlides[currentHeroSlide].badge}
                  </span>

                  <h3 className="font-display font-extrabold text-base sm:text-xl md:text-2xl leading-tight text-white drop-shadow-sm">
                    {heroSlides[currentHeroSlide].title}
                  </h3>

                  <p className="text-[11px] sm:text-xs md:text-sm text-white/95 line-clamp-2 leading-relaxed max-w-md">
                    {heroSlides[currentHeroSlide].description}
                  </p>

                  <div className="pt-1.5">
                    <button
                      onClick={() => {
                        const slide = heroSlides[currentHeroSlide];
                        if (slide.actionPrime) {
                          onGoToPrime();
                        } else if (slide.actionCategory) {
                          setSelectedCategory(slide.actionCategory);
                        } else if (slide.actionServices) {
                          onGoToPrime();
                        }
                      }}
                      className="py-2 px-4 rounded-xl bg-white text-[#22333B] hover:bg-stone-50 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                    >
                      <span>{heroSlides[currentHeroSlide].ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider navigation controls */}
            <button
              onClick={() =>
                setCurrentHeroSlide(
                  (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                )
              }
              aria-label="Slide anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
              }
              aria-label="Próximo slide"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentHeroSlide(index)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentHeroSlide === index
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Modo Emergência Banner (20h às 08h) */}
        <div
          className={`p-3.5 rounded-[20px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isEmergencyMode
              ? 'bg-gradient-to-r from-[#15262C] to-[#1d353d] border-amber-500/40 shadow-sm'
              : 'bg-white border-stone-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isEmergencyMode
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-[#E4F6F3] text-[#00A896]'
              }`}
            >
              {isEmergencyMode ? (
                <Moon className="w-4.5 h-4.5 animate-pulse" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-[#FF9F1C]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-xs sm:text-sm">
                  {isEmergencyMode ? 'Modo Emergência Ativo' : 'Base 24 Horas em Belém & Ananindeua'}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    isEmergencyMode
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-[#E4F6F3] text-[#00A896]'
                  }`}
                >
                  {isEmergencyMode ? '20h - 08h' : 'Entrega em 24 min'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7A83] leading-tight mt-0.5">
                {isEmergencyMode
                  ? 'Remédios, ração e itens de socorro para entrega de madrugada sem sobretaxa.'
                  : 'Acabou a ração à noite? Nossos micro-hubs da Doca e BR-316 operam ininterruptamente.'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleEmergencyMode}
            className={`self-end sm:self-center px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 ${
              isEmergencyMode
                ? 'bg-amber-500 text-stone-900 shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-[#22333B]'
            }`}
          >
            {isEmergencyMode ? 'Desativar' : 'Simular Noite'}
          </button>
        </div>

        {/* Cesta Inteligente iPet (IA Replenishment) */}
        <div
          className={`p-3.5 sm:p-4 rounded-[22px] border transition-all ${
            isEmergencyMode
              ? 'bg-[#15262C] border-stone-700'
              : 'bg-gradient-to-br from-white via-white to-[#FFF3E0]/30 border-stone-200/90 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF9F1C] bg-[#FFF3E0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Cesta Inteligente iPet
              </span>
              <span className="text-[11px] text-[#6B7A83]">
                Para {activePet.name} ({activePet.weightKg} kg)
              </span>
            </div>
            <button
              onClick={() => setIsSmartModalOpen(true)}
              className="text-xs font-bold text-[#00A896] hover:underline cursor-pointer"
            >
              Ajustar Cálculo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <img
                src={activeFoodProduct.imageUrl}
                alt={activeFoodProduct.name}
                className="w-13 h-13 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                  {activeFoodProduct.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#6B7A83] mt-0.5">
                  <span>
                    Consumo: <strong>{activePet.dailyFoodGrams || 360}g/dia</strong>
                  </span>
                  <span>•</span>
                  <span className="text-[#E63946] font-bold">Restam ~4 dias</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAddToCart(activeFoodProduct, 1)}
              className="py-2.5 px-4 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white text-xs font-bold shadow-md shadow-[#FF9F1C]/25 flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
            >
              <span>Repor Ração Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SOS Radar Banner Teaser */}
        <div
          onClick={onGoToSos}
          className="p-3 sm:p-3.5 rounded-[20px] bg-gradient-to-r from-[#E63946] to-[#b51724] text-white shadow-sm flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Radio className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-xs sm:text-sm">
                  Alerta SOS Ativo (Belém / Nazaré)
                </h4>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.2 rounded-full">
                  Raio 3 km
                </span>
              </div>
              <p className="text-[11px] text-white/90 leading-tight mt-0.5">
                O cãozinho "Bento" (Pug) sumiu perto da Batista Campos. Ajude a encontrar!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold bg-white text-[#E63946] px-3 py-1.5 rounded-xl shadow-xs shrink-0">
            <span>Ver Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar entre os Top 100 SKUs (ração, Bravecto, tapete...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-[14px] text-xs font-semibold focus:outline-none transition-colors ${
              isEmergencyMode
                ? 'bg-[#15262C] border border-stone-700 text-stone-100 placeholder:text-stone-500 focus:border-[#3AD6C0]'
                : 'bg-white border border-stone-200/90 text-[#22333B] placeholder:text-[#6B7A83] focus:border-[#00A896] shadow-xs'
            }`}
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#00A896] text-white shadow-xs'
                    : isEmergencyMode
                    ? 'bg-[#15262C] text-stone-300 hover:bg-stone-800'
                    : 'bg-white text-[#6B7A83] hover:text-[#22333B] border border-stone-200/60'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top 100 Product Grid - Responsivo Mobile / Tablet / Desktop */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#22333B]">
                {selectedCategory === 'all'
                  ? 'Top 100 SKUs de Alta Rotatividade'
                  : 'Produtos Selecionados'}
              </h3>
              <p className="text-[11px] text-[#6B7A83]">
                Estoque em tempo real no {user.addresses[0]?.hubName}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#00A896]">
              {filteredProducts.length} itens
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`rounded-[20px] p-3 sm:p-3.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                  isEmergencyMode
                    ? 'bg-[#15262C] border-stone-700/80 hover:border-amber-500/50'
                    : 'bg-white border-stone-200/70 hover:border-[#00A896]/50 shadow-xs'
                }`}
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-square rounded-[16px] overflow-hidden bg-stone-100 mb-2.5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isTop100 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#00A896] text-white text-[10px] font-bold shadow-xs">
                        #{product.top100Rank}
                      </span>
                    )}
                    {product.badge && (
                      <span className="absolute bottom-2 left-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold truncate text-center">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-bold text-[#6B7A83] uppercase tracking-wider">
                    {product.brand}
                  </p>
                  <h4 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 mt-0.5 text-[#22333B]">
                    {product.name}
                  </h4>

                  {/* Rating preview */}
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="font-display font-extrabold text-sm sm:text-base text-[#00A896]">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.originalPrice && (
                      <p className="text-[10px] text-[#6B7A83] line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, 1);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF9F1C] hover:bg-[#F08B07] text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-90"
                    aria-label={`Adicionar ${product.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Smart Refill Modal */}
      <SmartRefillModal
        pet={activePet}
        isOpen={isSmartModalOpen}
        onClose={() => setIsSmartModalOpen(false)}
        onAddToCart={onAddToCart}
        suggestedProduct={activeFoodProduct}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        activePet={activePet}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
