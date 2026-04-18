import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// COMPONENTE: Register (Página de registro y login)
// Descripción: Página con formularios de registro e inicio de sesión
// Props:
//   - onBack: función para volver a la página anterior
//   - onLogin: función para completar el login
// ============================================================================

export default function Register({ onBack, onLogin }) {
  // Estado para alternar entre login y registro
  const [isLogin, setIsLogin] = useState(true);
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado del formulario de login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  // Estado del formulario de registro
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  // Estado para mensajes
  const [message, setMessage] = useState('');

  // Manejar cambios en formulario de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  // Manejar cambios en formulario de registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  // Manejar envío de login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    // Validar email
    if (!loginForm.email.includes('@')) {
      setMessage('Por favor ingresa un email válido');
      return;
    }

    setMessage('✅ ¡Sesión iniciada exitosamente!');
    setTimeout(() => {
      onLogin({
        name: 'Usuario',
        email: loginForm.email,
      });
    }, 1000);
  };

  // Manejar envío de registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setMessage('Por favor completa todos los campos requeridos');
      return;
    }

    if (registerForm.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!registerForm.email.includes('@')) {
      setMessage('Por favor ingresa un email válido');
      return;
    }

    setMessage('✅ ¡Registro exitoso! Iniciando sesión...');
    setTimeout(() => {
      onLogin({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        address: registerForm.address,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-black">
      <div className="px-6 md:px-10 py-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#22c55e] transition-colors"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>

      <div className="px-6 md:px-10 pb-16">
        <div className="mx-auto max-w-xl bg-white border border-gray-200 shadow-xl p-10 rounded-none">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Cuenta</p>
            <h1 className="text-4xl font-extrabold text-black tracking-tight">
              {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Accede a tu perfil y carrito con seguridad.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            <button
              onClick={() => setIsLogin(true)}
              className={`py-3 text-sm font-semibold transition ${
                isLogin
                  ? 'bg-[#22c55e] text-black border border-[#22c55e]'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Inicia sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`py-3 text-sm font-semibold transition ${
                !isLogin
                  ? 'bg-[#22c55e] text-black border border-[#22c55e]'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Regístrate
            </button>
          </div>

          <div className="space-y-6">
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      placeholder="tu@email.com"
                      className="w-full rounded-none border border-gray-300 px-4 pl-12 py-4 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className="w-full rounded-none border border-gray-300 px-4 pl-12 py-4 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`rounded-none border p-4 text-center text-sm font-semibold ${
                    message.includes('✅')
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-none bg-[#111827] py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#222b3b]"
                >
                  Iniciar sesión
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                      placeholder="Juan Pérez"
                      className="w-full rounded-none border border-gray-300 px-4 pl-12 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="tu@email.com"
                      className="w-full rounded-none border border-gray-300 px-4 pl-12 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className="w-full rounded-none border border-gray-300 px-4 pl-12 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Confirmar contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className="w-full rounded-none border border-gray-300 px-4 pl-12 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={registerForm.phone}
                      onChange={handleRegisterChange}
                      placeholder="+34 612 345 678"
                      className="w-full rounded-none border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={registerForm.address}
                      onChange={handleRegisterChange}
                      placeholder="Calle Principal 123"
                      className="w-full rounded-none border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`rounded-none border p-4 text-center text-sm font-semibold ${
                    message.includes('✅')
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-none bg-[#111827] py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#222b3b]"
                >
                  Crear cuenta
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </form>
            )}
          </div>

          <div className="mt-10 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-3">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
              className="text-[#22c55e] font-semibold text-sm hover:text-[#1fa75d] transition-colors"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
