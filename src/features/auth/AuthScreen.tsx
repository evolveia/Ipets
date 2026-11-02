import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/brand/Logo';
import { Mail, Lock, Phone, User, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBackToLanding }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('anabeatriz@ipet.app.br');
  const [password, setPassword] = useState('••••••••');
  const [phone, setPhone] = useState('(11) 98452-1920');
  const [name, setName] = useState('Ana Beatriz Silveira');
  const [petName, setPetName] = useState('Pipoca');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 700);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col justify-between p-4 sm:p-6 text-[#22333B]">
      {/* Top back button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6B7A83] hover:text-[#00A896] transition-colors py-1.5 px-3 rounded-full bg-stone-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar à Apresentação
        </button>

        <span className="text-[11px] font-semibold text-[#00A896] bg-[#E4F6F3] px-2.5 py-1 rounded-full">
          Ambiente Seguro SSL
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xl border border-stone-200/80">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Logo size="lg" showTagline={false} />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#22333B]">
              {authMode === 'login' ? 'Bem-vindo de volta!' : 'Cadastre-se no iPet'}
            </h2>
            <p className="text-xs text-[#6B7A83] mt-1">
              {authMode === 'login'
                ? 'Acesse a saúde, ração e cuidados do seu pet em minutos'
                : 'Crie seu passaporte iPet ID e receba entregas rápidas'}
            </p>
          </div>

          {/* Quick Demo Login Button */}
          <div className="mb-6">
            <button
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-[16px] bg-gradient-to-r from-[#00A896]/10 to-[#FF9F1C]/15 border-2 border-[#00A896]/30 hover:border-[#00A896] text-[#00A896] font-bold text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 text-left">
                <span className="text-lg">🐾</span>
                <div>
                  <p className="text-[#22333B] font-extrabold leading-tight">Entrar como Tutor Demo</p>
                  <p className="text-[11px] text-[#6B7A83]">Ana Beatriz + Pipoca (Perfil Completo)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#00A896]" />
            </button>
            <div className="relative my-4 text-center">
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-stone-200" />
              <span className="relative bg-white px-3 text-[11px] font-semibold text-[#6B7A83] uppercase">
                ou continue com
              </span>
            </div>
          </div>

          {/* Segmented Auth Mode Switch */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#22333B] shadow-sm'
                  : 'text-[#6B7A83] hover:text-[#22333B]'
              }`}
            >
              Já tenho conta
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-[#22333B] shadow-sm'
                  : 'text-[#6B7A83] hover:text-[#22333B]'
              }`}
            >
              Criar nova conta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B7A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full pl-10 pr-3 py-2.5 rounded-[12px] bg-stone-50 border border-stone-200 text-xs font-semibold text-[#22333B] focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                    Nome do seu primeiro Pet
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🐶</span>
                    <input
                      type="text"
                      required
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Ex: Thor, Mel, Luke..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-[12px] bg-stone-50 border border-stone-200 text-xs font-semibold text-[#22333B] focus:outline-none focus:border-[#00A896]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#6B7A83] uppercase block mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-[12px] bg-stone-50 border border-stone-200 text-xs font-semibold text-[#22333B] focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#6B7A83] uppercase">
                  Senha
                </label>
                {authMode === 'login' && (
                  <button type="button" className="text-[10px] font-semibold text-[#00A896] hover:underline">
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B7A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full pl-10 pr-3 py-2.5 rounded-[12px] bg-stone-50 border border-stone-200 text-xs font-semibold text-[#22333B] focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 rounded-[14px] bg-[#FF9F1C] hover:bg-[#F08B07] text-white font-bold text-sm shadow-md shadow-[#FF9F1C]/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Entrar no iPet' : 'Concluir Cadastro Grátis'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center pb-2 text-[11px] text-[#6B7A83]">
        Ao continuar, você concorda com a Política de Proteção Animal e Termos de Serviço iPet.
      </div>
    </div>
  );
};
