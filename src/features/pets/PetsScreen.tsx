import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetHealthRecord, PetSpecies, PetSize } from '../../types';
import {
  PawPrint,
  QrCode,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
  FileText,
  Activity,
  Bot,
  Sparkles,
  ChevronRight,
  Send,
  Upload,
  Heart,
  Edit2,
  Trash2,
  Camera,
  FileUp,
  Download,
  Eye,
  FileCheck,
  Paperclip,
  Check
} from 'lucide-react';

interface PetsScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (pet: Pet) => void;
  onAddPet: (pet: Pet) => void;
  onUpdatePet: (pet: Pet) => void;
  onDeletePet: (petId: string) => void;
  onAddHealthRecord: (petId: string, record: PetHealthRecord) => void;
  onUpdateHealthRecord: (petId: string, record: PetHealthRecord) => void;
  onDeleteHealthRecord: (petId: string, recordId: string) => void;
}

export const PetsScreen: React.FC<PetsScreenProps> = ({
  pets,
  activePet,
  onSelectPet,
  onAddPet,
  onUpdatePet,
  onDeletePet,
  onAddHealthRecord,
  onUpdateHealthRecord,
  onDeleteHealthRecord,
}) => {
  // Modal states
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState(false);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  // Health record modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PetHealthRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<PetHealthRecord | null>(null);
  const [viewingDocument, setViewingDocument] = useState<PetHealthRecord | null>(null);

  // File input refs
  const petAvatarInputRef = useRef<HTMLInputElement>(null);
  const editPetAvatarInputRef = useRef<HTMLInputElement>(null);
  const newPetAvatarInputRef = useRef<HTMLInputElement>(null);
  const recordDocInputRef = useRef<HTMLInputElement>(null);

  // Edit Pet Form State
  const [editName, setEditName] = useState(activePet.name);
  const [editSpecies, setEditSpecies] = useState<PetSpecies>(activePet.species);
  const [editBreed, setEditBreed] = useState(activePet.breed);
  const [editWeight, setEditWeight] = useState(String(activePet.weightKg));
  const [editBirthDate, setEditBirthDate] = useState(activePet.birthDate);
  const [editGender, setEditGender] = useState<'macho' | 'femea'>(activePet.gender);
  const [editMicrochip, setEditMicrochip] = useState(activePet.microchipCode || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(activePet.photoUrl);
  const [editAllergiesText, setEditAllergiesText] = useState(activePet.allergies.join(', '));
  const [editConditionsText, setEditConditionsText] = useState(activePet.conditions.join(', '));
  const [editNotes, setEditNotes] = useState(activePet.notes || '');

  // Sync edit form when active pet changes
  const openEditPetModal = (pet: Pet) => {
    setEditName(pet.name);
    setEditSpecies(pet.species);
    setEditBreed(pet.breed);
    setEditWeight(String(pet.weightKg));
    setEditBirthDate(pet.birthDate);
    setEditGender(pet.gender);
    setEditMicrochip(pet.microchipCode || '');
    setEditPhotoUrl(pet.photoUrl);
    setEditAllergiesText(pet.allergies.join(', '));
    setEditConditionsText(pet.conditions.join(', '));
    setEditNotes(pet.notes || '');
    setIsEditPetModalOpen(true);
  };

  // Health Record Form State (Used for both Create and Edit)
  const [recType, setRecType] = useState<'vacina' | 'exame' | 'medicacao' | 'consulta'>('vacina');
  const [recTitle, setRecTitle] = useState('');
  const [recDate, setRecDate] = useState('2026-11-02');
  const [recNextDue, setRecNextDue] = useState('');
  const [recVet, setRecVet] = useState('Dra. Camila Toledo (CRMV-PA 38.902)');
  const [recClinic, setRecClinic] = useState('Hospital Veterinário VetCare 24h Belém');
  const [recNotes, setRecNotes] = useState('');
  const [recDocUrl, setRecDocUrl] = useState<string | undefined>(undefined);
  const [recDocName, setRecDocName] = useState<string | undefined>(undefined);
  const [recDocType, setRecDocType] = useState<'pdf' | 'image' | undefined>(undefined);

  const openNewRecordModal = () => {
    setEditingRecord(null);
    setRecType('vacina');
    setRecTitle('');
    setRecDate(new Date().toISOString().slice(0, 10));
    setRecNextDue('');
    setRecVet('Dra. Camila Toledo (CRMV-PA 38.902)');
    setRecClinic('Hospital Veterinário Belém Doca 24h');
    setRecNotes('');
    setRecDocUrl(undefined);
    setRecDocName(undefined);
    setRecDocType(undefined);
    setIsRecordModalOpen(true);
  };

  const openEditRecordModal = (record: PetHealthRecord) => {
    setEditingRecord(record);
    setRecType(record.type);
    setRecTitle(record.title);
    setRecDate(record.date);
    setRecNextDue(record.nextDueDate || '');
    setRecVet(record.vetName);
    setRecClinic(record.clinic || '');
    setRecNotes(record.notes || '');
    setRecDocUrl(record.attachmentUrl);
    setRecDocName(record.documentName);
    setRecDocType(record.documentType);
    setIsRecordModalOpen(true);
  };

  // AI Health Advisor State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Olá! Sou o Assistente Veterinário iPet. Posso tirar dúvidas sobre nutrição, vacinas ou cuidados para a ${activePet.name} (${activePet.breed}). Como posso te ajudar hoje?`,
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // New Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<PetSpecies>('cao');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('10');
  const [newPetBirth, setNewPetBirth] = useState('2024-01-01');
  const [newPetGender, setNewPetGender] = useState<'macho' | 'femea'>('femea');
  const [newPetPhotoUrl, setNewPetPhotoUrl] = useState<string>('');

  // Handle direct pet photo upload from the passport card
  const handleDirectPetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated: Pet = {
            ...activePet,
            photoUrl: reader.result,
          };
          onUpdatePet(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle document upload for health record
  const handleRecordDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setRecDocUrl(reader.result);
          setRecDocName(file.name);
          setRecDocType(isPdf ? 'pdf' : 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const q = aiQuestion;
    setAiAnswers((prev) => [...prev, { sender: 'user', text: q }]);
    setAiQuestion('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = '';
      if (q.toLowerCase().includes('ração') || q.toLowerCase().includes('comer') || q.toLowerCase().includes('quantidade')) {
        reply = `Para um ${activePet.breed} com ${activePet.weightKg} kg e atividade média, a recomendação diária ideal é de ~${activePet.dailyFoodGrams || 360}g divididos em 2 refeições diárias, mantendo água fresca sempre à vontade!`;
      } else if (q.toLowerCase().includes('engoliu') || q.toLowerCase().includes('emergência') || q.toLowerCase().includes('vômito')) {
        reply = `⚠️ Atenção! Caso haja ingestão de corpo estranho, vômitos contínuos ou apatia, procure imediatamente um Hospital Veterinário 24h. O Hospital Belém Doca 24h mais próximo fica na Travessa Visconde de Souza Franco!`;
      } else {
        reply = `Entendido! Para a ${activePet.name}, manter as vacinas polivalente e antirrábica anuais em dia e antipulgas mensal é a melhor prevenção. Você pode anexar os comprovantes na linha do tempo acima.`;
      }
      setAiAnswers((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 700);
  };

  const handleSavePetChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const weightNum = parseFloat(editWeight) || activePet.weightKg;
    const calcSize: PetSize =
      weightNum > 25 ? 'grande' : weightNum > 10 ? 'medio' : 'pequeno';

    const allergiesArr = editAllergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const conditionsArr = editConditionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: Pet = {
      ...activePet,
      name: editName.trim(),
      species: editSpecies,
      breed: editBreed.trim() || 'SRD',
      weightKg: weightNum,
      size: calcSize,
      birthDate: editBirthDate,
      gender: editGender,
      microchipCode: editMicrochip.trim() || activePet.microchipCode,
      photoUrl: editPhotoUrl,
      allergies: allergiesArr,
      conditions: conditionsArr,
      notes: editNotes.trim(),
    };

    onUpdatePet(updated);
    setIsEditPetModalOpen(false);
  };

  const handleConfirmDeletePet = () => {
    if (petToDelete) {
      onDeletePet(petToDelete.id);
      setPetToDelete(null);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim()) return;

    if (editingRecord) {
      // Update existing record
      const updated: PetHealthRecord = {
        ...editingRecord,
        type: recType,
        title: recTitle.trim(),
        date: recDate,
        nextDueDate: recNextDue.trim() || undefined,
        vetName: recVet.trim(),
        clinic: recClinic.trim(),
        notes: recNotes.trim(),
        attachmentUrl: recDocUrl,
        documentName: recDocName,
        documentType: recDocType,
      };
      onUpdateHealthRecord(activePet.id, updated);
    } else {
      // Create new record
      const newRecord: PetHealthRecord = {
        id: `hr_${Date.now()}`,
        petId: activePet.id,
        type: recType,
        title: recTitle.trim(),
        date: recDate,
        nextDueDate: recNextDue.trim() || undefined,
        vetName: recVet.trim(),
        clinic: recClinic.trim(),
        notes: recNotes.trim(),
        attachmentUrl: recDocUrl,
        documentName: recDocName,
        documentType: recDocType,
      };
      onAddHealthRecord(activePet.id, newRecord);
    }

    setIsRecordModalOpen(false);
  };

  const handleConfirmDeleteRecord = () => {
    if (recordToDelete) {
      onDeleteHealthRecord(activePet.id, recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const defaultImg =
      newPetSpecies === 'cao'
        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80';

    const created: Pet = {
      id: `pet_${Date.now()}`,
      ownerId: 'user_tutor_01',
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim() || (newPetSpecies === 'cao' ? 'SRD (Vira-lata)' : 'SRD Felino'),
      size: Number(newPetWeight) > 20 ? 'grande' : Number(newPetWeight) > 10 ? 'medio' : 'pequeno',
      weightKg: Number(newPetWeight) || 5,
      birthDate: newPetBirth,
      gender: newPetGender,
      photoUrl: newPetPhotoUrl || defaultImg,
      photos: [newPetPhotoUrl || defaultImg],
      microchipCode: `98109810${Math.floor(1000000 + Math.random() * 9000000)}`,
      allergies: [],
      conditions: [],
      notes: 'Cadastrado no iPet Super App.',
      active: true,
      dailyFoodGrams: Number(newPetWeight) * 15,
      healthRecords: [],
    };

    onAddPet(created);
    onSelectPet(created);
    setIsNewPetModalOpen(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetPhotoUrl('');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B] pb-24">
      {/* Hidden file input for fast avatar upload */}
      <input
        type="file"
        ref={petAvatarInputRef}
        onChange={handleDirectPetPhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
              <PawPrint className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl text-[#22333B]">
                iPet ID • Passaporte Digital
              </h1>
              <p className="text-[11px] text-[#6B7A83]">
                Perfil, fotos, exames e histórico clínico por QR Code
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewPetModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Pet</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Multi-Pet Horizontal Switcher */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {pets.map((pet) => {
            const isSelected = pet.id === activePet.id;
            return (
              <button
                key={pet.id}
                onClick={() => onSelectPet(pet)}
                className={`p-1.5 pr-4 rounded-full flex items-center gap-2.5 border transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-white border-[#00A896] shadow-sm ring-2 ring-[#00A896]/20'
                    : 'bg-white/70 border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#00A896]"
                />
                <div className="text-left">
                  <h4 className="font-bold text-xs text-[#22333B]">{pet.name}</h4>
                  <p className="text-[10px] text-[#6B7A83]">{pet.breed}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Digital Passport Hero Card */}
        <div className="relative bg-gradient-to-br from-[#00A896] via-[#008f80] to-[#027368] text-white rounded-[26px] p-5 sm:p-6 shadow-xl overflow-hidden">
          {/* Subtle background paw pattern */}
          <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl pointer-events-none">
            🐾
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                iPet ID • Registro Oficial
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Microchip ISO Ativo
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Pet Photo with upload trigger */}
              <div className="relative group shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                <img
                  src={activePet.photoUrl}
                  alt={activePet.name}
                  className="w-full h-full rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => petAvatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/45 hover:bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                  title="Trocar foto do Pet"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold text-center leading-tight">Trocar Foto</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
                      {activePet.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-teal-100 font-semibold">
                      {activePet.breed} • {activePet.gender === 'femea' ? 'Fêmea' : 'Macho'}
                    </p>
                  </div>

                  {/* Pet CRUD actions */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-black/20 backdrop-blur-xs p-1 rounded-xl">
                    <button
                      onClick={() => openEditPetModal(activePet)}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title="Editar dados do Pet"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {pets.length > 1 && (
                      <button
                        onClick={() => setPetToDelete(activePet)}
                        className="p-1.5 rounded-lg hover:bg-red-500/30 text-rose-200 hover:text-white cursor-pointer transition-colors"
                        title="Excluir Pet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-teal-200 text-[10px] uppercase block">Peso Atual</span>
                    <span className="font-bold">{activePet.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-teal-200 text-[10px] uppercase block">Nascimento</span>
                    <span className="font-bold">{activePet.birthDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Microchip ISO Code Bar */}
            <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-xs flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-teal-200 font-sans">Microchip:</span>
                <span className="font-bold">{activePet.microchipCode || '981098102345892'}</span>
              </div>
              <span className="text-[10px] text-teal-200">Padrão FDX-B (ISO 11784)</span>
            </div>

            {/* QR Code Action Button */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="w-full py-3 rounded-xl bg-white text-[#00A896] hover:bg-teal-50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
            >
              <QrCode className="w-4 h-4" />
              <span>Apresentar QR Code ao Veterinário</span>
            </button>
          </div>
        </div>

        {/* Allergies & Clinical Alerts */}
        <div className="bg-white rounded-[22px] p-4 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7A83] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#E63946]" />
              Alergias e Condições Clínicas
            </h4>
            <button
              onClick={() => openEditPetModal(activePet)}
              className="text-[11px] font-bold text-[#00A896] hover:underline cursor-pointer"
            >
              Editar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activePet.allergies.length > 0 ? (
              activePet.allergies.map((al, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FDE8E9] text-[#E63946] border border-[#E63946]/20"
                >
                  ⚠️ {al}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-400 italic">Nenhuma alergia relatada</span>
            )}

            {activePet.conditions.length > 0 ? (
              activePet.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200"
                >
                  🩺 {cond}
                </span>
              ))
            ) : null}
          </div>
        </div>

        {/* Health Timeline & Documents (Full CRUD) */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base text-[#22333B] flex items-center gap-2">
                <span>Linha do Tempo de Saúde & Documentos</span>
                <span className="text-[10px] font-bold bg-[#E4F6F3] text-[#00A896] px-2 py-0.5 rounded-full">
                  {activePet.healthRecords.length}
                </span>
              </h3>
              <p className="text-[11px] text-[#6B7A83]">
                Vacinas, exames, receitas e laudos anexados
              </p>
            </div>

            <button
              onClick={openNewRecordModal}
              className="px-3.5 py-2 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro / Documento</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {activePet.healthRecords.length === 0 ? (
              <div className="text-center py-8 text-stone-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs font-semibold">Nenhum registro de saúde cadastrado ainda.</p>
                <button
                  onClick={openNewRecordModal}
                  className="text-xs font-bold text-[#00A896] hover:underline"
                >
                  + Adicionar primeira vacina ou exame
                </button>
              </div>
            ) : (
              activePet.healthRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-[20px] bg-stone-50 hover:bg-stone-50/80 border border-stone-200/70 space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          rec.type === 'vacina'
                            ? 'bg-[#E4F6F3] text-[#00A896]'
                            : rec.type === 'exame'
                            ? 'bg-amber-100 text-amber-800'
                            : rec.type === 'medicacao'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {rec.type === 'vacina' ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : rec.type === 'exame' ? (
                          <Activity className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-bold text-xs sm:text-sm text-[#22333B]">
                            {rec.title}
                          </h5>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200">
                            {rec.type}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#6B7A83] mt-0.5">
                          {rec.vetName} • {rec.clinic || 'Clínica Parceira'}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[11px] font-mono font-bold text-[#00A896] mr-1 hidden sm:inline">
                        {rec.date}
                      </span>
                      <button
                        onClick={() => openEditRecordModal(rec)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-[#00A896] hover:bg-white cursor-pointer transition-colors"
                        title="Editar Registro"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRecordToDelete(rec)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-white cursor-pointer transition-colors"
                        title="Excluir Registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-[#00A896] sm:hidden">
                    Data: {rec.date}
                  </div>

                  {rec.nextDueDate && (
                    <p className="text-[10px] font-bold text-[#52B788] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Próxima dose prevista: {rec.nextDueDate}
                    </p>
                  )}

                  {rec.notes && (
                    <p className="text-[11px] text-stone-600 italic bg-white/70 p-2 rounded-xl border border-stone-200/50">
                      "{rec.notes}"
                    </p>
                  )}

                  {/* Document Attachment Button */}
                  {(rec.attachmentUrl || rec.documentName) && (
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => setViewingDocument(rec)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-stone-200 text-xs font-bold text-[#00A896] shadow-2xs cursor-pointer transition-all"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#00A896]" />
                        <span>Visualizar Documento ({rec.documentType?.toUpperCase() || 'ANEXO'})</span>
                        <Eye className="w-3.5 h-3.5 ml-1 text-stone-400" />
                      </button>

                      <span className="text-[10px] text-stone-400 truncate max-w-[150px]">
                        {rec.documentName || 'Documento Anexado'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gemini AI Health & Nutrition Advisor */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E4F6F3] text-[#00A896] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#22333B]">
                  Assistente Veterinário iPet (IA)
                </h3>
                <p className="text-[11px] text-[#6B7A83]">
                  Orientações nutricionais e triagem preventiva para {activePet.name}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#00A896] bg-[#E4F6F3] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini
            </span>
          </div>

          {/* Chat history */}
          <div className="max-h-56 overflow-y-auto space-y-2 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/60">
            {aiAnswers.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00A896] text-white rounded-br-xs'
                      : 'bg-white text-[#22333B] border border-stone-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-2 text-xs text-[#6B7A83] italic items-center p-2">
                <div className="w-2 h-2 rounded-full bg-[#00A896] animate-ping" />
                <span>Consultando diretrizes veterinárias e dosagem...</span>
              </div>
            )}
          </div>

          {/* Prompt input */}
          <form onSubmit={handleSendAiQuestion} className="flex gap-2">
            <input
              type="text"
              placeholder={`Pergunte algo sobre ${activePet.name} (ex: ração ideal, sintomas...)`}
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* ================= MODAL: EDIT PET ================= */}
      <AnimatePresence>
        {isEditPetModalOpen && (
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
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#22333B]">
                    Editar Dados do Pet
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditPetModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePetChanges} className="space-y-4">
                {/* Photo Upload in Edit Modal */}
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <img
                    src={editPhotoUrl}
                    alt={editName}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#00A896] shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#22333B]">Foto de Perfil</p>
                    <p className="text-[11px] text-[#6B7A83] mb-2">
                      Formatos aceitos: JPG, PNG ou WebP
                    </p>
                    <input
                      type="file"
                      ref={editPetAvatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setEditPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editPetAvatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-bold text-[#00A896] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Selecionar Nova Foto</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Nome do Pet
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Espécie
                    </label>
                    <select
                      value={editSpecies}
                      onChange={(e) => setEditSpecies(e.target.value as PetSpecies)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    >
                      <option value="cao">Cão 🐶</option>
                      <option value="gato">Gato 🐱</option>
                      <option value="outro">Outro Pet 🐾</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Raça
                    </label>
                    <input
                      type="text"
                      value={editBreed}
                      onChange={(e) => setEditBreed(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Peso Atual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Sexo
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as 'macho' | 'femea')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    >
                      <option value="femea">Fêmea</option>
                      <option value="macho">Macho</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Código do Microchip (ISO 11784)
                  </label>
                  <input
                    type="text"
                    value={editMicrochip}
                    onChange={(e) => setEditMicrochip(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Alergias (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Frango processado, Picada de pulga"
                    value={editAllergiesText}
                    onChange={(e) => setEditAllergiesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Condições Clínicas / Cuidados (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Displasia monitorada, Castrado"
                    value={editConditionsText}
                    onChange={(e) => setEditConditionsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Observações do Tutor
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditPetModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: DELETE PET CONFIRMATION ================= */}
      <AnimatePresence>
        {petToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-sm bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-[#22333B]">
                  Excluir Pet?
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Tem certeza que deseja excluir o cadastro de <strong>{petToDelete.name}</strong>?
                  Todos os registros de saúde, documentos e histórico serão removidos.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left">
                <img
                  src={petToDelete.photoUrl}
                  alt={petToDelete.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#22333B]">{petToDelete.name}</p>
                  <p className="text-[11px] text-[#6B7A83]">{petToDelete.breed} • {petToDelete.weightKg} kg</p>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setPetToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeletePet}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: CREATE / EDIT HEALTH RECORD & DOCUMENT ================= */}
      <AnimatePresence>
        {isRecordModalOpen && (
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
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#22333B]">
                    {editingRecord ? 'Editar Registro de Saúde' : 'Novo Registro de Saúde & Documento'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsRecordModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRecord} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1.5">
                    Categoria do Registro
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'vacina', label: 'Vacina', icon: ShieldCheck },
                      { type: 'exame', label: 'Exame', icon: Activity },
                      { type: 'medicacao', label: 'Remédio', icon: Heart },
                      { type: 'consulta', label: 'Consulta', icon: FileText },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = recType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setRecType(item.type as any)}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#00A896] text-white border-[#00A896] shadow-xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Título / Procedimento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vacina V10, Radiografia, Hemograma Completo"
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Data da Aplicação / Realização
                    </label>
                    <input
                      type="date"
                      required
                      value={recDate}
                      onChange={(e) => setRecDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Próxima Dose / Validade (Opcional)
                    </label>
                    <input
                      type="date"
                      value={recNextDue}
                      onChange={(e) => setRecNextDue(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Veterinário / CRMV
                    </label>
                    <input
                      type="text"
                      value={recVet}
                      onChange={(e) => setRecVet(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Clínica / Hospital
                    </label>
                    <input
                      type="text"
                      value={recClinic}
                      onChange={(e) => setRecClinic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#22333B] block mb-1">
                    Observações Clínicas / Lote
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Lote da vacina, instruções de posologia ou achados do exame"
                    value={recNotes}
                    onChange={(e) => setRecNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                  />
                </div>

                {/* Document Upload Area */}
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00A896] flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5" />
                      Anexar Documento / Laudo / Comprovante
                    </span>
                    {recDocName && (
                      <span className="text-[10px] font-bold text-[#52B788] bg-emerald-50 px-2 py-0.5 rounded-full border border-[#52B788]/30">
                        Arquivo Carregado
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={recordDocInputRef}
                    onChange={handleRecordDocumentUpload}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  {recDocUrl ? (
                    <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {recDocType === 'pdf' ? (
                          <FileText className="w-6 h-6 text-red-500 shrink-0" />
                        ) : (
                          <img
                            src={recDocUrl}
                            alt="Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#22333B] truncate">
                            {recDocName || 'documento_anexo'}
                          </p>
                          <p className="text-[10px] text-stone-500 uppercase">
                            Tipo: {recDocType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => recordDocInputRef.current?.click()}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#00A896] hover:bg-stone-50 rounded-lg cursor-pointer"
                        >
                          Substituir
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRecDocUrl(undefined);
                            setRecDocName(undefined);
                            setRecDocType(undefined);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Remover anexo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => recordDocInputRef.current?.click()}
                      className="w-full py-4 px-3 border-2 border-dashed border-[#00A896]/40 hover:border-[#00A896] rounded-xl flex flex-col items-center justify-center gap-1.5 bg-white cursor-pointer transition-colors"
                    >
                      <FileUp className="w-6 h-6 text-[#00A896]" />
                      <span className="text-xs font-bold text-[#00A896]">
                        Clique para anexar arquivo (PDF ou Foto)
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Laudos de exames, atestados, carteirinha física digitalizada
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecordModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingRecord ? 'Atualizar Registro' : 'Salvar Registro'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: DELETE HEALTH RECORD CONFIRMATION ================= */}
      <AnimatePresence>
        {recordToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-sm bg-white rounded-[26px] p-6 shadow-2xl border border-stone-200 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-[#22333B]">
                  Excluir Registro de Saúde?
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Deseja realmente remover o registro <strong>"{recordToDelete.title}"</strong> de {activePet.name}?
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteRecord}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: VIEW DOCUMENT ATTACHMENT ================= */}
      <AnimatePresence>
        {viewingDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-xl bg-white rounded-[28px] p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-bold text-[#00A896] uppercase tracking-wider block">
                    Documento Oficial • iPet Health
                  </span>
                  <h3 className="font-display font-bold text-base text-[#22333B]">
                    {viewingDocument.title}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl text-xs border border-stone-200/70">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Paciente Pet</span>
                  <span className="font-bold text-[#22333B]">{activePet.name} ({activePet.breed})</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Data Emissão</span>
                  <span className="font-bold text-[#22333B]">{viewingDocument.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Veterinário</span>
                  <span className="font-bold text-[#22333B]">{viewingDocument.vetName}</span>
                </div>
              </div>

              {/* Document Preview Display */}
              <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 text-center min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden">
                {viewingDocument.attachmentUrl ? (
                  <div className="space-y-3 w-full">
                    <img
                      src={viewingDocument.attachmentUrl}
                      alt={viewingDocument.title}
                      className="max-h-80 w-auto mx-auto rounded-xl object-contain shadow-md border border-stone-300"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs text-stone-600 font-mono">
                      <span>{viewingDocument.documentName || 'anexo_digitalizado.jpg'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-6">
                    <FileText className="w-14 h-14 mx-auto text-[#00A896]" />
                    <h5 className="font-bold text-sm text-[#22333B]">
                      Comprovante de Vacinação Digital Oficial
                    </h5>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Assinado digitalmente por {viewingDocument.vetName} na {viewingDocument.clinic}.
                      Código de validação criptográfica iPet ID #{viewingDocument.id}.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <a
                  href={viewingDocument.attachmentUrl || '#'}
                  download={viewingDocument.documentName || 'documento_ipet.pdf'}
                  onClick={(e) => {
                    if (!viewingDocument.attachmentUrl) {
                      e.preventDefault();
                      alert('Documento digital verificado. Certificado emitido com sucesso!');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Documento / PDF</span>
                </a>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: CREATE NEW PET ================= */}
      <AnimatePresence>
        {isNewPetModalOpen && (
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
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#22333B]">
                    Cadastrar Novo Pet
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewPetModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePet} className="space-y-4">
                {/* Photo upload for new pet */}
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <img
                    src={
                      newPetPhotoUrl ||
                      (newPetSpecies === 'cao'
                        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80')
                    }
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-[#00A896] shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#22333B]">Foto do Pet</p>
                    <p className="text-[11px] text-[#6B7A83] mb-2">
                      Envie uma foto clara do seu pet
                    </p>
                    <input
                      type="file"
                      ref={newPetAvatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setNewPetPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => newPetAvatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-bold text-[#00A896] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{newPetPhotoUrl ? 'Trocar Foto' : 'Carregar Foto'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Nome do Pet
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Luna, Thor"
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Espécie
                    </label>
                    <select
                      value={newPetSpecies}
                      onChange={(e) => setNewPetSpecies(e.target.value as PetSpecies)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    >
                      <option value="cao">Cão 🐶</option>
                      <option value="gato">Gato 🐱</option>
                      <option value="outro">Outro Pet 🐾</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Raça
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Golden, Poodle, SRD"
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Peso Estimado (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newPetWeight}
                      onChange={(e) => setNewPetWeight(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={newPetBirth}
                      onChange={(e) => setNewPetBirth(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#22333B] block mb-1">
                      Sexo
                    </label>
                    <select
                      value={newPetGender}
                      onChange={(e) => setNewPetGender(e.target.value as 'macho' | 'femea')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#00A896]"
                    >
                      <option value="femea">Fêmea</option>
                      <option value="macho">Macho</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPetModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#00A896] hover:bg-[#027368] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Concluir Cadastro</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: QR CODE VETERINARY PRESENTATION ================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-[28px] p-6 shadow-2xl border border-stone-200 text-center space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-[#00A896] uppercase">
                Acesso Clínico Seguro
              </span>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
              <div className="w-44 h-44 bg-white p-2 rounded-xl border-2 border-[#00A896] flex items-center justify-center mx-auto shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://ipet.app/passport/${activePet.id}`}
                  alt="QR Code iPet ID"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-base text-[#22333B]">
                {activePet.name} • Microchip {activePet.microchipCode}
              </h4>
              <p className="text-xs text-[#6B7A83] mt-1 leading-relaxed">
                Peça ao veterinário para escanear a câmera no QR Code para liberar o prontuário vacinal e radiografias em tempo real.
              </p>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#22333B] font-bold text-xs cursor-pointer"
            >
              Fechar QR Code
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
