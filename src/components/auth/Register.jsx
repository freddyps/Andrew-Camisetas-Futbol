import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../supabaseClient';

export default function Register({ onBack, onLogin, messageOverride }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [message, setMessage] = useState(messageOverride || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setMessage('Por favor completa todos los campos.');
      return;
    }
    if (!supabaseUrl || !supabaseAnonKey) {
      setMessage('Supabase no está configurado. Agrega las credenciales al archivo .env');
      return;
    }

    setIsLoading(true);
    setMessage('Verificando credenciales...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setMessage('✅ Sesión iniciada correctamente.');
        onLogin({
          name: data.user.user_metadata?.name || 'Usuario',
          email: data.user.email,
          phone: data.user.user_metadata?.phone || '',
          address: data.user.user_metadata?.address || '',
        });
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }
    if (registerForm.password.length < 6) {
      setMessage('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    setMessage('Creando tu cuenta...');

    try {
      const { data, error } = await supabase.auth.signUp(
        {
          email: registerForm.email,
          password: registerForm.password,
        },
        {
          data: {
            name: registerForm.name,
            phone: registerForm.phone,
            address: registerForm.address,
          },
        }
      );

      if (error) {
        setMessage(`Error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setMessage('✅ Cuenta creada. Revisa tu email para verificar la cuenta.');
        onLogin({
          name: registerForm.name,
          email: registerForm.email,
          phone: registerForm.phone,
          address: registerForm.address,
        });
      } else {
        setMessage('Registro completado. Por favor, verifica tu correo.');
      }
    } catch (err) {
      setMessage('Error de comunicación con Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setMessage('Supabase no está configurado.');
      return;
    }
    try {
      setMessage('Redirigiendo a Google...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
        },
      });
      if (error) setMessage(`Error: ${error.message}`);
    } catch (err) {
      setMessage('Error al intentar autenticar con Google.');
    }
  };

  const passwordsMatch = registerForm.password && registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          onClick={onBack}
          className="mb-10 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        {/* CONTAINER DEL FORMULARIO (GLASS PANEL) */}
        <div className="max-w-xl mx-auto glass-panel border border-white/10 p-8 sm:p-10 shadow-2xl animate-fade-in-up">
          
          <div className="mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#22c55e] font-display font-black glow-text-green">CLUB ANDREW</p>
            <h1 className="text-3xl font-display font-black uppercase text-white mt-2">
              {isLogin ? 'Acceso de Socio' : 'Crear Cuenta'}
            </h1>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Guarda tus favoritos, realiza pedidos express y revisa tus compras.
            </p>
          </div>

          {/* Selector de pestañas */}
          <div className="grid grid-cols-2 gap-2 mb-8 border-b border-white/5 pb-6">
            <button
              onClick={() => { setIsLogin(true); setMessage(''); }}
              className={`py-3.5 text-xs font-display font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                isLogin 
                  ? 'border-[#22c55e] bg-[#22c55e]/10 text-white glow-green-sm' 
                  : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-gray-400'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setMessage(''); }}
              className={`py-3.5 text-xs font-display font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                !isLogin 
                  ? 'border-[#22c55e] bg-[#22c55e]/10 text-white glow-green-sm' 
                  : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-gray-400'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Mensajes de feedback */}
          {message && (
            <div className={`p-4 text-xs font-semibold mb-6 border ${
              message.includes('✅') 
                ? 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]' 
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* Formulario Login */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="socio@email.com"
                    className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-4 text-xs font-display font-black uppercase tracking-[0.1em] transition-all glow-green cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full border border-white/10 hover:border-white/20 bg-white/5 py-4 text-xs font-display font-black uppercase tracking-[0.1em] text-white transition-colors cursor-pointer"
              >
                Entrar con Google
              </button>
            </form>
          ) : (
            // Formulario Registro
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    placeholder="Ej: Paolo Guerrero"
                    className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="socio@email.com"
                    className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="password"
                      name="password"
                      required
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Min. 6 caracteres"
                      className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Confirmar Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                      className="w-full bg-[#050505] border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {registerForm.confirmPassword && (
                <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${passwordsMatch ? 'text-[#22c55e] glow-text-green' : 'text-red-400'}`}>
                  {passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    placeholder="+51 934 353 097"
                    className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Dirección de Entrega</label>
                  <input
                    type="text"
                    name="address"
                    value={registerForm.address}
                    onChange={handleRegisterChange}
                    placeholder="Ej: Av. Javier Prado 123"
                    className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-4 text-xs font-display font-black uppercase tracking-[0.1em] transition-all glow-green cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center mt-4"
              >
                {isLoading ? 'Creando cuenta...' : 'Registrar Cuenta'}
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
            * CAMPOS OBLIGATORIOS
          </div>
        </div>
      </div>
    </div>
  );
}
