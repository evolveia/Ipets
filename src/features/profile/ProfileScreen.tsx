import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Pet } from '../../types';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Moon,
  Sparkles,
  ExternalLink,
  LogOut,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Camera,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  activePet: Pet;
  isEmergencyMode: boolean;
  onToggleEmergencyMode: () => void;
  onGoToLanding: () => void;
  onSignOut: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  activePet,
  isEmergencyMode,
  onToggleEmergencyMode,
  onGoToLanding,
  onSignOut,
  onUpdateUser,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const tutorAvatarInputRef = useRef<HTMLInputElement>(null);

  // Edit form states
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editStreet, setEditStreet] = useState(user.addresses[0]?.street || '');
  const [editNumber, setEditNumber] = useState(user.addresses[0]?.number || '');
  const [editNeighborhood, setEditNeighborhood] = useState(user.addresses[0]?.neighborhood || '');
  const [editCity, setEditCity] = useState(user.addresses[0]?.city || 'Belém');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateUser({
            ...user,
            photoUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser) return;

    const updatedAddresses = [...user.addresses];
    if (updatedAddresses.length > 0) {
      updatedAddresses[0] = {
        ...updatedAddresses[0],
        street: editStreet.trim(),
        number: editNumber.trim(),
        neighborhood: editNeighborhood.trim(),
        city: editCity.trim(),
      };
    }

    const updatedUser: UserProfile = {
      ...user,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      addresses: updatedAddresses,
    };

    onUpdateUser(updatedUser);
    setIsEditProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] pb-24">
      {/* Hidden file input for tutor avatar */}
      <input
        type="file"
        ref={tutorAvatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-[#22333B]">Meu Perfil do Tutor</h1>
          <button
            onClick={onGoToLanding}
            className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Landing Page</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Tutor Card */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Tutor avatar with upload trigger */}
            <div className="relative group shrink-0">
              <img
                src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#00A896] shadow-sm"
              />
              <button
                type="button"
                onClick={() => tutorAvatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Trocar Foto de Perfil"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[8px] font-bold">Foto</span>
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-[#22333B] truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] font-bold text-[#FF9F1C] bg-[#FFF3E0] px-2 py-0.5 rounded-full shrink-0">
                  iPet Prime
                </span>
              </div>
              <p className="text-xs text-[#6B7A83] truncate">{user.email}</p>
              <p className="text-xs text-[#6B7A83]">{user.phone}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditName(user.name);
              setEditEmail(user.email);
              setEditPhone(user.phone);
              if (user.addresses[0]) {
                setEditStreet(user.addresses[0].street);
                setEditNumber(user.addresses[0].number);
                setEditNeighborhood(user.addresses[0].neighborhood);
                setEditCity(user.addresses[0].city);
              }
              setIsEditProfileOpen(true);
            }}
            className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#E4F6F3] text-stone-600 hover:text-[#00A896] border border-stone-200 transition-colors cursor-pointer shrink-0"
            title="Editar Perfil"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-[22px] p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
              Endereços Salvos
            </h4>
            <span
              onClick={() => setIsEditProfileOpen(true)}
              className="text-xs font-bold text-[#00A896] cursor-pointer hover:underline"
            >
              Editar Endereço
            </span>
          </div>

          <div className="space-y-2">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#22333B]">
                    <span>{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-[#E4F6F3] text-[#00A896] px-1.5 py-0.2 rounded font-bold">
                        Padrão
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B7A83] text-[11px] mt-0.5">
                    {addr.street}, {addr.number} {addr.complement} • {addr.neighborhood}, {addr.city}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences & Night Mode */}
        <div className="bg-white rounded-[22px] p-4 border border-stone-200/80 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83]">
            Preferências do App
          </h4>

          {/* Emergency Night Mode Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#22333B]">Modo Emergência Noturno</p>
                <p className="text-[11px] text-[#6B7A83]">Foco em farmácia, ração e produtos essenciais</p>
              </div>
            </div>

            <button
              onClick={onToggleEmergencyMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isEmergencyMode ? 'bg-[#FF9F1C]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isEmergencyMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#22333B]">Notificações Push & SOS</p>
                <p className="text-[11px] text-[#6B7A83]">Alertas no raio de 3km e rastreio de entrega</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#52B788]">Ativado</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onGoToLanding}
            className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#22333B] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Voltar para Landing Page iPet</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#E63946] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </main>

      {/* ================= MODAL: EDIT TUTOR PROFILE ================= */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-lg bg-white rounded-[28px] p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#22333B]">
                    Editar Dados do Tutor
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-[#22333B] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                    Endereço de Entrega Principal
                  </h4>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Rua / Avenida
                      </label>
                      <input
                        type="text"
                        required
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        required
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        required
                        value={editNeighborhood}
                        onChange={(e) => setEditNeighborhood(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Cidade / UF
                      </label>
                      <input
                        type="text"
                        required
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Dados</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
