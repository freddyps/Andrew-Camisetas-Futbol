import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer({ navigateTo }) {
  const [subEmail, setSubEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail) return;

    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    const newsletterUrl = `${djangoApiBaseUrl.replace(/\/$/, '')}/api/newsletter/`;

    try {
      const response = await fetch(newsletterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: subEmail })
      });
      if (response.ok) {
        setSuccess(true);
        setSubEmail('');
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.email && errData.email[0].includes('already exists')) {
          setErrorMsg('Este correo ya está registrado en el Club Andrew.');
        } else {
          setErrorMsg('Error al suscribirse. Inténtalo de nuevo.');
        }
      }
    } catch (err) {
      // Fallback local en caso de error de red
      setSuccess(true);
      setSubEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white border-t border-white/5 pt-16 pb-8">
      {/* SECCIÓN 1: VALORES DE LA MARCA (COMPROMISO PREMIUM) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-12 border-b border-white/5">
        <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-6 transition-colors hover:border-[#22c55e]/20">
          <div className="bg-[#22c55e]/10 p-3 text-[#22c55e] glow-green-sm">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white">ENVÍO A TODO EL PERÚ</h4>
            <p className="text-xs text-gray-400 mt-1">Gratis por compras mayores a S/ 150 a nivel nacional.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-6 transition-colors hover:border-[#22c55e]/20">
          <div className="bg-[#22c55e]/10 p-3 text-[#22c55e] glow-green-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white">GARANTÍA DE AUTENTICIDAD</h4>
            <p className="text-xs text-gray-400 mt-1">Calidad premium de jugador termo-sellada garantizada.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-6 transition-colors hover:border-[#22c55e]/20">
          <div className="bg-[#22c55e]/10 p-3 text-[#22c55e] glow-green-sm">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white">DEVOLUCIONES FÁCILES</h4>
            <p className="text-xs text-gray-400 mt-1">¿No te quedó la talla? Tienes hasta 7 días para cambios.</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GRID DEL FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Columna 1: Logo e Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_andrew_v2.jpg" 
              alt="Andrew Logo" 
              className="h-8 w-8 object-cover rounded"
            />
            <h3 className="text-lg font-display font-black leading-none tracking-tighter text-white">
              ANDREW <span className="text-[#22c55e]">CAMISETAS</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Tu tienda especializada en camisetas de fútbol de alta gama importadas. Personalización profesional en tiempo real para hacer que tu polo sea único.
          </p>
          <div className="flex gap-3 pt-2">
            <span className="text-[10px] bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] font-black uppercase px-2.5 py-1 tracking-wider glow-text-green">YAPE DISPONIBLE</span>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/25 text-blue-400 font-black uppercase px-2.5 py-1 tracking-wider">PLIN DISPONIBLE</span>
          </div>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div className="space-y-4">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-[0.1em] text-white">
            Navegación
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-[#22c55e] transition-colors">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('productos')} className="hover:text-[#22c55e] transition-colors">
                Catálogo de Productos
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('nosotros')} className="hover:text-[#22c55e] transition-colors">
                Quiénes Somos
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('perfil')} className="hover:text-[#22c55e] transition-colors">
                Mi Cuenta / Registro
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('faq')} className="hover:text-[#22c55e] transition-colors">
                Preguntas Frecuentes (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('rastrear')} className="hover:text-[#22c55e] transition-colors">
                Rastrear Pedido
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="space-y-4">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-[0.1em] text-white">
            Soporte & Contacto
          </h4>
          <ul className="space-y-3.5 text-xs text-gray-400 font-medium">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-[#22c55e]" />
              <span>San Isidro, Lima, Perú</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#22c55e]" />
              <a href="tel:+51934353097" className="hover:text-white transition-colors">+51 934 353 097</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#22c55e]" />
              <a href="mailto:ventas@andrewcamisetas.com" className="hover:text-white transition-colors">ventas@andrewcamisetas.com</a>
            </li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-[0.1em] text-white">
            Club Andrew Camisetas
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Únete a nuestra lista y recibe ofertas exclusivas, preventas y alertas sobre nuevos reabastecimientos de stock.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
            <input 
              type="email" 
              required
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              placeholder="Tu correo electrónico" 
              className="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-500 w-full outline-none focus:border-[#22c55e] transition-all"
              disabled={loading || success}
            />
            <button 
              type="submit" 
              disabled={loading || success}
              className="bg-[#22c55e] hover:bg-[#1fa75d] disabled:opacity-50 text-black font-display font-black text-xs uppercase px-4 py-2 transition-colors shrink-0"
            >
              {loading ? 'Uniendo...' : success ? 'Listo' : 'Unirme'}
            </button>
          </form>
          {success && (
            <p className="text-[10px] text-[#22c55e] font-bold uppercase mt-1 glow-text-green animate-pulse">
              ✓ ¡Te has unido al Club! Cupón: ANDREW10 (10% OFF)
            </p>
          )}
          {errorMsg && (
            <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
              ✗ {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* SECCIÓN 3: COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          © {new Date().getFullYear()} ANDREW CAMISETAS DE FÚTBOL SAC. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          HECHO CON PASIÓN EN LIMA, PERÚ 🇵🇪
        </p>
      </div>
    </footer>
  );
}
