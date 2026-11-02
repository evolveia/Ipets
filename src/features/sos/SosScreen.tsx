import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SosAlert, Pet, SosSighting } from '../../types';
import {
  Radio,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  Share2,
  Plus,
  X,
  CheckCircle2,
  Eye,
  MessageCircle,
  QrCode,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SosMap } from '../../components/map/SosMap';

interface SosScreenProps {
  alerts: SosAlert[];
  pets: Pet[];
  onAddAlert: (alert: SosAlert) => void;
  onAddSighting: (alertId: string, sighting: SosSighting) => void;
}

export const SosScreen: React.FC<SosScreenProps> = ({
  alerts,
  pets,
  onAddAlert,
  onAddSighting,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(3.0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedAlertForShare, setSelectedAlertForShare] = useState<SosAlert | null>(null);
  const [selectedAlertForSighting, setSelectedAlertForSighting] = useState<SosAlert | null>(null);

  // Sighting state
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingNote, setSightingNote] = useState('');
  const [sightingReporter, setSightingReporter] = useState('Ana Beatriz (Vizinha)');

  // 3-step declare lost pet state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [lastSeenAddress, setLastSeenAddress] = useState('Av. Visconde de Souza Franco (Doca), Nazaré, Belém - PA');
  const [lastSeenTime, setLastSeenTime] = useState('Hoje às 15:45');
  const [description, setDescription] = useState('Fugiu assustado com trovoada. Coleira vermelha com plaquinha.');
  const [reward, setReward] = useState<string>('500');
  const [contactPhone, setContactPhone] = useState('(91) 98452-1920');

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleFinishReport = () => {
    // Determine dynamic coordinate based on address text (Ananindeua vs Belém)
    const isAnanindeua = lastSeenAddress.toLowerCase().includes('ananindeua') || lastSeenAddress.toLowerCase().includes('coqueiro');
    const lat = isAnanindeua
      ? -1.3650 + (Math.random() - 0.5) * 0.015
      : -1.4525 + (Math.random() - 0.5) * 0.015;
    const lng = isAnanindeua
      ? -48.3750 + (Math.random() - 0.5) * 0.015
      : -48.4840 + (Math.random() - 0.5) * 0.015;

    const newAlert: SosAlert = {
      id: `sos_${Date.now()}`,
      ownerId: 'user_tutor_01',
      ownerName: 'Ana Beatriz Silveira',
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      breed: selectedPet.breed,
      photoUrl: selectedPet.photoUrl,
      status: 'ativo',
      lastSeenAddress,
      lastSeenAt: lastSeenTime,
      description,
      rewardAmount: Number(reward) || undefined,
      contactPhone,
      radiusKm: selectedRadius,
      latitude: lat,
      longitude: lng,
      createdAt: new Date().toISOString(),
      microchipCode: selectedPet.microchipCode,
      sightings: [],
    };

    onAddAlert(newAlert);
    setIsReportModalOpen(false);
    setStep(1);

    // Haptic / vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (e) {}
    }
  };

  const handleSendSighting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForSighting || !sightingLocation.trim()) return;

    const newSighting: SosSighting = {
      id: `sight_${Date.now()}`,
      alertId: selectedAlertForSighting.id,
      reporterName: sightingReporter,
      locationName: sightingLocation,
      note: sightingNote,
      createdAt: 'Agora mesmo',
    };

    onAddSighting(selectedAlertForSighting.id, newSighting);
    setSelectedAlertForSighting(null);
    setSightingLocation('');
    setSightingNote('');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FDE8E9] text-[#E63946] flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#22333B]">
                iPet SOS Radar
              </h1>
              <p className="text-[11px] text-[#6B7A83]">
                Rede Comunitária de Busca • Raio de {selectedRadius} km
              </p>
            </div>
          </div>

          {/* Declare Lost Pet Button (Coral Pulse) */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white text-xs font-bold shadow-md shadow-[#E63946]/30 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emitir Alerta SOS</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Radar Range Selector & Visual Pulse Map */}
        <div className="bg-white rounded-[24px] p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#6B7A83]">
              Raio de Alcance do Radar
            </span>
            <div className="flex items-center gap-1.5">
              {[1.0, 3.0, 5.0].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRadius(r)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    selectedRadius === r
                      ? 'bg-[#E63946] text-white shadow-xs'
                      : 'bg-stone-100 text-[#6B7A83] hover:text-[#22333B]'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Leaflet Radar Map (Belém & Ananindeua) */}
          <SosMap
            alerts={alerts}
            radiusKm={selectedRadius}
            onSelectAlert={(al) => setSelectedAlertForShare(al)}
          />

          <div className="flex items-center justify-between text-xs text-[#6B7A83] pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#E63946]" />
              <strong>{alerts.length} alertas ativos</strong> neste perímetro
            </span>
            <span className="text-[#00A896] font-bold">12 clínicas parceiras monitorando</span>
          </div>
        </div>

        {/* Feed of Lost Pets in Radius */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base text-[#22333B]">
            Pets Desaparecidos na Região ({alerts.length})
          </h3>

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-[22px] p-4 border border-stone-200/80 shadow-xs space-y-3.5"
            >
              <div className="flex items-start gap-3">
                <img
                  src={alert.photoUrl}
                  alt={alert.petName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-lg text-[#22333B] leading-tight">
                        {alert.petName}
                      </h4>
                      <p className="text-xs text-[#6B7A83]">
                        {alert.breed} • Tutor: {alert.ownerName}
                      </p>
                    </div>

                    {alert.rewardAmount && (
                      <span className="text-xs font-bold text-white bg-[#52B788] px-2.5 py-1 rounded-full shadow-xs">
                        Recompensa: R$ {alert.rewardAmount}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <p className="flex items-center gap-1.5 text-[#22333B]">
                      <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                      <span className="font-semibold">{alert.lastSeenAddress}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-[#6B7A83]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{alert.lastSeenAt}</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#22333B] bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                "{alert.description}"
              </p>

              {/* Sightings community list */}
              {alert.sightings && alert.sightings.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <span className="text-[11px] font-bold text-[#00A896] uppercase flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Avistamentos Recentes ({alert.sightings.length})
                  </span>
                  {alert.sightings.map((s) => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-[#E4F6F3]/50 text-xs">
                      <div className="flex items-center justify-between font-bold text-[#22333B]">
                        <span>{s.reporterName}</span>
                        <span className="text-[10px] text-[#6B7A83]">{s.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-[#6B7A83] mt-0.5">
                        Local: <strong>{s.locationName}</strong> — "{s.note}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedAlertForSighting(alert)}
                  className="flex-1 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Eu vi este Pet!</span>
                </button>

                <button
                  onClick={() => setSelectedAlertForShare(alert)}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#22333B] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>

                <a
                  href={`tel:${alert.contactPhone.replace(/\D/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-[#FF9F1C] hover:bg-[#F08B07] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ligar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sighting Modal */}
      {selectedAlertForSighting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-[#22333B]">
                Reportar Avistamento de {selectedAlertForSighting.petName}
              </h3>
              <button
                onClick={() => setSelectedAlertForSighting(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#6B7A83]" />
              </button>
            </div>

            <form onSubmit={handleSendSighting} className="space-y-3.5 my-4">
              <div>
                <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                  Onde você viu o pet?
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Perto do Metrô Fradique Coutinho..."
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                  Detalhes / Horário aproximado
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Estava mancando, acompanhado de outra pessoa ou correndo..."
                  value={sightingNote}
                  onChange={(e) => setSightingNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-[14px] bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#00A896]/20 transition-all"
              >
                Enviar Informação para o Tutor
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Share Card Modal */}
      {selectedAlertForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-[26px] overflow-hidden shadow-2xl border border-stone-200 text-center"
          >
            {/* Card Preview (Instagram / WhatsApp format) */}
            <div className="bg-[#E63946] text-white p-4">
              <span className="text-[11px] font-black uppercase tracking-widest bg-white text-[#E63946] px-3 py-1 rounded-full">
                ALERTA URGENTE • iPet SOS
              </span>
              <h3 className="font-display text-2xl font-black mt-2">
                PROCURA-SE: {selectedAlertForShare.petName.toUpperCase()}
              </h3>
              <p className="text-xs text-white/90">{selectedAlertForShare.breed}</p>
            </div>

            <div className="p-4 space-y-3">
              <img
                src={selectedAlertForShare.photoUrl}
                alt={selectedAlertForShare.petName}
                className="w-48 h-48 mx-auto rounded-2xl object-cover border-4 border-[#E63946] shadow-md"
              />

              <div className="text-xs text-[#22333B] space-y-1">
                <p>
                  <strong>Último local:</strong> {selectedAlertForShare.lastSeenAddress}
                </p>
                <p>
                  <strong>Quando:</strong> {selectedAlertForShare.lastSeenAt}
                </p>
                {selectedAlertForShare.rewardAmount && (
                  <p className="font-bold text-[#52B788] text-sm">
                    Recompensa: R$ {selectedAlertForShare.rewardAmount}
                  </p>
                )}
                <p className="text-[#6B7A83] text-[11px] pt-1">
                  Contato com tutor: <strong>{selectedAlertForShare.contactPhone}</strong>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center gap-2 text-xs font-mono">
                <QrCode className="w-5 h-5 text-[#E63946]" />
                <span>ipet.app.br/sos/{selectedAlertForShare.id}</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2">
              <button
                onClick={() => setSelectedAlertForShare(null)}
                className="py-2.5 px-4 rounded-xl bg-stone-200 text-xs font-bold text-[#22333B] cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('Link do Card copiado para o WhatsApp e Redes Sociais!');
                  setSelectedAlertForShare(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#52B788] hover:bg-[#439c73] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Compartilhar no WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3-Step Declare Lost Pet Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FDE8E9] text-[#E63946] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#22333B]">
                    Declarar Pet Desaparecido
                  </h3>
                  <p className="text-[11px] text-[#6B7A83]">Passo {step} de 3</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#6B7A83]" />
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-[#E63946]' : 'bg-stone-200'}`} />
              <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-[#E63946]' : 'bg-stone-200'}`} />
              <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-[#E63946]' : 'bg-stone-200'}`} />
            </div>

            {/* Step 1: Pet Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-[#6B7A83]">
                  Selecione qual dos seus pets desapareceu ou cadastre um novo:
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        selectedPetId === pet.id
                          ? 'border-[#E63946] bg-[#FDE8E9]/40 ring-2 ring-[#E63946]/30'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-14 h-14 mx-auto rounded-full object-cover mb-2"
                      />
                      <p className="font-bold text-xs text-[#22333B]">{pet.name}</p>
                      <p className="text-[10px] text-[#6B7A83]">{pet.breed}</p>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 rounded-[14px] bg-[#E63946] text-white font-bold text-xs cursor-pointer shadow-md shadow-[#E63946]/20 flex items-center justify-center gap-1.5"
                >
                  <span>Avançar para Local e Horário</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Location & Time */}
            {step === 2 && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                    Último local onde foi visto
                  </label>
                  <input
                    type="text"
                    required
                    value={lastSeenAddress}
                    onChange={(e) => setLastSeenAddress(e.target.value)}
                    placeholder="Ex: Rua dos Pinheiros, altura do nº 400"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#E63946]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                    Data e Horário aproximado
                  </label>
                  <input
                    type="text"
                    required
                    value={lastSeenTime}
                    onChange={(e) => setLastSeenTime(e.target.value)}
                    placeholder="Ex: Hoje por volta das 14:30"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#E63946]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 rounded-xl bg-stone-100 text-xs font-bold text-[#6B7A83] cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-2.5 rounded-xl bg-[#E63946] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#E63946]/20"
                  >
                    Avançar para Contato e Recompensa
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Description, Reward, and Confirmation */}
            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                    Características e como se assustou
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#E63946]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                      Recompensa (Opcional R$)
                    </label>
                    <input
                      type="number"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="Ex: 500"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                      Telefone para Contato
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FDE8E9] text-[11px] text-[#E63946] font-semibold">
                  Ao confirmar, um push de emergência será enviado para <strong>~384 tutores</strong> e <strong>12 clínicas veterinárias</strong> em um raio de 3 km!
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 rounded-xl bg-stone-100 text-xs font-bold text-[#6B7A83] cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishReport}
                    className="flex-1 py-3 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white text-xs font-bold cursor-pointer shadow-lg shadow-[#E63946]/30 flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Disparar Alerta SOS no Bairro</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
