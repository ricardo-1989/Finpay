import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Logo from './Logo';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // AuthProvider will handle the session state update which App.tsx listens to
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos. Por favor, tente novamente.'
        : 'Erro ao conectar. Verifique sua internet.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-black">
      <div className="absolute inset-0 z-0">
        <img
          alt="Real Estate Background"
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2096&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center md:justify-start px-4 md:px-24">
        <div className="flex flex-col w-full max-w-[440px]">
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-lg text-white shrink-0">
              <Logo className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-white text-3xl font-black tracking-tight leading-none">FinPay</span>
              <span className="text-secondary text-[11px] font-bold tracking-[0.05em] uppercase leading-none">Sistema de Gestão Inteligente</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
            <div className="pt-10 pb-2 px-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo</h2>
              <p className="text-secondary text-sm font-medium mt-1">Gestão Financeira Inteligente</p>
            </div>

            <div className="p-8 pt-6">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 animate-scale-up">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">E-mail</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">mail</span>
                    </div>
                    <input
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                      placeholder="usuario@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">lock</span>
                    </div>
                    <input
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="button" className="text-sm font-medium text-secondary hover:text-orange-700 transition-colors">
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className={`mt-2 w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  type="submit"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">sync</span>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <span className="material-symbols-outlined text-white/80 text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-300 via-secondary to-orange-700"></div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-end h-[440px] ml-16 text-white max-w-lg pb-4">
          <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-lg">Gerencie cobranças com eficiência.</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
              <span className="text-sm font-medium">Controle financeiro imobiliário</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
              <span className="text-sm font-medium">Relatórios em Tempo Real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
