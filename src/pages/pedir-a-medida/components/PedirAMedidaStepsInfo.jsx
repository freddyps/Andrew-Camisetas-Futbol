import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Detecta la paleta de colores representativa según el equipo escrito por el usuario
 * para que la vista previa de la camiseta cambie de color dinámicamente.
 */
function obtenerColoresEquipo(nombreEquipo = '') {
  const q = nombreEquipo.toLowerCase();

  if (q.includes('real madrid')) {
    return { fondo: '#f8fafc', detalle: '#d97706', texto: '#0f172a', numero: '#0f172a', borde: '#cbd5e1' };
  }
  if (q.includes('barcelona') || q.includes('barça')) {
    return { fondo: '#1e3a8a', franja: '#991b1b', detalle: '#facc15', texto: '#facc15', numero: '#facc15', borde: '#1e40af' };
  }
  if (q.includes('per') || q.includes('bicolor')) {
    return { fondo: '#ffffff', bandaRoja: true, detalle: '#dc2626', texto: '#dc2626', numero: '#dc2626', borde: '#e2e8f0' };
  }
  if (q.includes('milan')) {
    return { fondo: '#991b1b', franja: '#111827', detalle: '#ffffff', texto: '#ffffff', numero: '#ffffff', borde: '#7f1d1d' };
  }
  if (q.includes('city') || q.includes('argentina') || q.includes('cristal')) {
    return { fondo: '#38bdf8', detalle: '#ffffff', texto: '#0f172a', numero: '#0f172a', borde: '#0284c7' };
  }
  if (q.includes('boca')) {
    return { fondo: '#1d4ed8', franjaHorizontal: '#facc15', detalle: '#facc15', texto: '#facc15', numero: '#facc15', borde: '#1e40af' };
  }
  if (q.includes('alianza')) {
    return { fondo: '#1e3a8a', franja: '#ffffff', detalle: '#1e3a8a', texto: '#facc15', numero: '#dc2626', borde: '#1e3a8a' };
  }
  if (q.includes('universitario') || q.includes('crema')) {
    return { fondo: '#fef3c7', detalle: '#7f1d1d', texto: '#7f1d1d', numero: '#7f1d1d', borde: '#fde68a' };
  }
  if (q.includes('inter miami')) {
    return { fondo: '#f472b6', detalle: '#111827', texto: '#111827', numero: '#111827', borde: '#ec4899' };
  }
  if (q.includes('colombia') || q.includes('brasil')) {
    return { fondo: '#facc15', detalle: '#1e3a8a', texto: '#1e3a8a', numero: '#1e3a8a', borde: '#eab308' };
  }

  // Color deportivo por defecto (Negro/Verde Andrew)
  return { fondo: '#111827', detalle: '#22c55e', texto: '#ffffff', numero: '#22c55e', borde: '#374151' };
}

export default function PedirAMedidaStepsInfo({ formData = {} }) {
  const equipo = formData.equipoSeleccion?.trim() || 'TU EQUIPO';
  const temporada = formData.temporadaAno?.trim() || '2025/26';
  const nombreEspalda = formData.nombreDorsal?.trim() || 'TU NOMBRE';
  const numeroEspalda = formData.numeroDorsal?.trim() || '10';
  const esMangaLarga = formData.manga === 'larga';

  const paleta = obtenerColoresEquipo(formData.equipoSeleccion);

  const versionTexto = {
    jugador: 'Versión Jugador',
    fan: 'Versión Fan'
  }[formData.version] || 'Versión Jugador';

  const parcheTexto = {
    champions: 'Champions',
    liga: 'Liga Local',
    mundial: 'Mundial / Copa',
    ninguno: 'Sin parche'
  }[formData.parche] || 'Sin parche';

  return (
    <div className="lg:col-span-5 xl:col-span-5 space-y-5">

      {/* 1. SIMULADOR VISUAL DE LA CAMISETA */}
      <div className="bg-surface-card border border-stroke rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-stroke pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-andrew-primary" />
            <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-txt-main">
              ASÍ QUEDARÍA TU CAMISETA
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-andrew-primary/15 text-andrew-primary px-2.5 py-0.5 rounded-md">
            Vista de Espalda
          </span>
        </div>

        {/* Escenario de la camiseta centrado y amplio */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-stroke p-5 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Iluminación suave de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-andrew-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-52 h-56 sm:w-56 sm:h-60 flex items-center justify-center z-10">
            <svg viewBox="0 0 240 250" className="w-full h-full drop-shadow-[0_14px_28px_rgba(0,0,0,0.65)]">
              <defs>
                <clipPath id="jerseyClip">
                  {esMangaLarga ? (
                    <path d="M72,22 L96,22 C102,32 138,32 144,22 L168,22 L226,66 L212,162 L186,156 L176,84 L176,222 C176,228 171,232 165,232 L75,232 C69,232 64,228 64,222 L64,84 L54,156 L28,162 L14,66 Z" />
                  ) : (
                    <path d="M72,22 L96,22 C102,32 138,32 144,22 L168,22 L218,62 L195,98 L174,82 L174,222 C174,228 169,232 163,232 L77,232 C71,232 66,228 66,222 L66,82 L45,98 L22,62 Z" />
                  )}
                </clipPath>
              </defs>

              {/* Cuerpo con recorte para franjas de clubes */}
              <g clipPath="url(#jerseyClip)">
                <rect x="0" y="0" width="240" height="250" fill={paleta.fondo} />

                {/* Franjas verticales (Barcelona / Milan / Alianza) */}
                {paleta.franja && (
                  <>
                    <rect x="78" y="0" width="24" height="250" fill={paleta.franja} opacity="0.9" />
                    <rect x="138" y="0" width="24" height="250" fill={paleta.franja} opacity="0.9" />
                    <rect x="64" y="42" width="112" height="140" rx="10" fill={paleta.fondo} opacity="0.92" />
                  </>
                )}

                {/* Franja horizontal (Boca Juniors) */}
                {paleta.franjaHorizontal && (
                  <rect x="55" y="95" width="130" height="58" fill={paleta.franjaHorizontal} opacity="0.25" />
                )}

                {/* Banda diagonal sutil (Selección Peruana) */}
                {paleta.bandaRoja && (
                  <polygon points="65,20 95,20 175,205 175,235 145,235 65,50" fill="#dc2626" opacity="0.18" />
                )}
              </g>

              {/* Contorno de la camiseta */}
              {esMangaLarga ? (
                <path
                  d="M72,22 L96,22 C102,32 138,32 144,22 L168,22 L226,66 L212,162 L186,156 L176,84 L176,222 C176,228 171,232 165,232 L75,232 C69,232 64,228 64,222 L64,84 L54,156 L28,162 L14,66 Z"
                  fill="none"
                  stroke={paleta.borde}
                  strokeWidth="3"
                />
              ) : (
                <path
                  d="M72,22 L96,22 C102,32 138,32 144,22 L168,22 L218,62 L195,98 L174,82 L174,222 C174,228 169,232 163,232 L77,232 C71,232 66,228 66,222 L66,82 L45,98 L22,62 Z"
                  fill="none"
                  stroke={paleta.borde}
                  strokeWidth="3"
                />
              )}

              {/* Cuello deportivo */}
              <path
                d="M94,22 C102,35 138,35 146,22"
                fill="none"
                stroke={paleta.detalle}
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Puños de las mangas */}
              {!esMangaLarga && (
                <>
                  <line x1="25" y1="66" x2="47" y2="95" stroke={paleta.detalle} strokeWidth="4" />
                  <line x1="215" y1="66" x2="193" y2="95" stroke={paleta.detalle} strokeWidth="4" />
                </>
              )}

              {/* Parche en la manga derecha */}
              {formData.parche !== 'ninguno' && (
                <g>
                  <circle cx="192" cy="64" r="9" fill={paleta.detalle} />
                  <circle cx="192" cy="64" r="5" fill={paleta.fondo} />
                </g>
              )}

              {/* Nombre del jugador/cliente en la espalda */}
              <text
                x="120"
                y="74"
                textAnchor="middle"
                fill={paleta.texto}
                fontFamily="Montserrat, sans-serif"
                fontWeight="900"
                fontSize={nombreEspalda.length > 10 ? '13' : '15'}
                letterSpacing="2"
              >
                {nombreEspalda.slice(0, 14)}
              </text>

              {/* Número grande de espalda con doble trazo deportivo */}
              <text
                x="120"
                y="164"
                textAnchor="middle"
                fill={paleta.numero}
                fontFamily="Montserrat, sans-serif"
                fontWeight="900"
                fontSize="82"
              >
                {numeroEspalda}
              </text>

              {/* Sello inferior de autenticidad */}
              <rect x="82" y="206" width="76" height="14" rx="4" fill="#0f172a" opacity="0.85" />
              <text
                x="120"
                y="215.5"
                textAnchor="middle"
                fill="#22c55e"
                fontFamily="Montserrat, sans-serif"
                fontWeight="800"
                fontSize="7"
                letterSpacing="1"
              >
                CALIDAD A1 PRO
              </text>
            </svg>
          </div>

          {/* Pastillas de resumen debajo de la camiseta */}
          <div className="w-full pt-3 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] z-10">
            <span className="font-['Montserrat',sans-serif] font-black uppercase text-white truncate max-w-[180px]">
              {equipo} · {temporada}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="bg-white/10 text-white font-bold px-2 py-0.5 rounded">
                Talla {formData.tallas}
              </span>
              <span className="bg-andrew-primary text-black font-black px-2 py-0.5 rounded">
                {versionTexto}
              </span>
              {formData.parche !== 'ninguno' && (
                <span className="bg-white/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  {parcheTexto}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resumen de reserva */}
        <div className="bg-andrew-primary/10 border border-andrew-primary/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main block">
              SEPARA TU PEDIDO HOY CON:
            </span>
            <span className="text-[11px] text-txt-muted font-medium block">
              Asegura tu pedido antes del cierre. El saldo restante lo pagas cuando llegue a Perú.
            </span>
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide mt-0.5 block">
              Cupos limitados · Cerramos pedidos cada domingo
            </span>
          </div>
          <span className="font-['Montserrat',sans-serif] font-black text-xl text-andrew-primary shrink-0">
            S/ 40.00
          </span>
        </div>
      </div>

      {/* 2. PASOS SIMPLES DE ENCARGO */}
      <div className="bg-surface-card border border-stroke rounded-3xl p-5 sm:p-6 shadow-lg space-y-3.5 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main tracking-wider">
            ¿CÓMO REALIZAS TU PEDIDO?
          </h3>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>19 a 27 días calendario</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              num: '1',
              title: 'Reserva tu camiseta',
              desc: 'Separas con solo S/ 40 y aseguras tu pedido antes del cierre de cada domingo.'
            },
            {
              num: '2',
              title: 'Confirmación real',
              desc: 'Antes de importar, te enviamos fotos y videos reales de tu camiseta.'
            },
            {
              num: '3',
              title: 'Importación garantizada',
              desc: 'Calidad premium importada, personalización y parches de competición disponibles.'
            },
            {
              num: '4',
              title: 'Pago final y envío',
              desc: 'Al llegar a Perú te mostramos evidencia nuevamente y completas el saldo.'
            }
          ].map((st) => (
            <div key={st.num} className="bg-surface-sub/70 border border-stroke rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-andrew-primary text-black font-['Montserrat',sans-serif] font-black text-[11px] flex items-center justify-center shrink-0">
                  {st.num}
                </span>
                <h4 className="font-['Montserrat',sans-serif] font-black text-[11px] uppercase text-txt-main">
                  {st.title}
                </h4>
              </div>
              <p className="text-[11px] text-txt-muted font-medium leading-snug">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-txt-muted font-medium pt-1 border-t border-stroke">
          Envíos a Lima y provincias por agencia o motorizado. El costo de envío es adicional y varía según destino o agencia.
        </p>
      </div>

    </div>
  );
}
