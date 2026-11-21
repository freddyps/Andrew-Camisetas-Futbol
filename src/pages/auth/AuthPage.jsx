import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  Check,
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import {
  sanitizeText,
  checkLoginRateLimit,
  resetLoginAttempts,
  isAuthorizedAdminEmail,
  verifyAdminPasswordHash
} from '../../utils/security';

/**
 * Traduce los mensajes técnicos de Supabase Auth a español claro y amigable.
 */
function traducirErrorSupabase(rawMessage = '') {
  const msg = rawMessage.toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'Este correo electrónico ya tiene una cuenta registrada. Haz clic en "INGRESAR" para iniciar sesión con tu cuenta.';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
    return 'Correo o contraseña incorrectos. Verifica tus datos e inténtalo nuevamente.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada o spam.';
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Demasiados intentos seguidos. Por favor espera un minuto antes de volver a intentarlo.';
  }
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('load failed')) {
    return 'No se pudo conectar con el servidor de cuentas (Supabase puede estar en pausa o sin conexión). Si eres Administrador, verifica tu correo y contraseña.';
  }
  return rawMessage || 'Ocurrió un inconveniente al procesar tu solicitud.';
}

/**
 * AuthPage:
 * Página completa e independiente de Iniciar Sesión y Registrarse.
 * Incluye visor de contraseña (ojo), confirmación de contraseña, indicadores de seguridad
 * en tiempo real y pantalla de confirmación tras el registro.
 */
export default function AuthPage({
  initialMode = 'login', // 'login' | 'register'
  onLoginSuccess = () => {},
  onBackToHome = () => {}
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [yaRegistradoSugerencia, setYaRegistradoSugerencia] = useState(false);

  // Reglas de seguridad de contraseña en tiempo real (para Registro)
  const reqLongitud = password.length >= 6;
  const reqMayuscula = /[A-ZÁÉÍÓÚÑ]/.test(password);
  const reqNumero = /[0-9]/.test(password);
  const reqCoincide = confirmPassword.length > 0 && password === confirmPassword;
  const passwordSegura = reqLongitud && reqMayuscula && reqNumero;

  const cambiarModo = (nuevoModo) => {
    setMode(nuevoModo);
    setErrorMsg('');
    setSuccessMsg('');
    setYaRegistradoSugerencia(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg('');
    setSuccessMsg('');
    setYaRegistradoSugerencia(false);

    const sanitizedEmail = sanitizeText(email).toLowerCase();
    const sanitizedNombre = sanitizeText(nombre);

    // Rate Limiting preventivo
    const rateCheck = checkLoginRateLimit(sanitizedEmail || 'auth-attempt', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMsg(rateCheck.errorMsg);
      return;
    }

    // Verificación criptográfica SHA-256 para cuenta de Administrador
    // No almacena ninguna contraseña en texto plano en el código fuente
    if (mode === 'login' && isAuthorizedAdminEmail(sanitizedEmail)) {
      const esHashAdminValido = await verifyAdminPasswordHash(sanitizedEmail, password);
      if (esHashAdminValido) {
        resetLoginAttempts(sanitizedEmail || 'auth-attempt');
        const nombreAdmin = sanitizedEmail.startsWith('freddy')
          ? 'Freddy · Admin Andrew'
          : 'Brice · Admin Andrew';
        setSuccessMsg(`¡Bienvenido ${nombreAdmin}! Acceso de alta seguridad verificado.`);
        setTimeout(() => {
          onLoginSuccess({
            email: sanitizedEmail,
            role: 'ADMIN',
            nombre: nombreAdmin
          });
        }, 500);
        return;
      } else {
        setErrorMsg('Contraseña de Administrador incorrecta. Verifica las mayúsculas y símbolos.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: password,
        });

        if (error) {
          setErrorMsg(traducirErrorSupabase(error.message));
          setLoading(false);
          return;
        }

        resetLoginAttempts(sanitizedEmail);
        const usuario = data.user;
        const nombreDetectado = usuario.user_metadata?.full_name || 
                                usuario.user_metadata?.nombre || 
                                usuario.email.split('@')[0];

        setSuccessMsg(`¡Bienvenido de vuelta, ${nombreDetectado}! Ingresando a tu cuenta...`);
        setTimeout(() => {
          onLoginSuccess({
            id: usuario.id,
            email: usuario.email,
            role: isAuthorizedAdminEmail(usuario.email) ? 'ADMIN' : 'CLIENTE',
            nombre: nombreDetectado,
            supabaseUser: usuario
          });
        }, 600);

      } else if (mode === 'register') {
        if (isAuthorizedAdminEmail(sanitizedEmail)) {
          setErrorMsg('Este correo está reservado para la administración del sistema.');
          setLoading(false);
          return;
        }
        if (!nombre.trim() || !email || !password || !confirmPassword) {
          setErrorMsg('Por favor completa todos los campos para crear tu cuenta.');
          setLoading(false);
          return;
        }

        if (!reqLongitud) {
          setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }

        if (!reqMayuscula) {
          setErrorMsg('Por seguridad, la contraseña debe incluir al menos una letra MAYÚSCULA.');
          setLoading(false);
          return;
        }

        if (!reqNumero) {
          setErrorMsg('Por seguridad, la contraseña debe incluir al menos un NÚMERO (0-9).');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Las contraseñas no coinciden. Verifica que ambas sean iguales.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password: password,
          options: {
            data: {
              full_name: sanitizedNombre,
              nombre: sanitizedNombre,
            },
          },
        });

        if (error) {
          const msgTraducido = traducirErrorSupabase(error.message);
          setErrorMsg(msgTraducido);
          if (error.message.toLowerCase().includes('already registered')) {
            setYaRegistradoSugerencia(true);
          }
          setLoading(false);
          return;
        }

        resetLoginAttempts(sanitizedEmail);
        const usuario = data.user;

        if (data.session) {
          setSuccessMsg(`¡Cuenta creada con éxito, ${sanitizedNombre}! Iniciando tu sesión...`);
          setTimeout(() => {
            onLoginSuccess({
              id: usuario.id,
              email: usuario.email,
              role: 'CLIENTE',
              nombre: sanitizedNombre,
              supabaseUser: usuario
            });
          }, 900);
        } else {
          setSuccessMsg(`¡Felicidades ${sanitizedNombre}! Tu cuenta ha sido registrada con éxito. Entrando a la tienda...`);
          setTimeout(() => {
            onLoginSuccess({
              id: usuario?.id,
              email: sanitizedEmail,
              role: 'CLIENTE',
              nombre: sanitizedNombre,
            });
          }, 1000);
        }
      }
    } catch (err) {
      setErrorMsg(traducirErrorSupabase(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-txt-main pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start font-['Montserrat',sans-serif] select-none transition-colors">
      <div className="w-full max-w-xl">
        
        {/* Barra Superior con Botón Volver y Sello de Acceso Seguro */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-txt-main bg-surface-card hover:bg-surface-sub border border-stroke px-4 py-2.5 rounded-xl transition-all cursor-pointer group shadow-sm"
          >
            <ArrowLeft size={16} className="text-andrew-primary group-hover:-translate-x-1 transition-transform" />
            <span>VOLVER A LA TIENDA</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 bg-andrew-primary/15 border border-andrew-primary/30 text-andrew-primary text-[11px] font-black uppercase px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} />
            <span>ACCESO OFICIAL ANDREW</span>
          </span>
        </div>

        {/* Tarjeta Principal de Autenticación */}
        <div className="bg-surface-card border border-stroke rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden auth-modal-card transition-colors">
          
          {/* Luz de acento sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-andrew-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Icono de Cabecera */}
          <div className="flex flex-col items-center text-center space-y-3 mb-7">
            <div className="w-16 h-16 rounded-2xl bg-andrew-primary/15 border border-andrew-primary/30 flex items-center justify-center text-andrew-primary shadow-[0_0_25px_rgba(34,197,94,0.2)]">
              <User size={30} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl uppercase tracking-tight text-txt-main">
                {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
              </h1>
              <p className="text-txt-muted text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                {mode === 'login' 
                  ? 'Accede a tu cuenta de Andrew Camisetas para ver tus compras y gestionar tus pedidos.' 
                  : 'Únete a la comunidad de hinchas y guarda tus camisetas oficiales favoritas.'}
              </p>
            </div>

            {/* Alternador de Pestañas Iniciar Sesión / Registrarse */}
            <div className="w-full grid grid-cols-2 gap-2 bg-surface-sub p-1.5 rounded-2xl border border-stroke mt-2">
              <button
                type="button"
                onClick={() => cambiarModo('login')}
                className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-andrew-primary text-black shadow-md'
                    : 'text-txt-muted hover:text-txt-main'
                }`}
              >
                <span>INGRESAR</span>
              </button>

              <button
                type="button"
                onClick={() => cambiarModo('register')}
                className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-andrew-primary text-black shadow-md'
                    : 'text-txt-muted hover:text-txt-main'
                }`}
              >
                <span>REGISTRARSE</span>
              </button>
            </div>
          </div>

          {/* Mensajes de Alerta en Español + Acción Rápida si ya está registrado */}
          {errorMsg && (
            <div className="mb-5 bg-red-500/15 border border-red-500/35 text-red-500 dark:text-red-400 p-4 rounded-2xl text-xs space-y-2.5 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="font-bold leading-relaxed">{errorMsg}</span>
              </div>
              {yaRegistradoSugerencia && (
                <div className="pt-1 pl-6">
                  <button
                    type="button"
                    onClick={() => cambiarModo('login')}
                    className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-black text-[11px] uppercase px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <span>Ir a Iniciar Sesión con este correo</span>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 bg-andrew-primary/20 border-2 border-andrew-primary text-txt-main p-4 rounded-2xl text-xs flex items-center gap-3 animate-fadeIn shadow-md">
              <div className="w-8 h-8 rounded-xl bg-andrew-primary text-black flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm leading-snug">{successMsg}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-black uppercase text-txt-muted mb-1.5">
                  NOMBRE COMPLETO: *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full bg-input-bg border border-stroke rounded-xl px-4 py-3 pr-10 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary transition-colors font-medium"
                  />
                  <User size={16} className="absolute right-4 text-txt-muted pointer-events-none" />
                </div>
              </div>
            )}

            {/* Correo Electrónico */}
            <div>
              <label className="block text-[11px] font-black uppercase text-txt-muted mb-1.5">
                CORREO ELECTRÓNICO: *
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-input-bg border border-stroke rounded-xl px-4 py-3 pr-10 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary transition-colors font-medium"
                />
                <Mail size={16} className="absolute right-4 text-txt-muted pointer-events-none" />
              </div>
            </div>

            {/* Contraseña con botón Ver / Ocultar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-black uppercase text-txt-muted flex items-center gap-1.5">
                  <Lock size={12} className="text-andrew-primary" />
                  <span>CONTRASEÑA: *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] font-extrabold text-andrew-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Ocultar' : 'Mostrar contraseña'}</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Ej: Andrew2026' : '••••••••'}
                  className="w-full bg-input-bg border border-stroke rounded-xl px-4 py-3 pr-11 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary transition-colors font-medium"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 p-1.5 rounded-lg text-txt-muted hover:text-txt-main transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña + Indicadores de Seguridad en modo Registro */}
            {mode === 'register' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-black uppercase text-txt-muted flex items-center gap-1.5">
                      <Lock size={12} className="text-andrew-primary" />
                      <span>CONFIRMAR CONTRASEÑA: *</span>
                    </label>
                    {confirmPassword.length > 0 && (
                      <span className={`text-[11px] font-extrabold flex items-center gap-1 ${
                        reqCoincide ? 'text-andrew-primary' : 'text-red-500'
                      }`}>
                        {reqCoincide ? '✓ Coinciden' : '✕ No coinciden'}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className={`w-full bg-input-bg border rounded-xl px-4 py-3 pr-11 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none transition-colors font-medium ${
                        confirmPassword.length > 0
                          ? reqCoincide
                            ? 'border-andrew-primary'
                            : 'border-red-500'
                          : 'border-stroke focus:border-andrew-primary'
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 p-1.5 rounded-lg text-txt-muted hover:text-txt-main transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Checklist visual de seguridad de contraseña */}
                <div className="bg-surface-sub border border-stroke rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider">
                      REQUISITOS DE SEGURIDAD:
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      passwordSegura
                        ? 'bg-andrew-primary/20 text-andrew-primary'
                        : 'bg-surface-card text-txt-muted border border-stroke'
                    }`}>
                      {passwordSegura ? 'Contraseña Segura ✓' : 'Completa los 3 puntos'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
                    {[
                      { ok: reqLongitud, label: 'Mín. 6 caracteres' },
                      { ok: reqMayuscula, label: '1 Mayúscula (A-Z)' },
                      { ok: reqNumero, label: '1 Número (0-9)' },
                    ].map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
                          rule.ok
                            ? 'bg-andrew-primary/15 border-andrew-primary/40 text-txt-main'
                            : 'bg-surface-card border-stroke text-txt-muted'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          rule.ok ? 'bg-andrew-primary text-black' : 'bg-surface-sub text-txt-muted border border-stroke'
                        }`}>
                          {rule.ok && <Check size={10} strokeWidth={3.5} />}
                        </div>
                        <span className="truncate">{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-andrew-primary hover:bg-[#1fa75d] disabled:opacity-50 text-black font-black text-xs sm:text-sm uppercase py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-[0_4px_25px_rgba(34,197,94,0.35)] mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>PROCESANDO...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'INGRESAR AHORA' : 'CREAR MI CUENTA'}</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Enlace para cambiar de modo */}
          <div className="text-center pt-6 mt-6 border-t border-stroke">
            {mode === 'login' ? (
              <p className="text-xs text-txt-muted">
                ¿Aún no tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => cambiarModo('register')}
                  className="text-andrew-primary font-black hover:underline cursor-pointer ml-1"
                >
                  REGÍSTRATE AQUÍ
                </button>
              </p>
            ) : (
              <p className="text-xs text-txt-muted">
                ¿Ya tienes una cuenta creada?{' '}
                <button
                  type="button"
                  onClick={() => cambiarModo('login')}
                  className="text-andrew-primary font-black hover:underline cursor-pointer ml-1"
                >
                  INICIA SESIÓN
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
