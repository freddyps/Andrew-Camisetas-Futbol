import React from 'react';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';

/**
 * NosotrosPage: Sección 'Sobre Nosotros' con ancho completo (max-w-[1720px])
 * que aprovecha los espacios laterales distribuyendo mejor los bloques sin agrandar las letras.
 */
export default function NosotrosPage({ onExploreCatalog = () => {} }) {
  const stats = [
    { label: 'CALIDAD GARANTIZADA', value: 'ACABADO A1', sub: 'Versión Jugador y Fan' },
    { label: 'COBERTURA NACIONAL', value: 'TODO EL PERÚ', sub: 'Lima y Provincias' },
    { label: 'PEDIDOS POR ENCARGO', value: 'RESERVA S/ 40', sub: 'Saldo al llegar a Perú' },
    { label: 'CLIENTES SATISFECHOS', value: '100% SEGURO', sub: 'Fotos reales de cada entrega' }
  ];

  const pilares = [
    {
      title: 'TELAS TÉCNICAS IMPORTADAS',
      desc: 'Prendas importadas con telas técnicas de alto rendimiento como las originales: mejor transpirabilidad y calce perfecto.',
      icon: ShieldCheck
    },
    {
      title: 'ESCUDOS Y ESTAMPADOS HD',
      desc: 'Escudos y estampados de alta definición que no se caen con las lavadas. Calidad y durabilidad superior frente a prendas nacionales.',
      icon: Award
    },
    {
      title: 'PERSONALIZACIÓN Y PARCHES',
      desc: 'Personalización con nombre, número y parches de competición. Antes de importar te enviamos fotos y videos reales.',
      icon: Sparkles
    },
    {
      title: 'ENVÍOS A LIMA Y PROVINCIAS',
      desc: 'Motorizado a domicilio en Lima (previa confirmación de pago y tarifa según zona) y envíos por agencia a todo el Perú.',
      icon: Truck
    }
  ];

  return (
    <div className="w-full bg-bg-base text-txt-main min-h-screen select-none transition-colors duration-200">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 space-y-10 sm:space-y-12">

        {/* 1. BLOQUE PRINCIPAL A 12 COLUMNAS (APROVECHANDO EL ANCHO SIN AGRANDAR TIPOGRAFÍA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">

          {/* Columna Izquierda (5 cols): Historia, Modalidades y CTA */}
          <div className="lg:col-span-5 bg-surface-card border border-stroke rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-andrew-primary/15 border border-andrew-primary/35 px-3 py-1 rounded-lg text-andrew-primary font-['Montserrat',sans-serif] text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>SOBRE ANDREW CAMISETAS</span>
              </div>

              <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl uppercase tracking-tight text-txt-main leading-tight">
                LA PASIÓN DE TU EQUIPO EN <span className="text-andrew-primary">CADA DETALLE</span>
              </h1>

              <p className="text-txt-muted text-xs sm:text-sm leading-relaxed font-medium">
                En <strong className="text-txt-main font-extrabold">Andrew Camisetas de Fútbol</strong> acercamos a los hinchas del Perú las camisetas actuales y de época de las mejores selecciones y clubes del mundo, trabajando con prendas de <strong className="text-txt-main font-extrabold">Calidad A1</strong> en <strong className="text-txt-main font-extrabold">Versión Jugador</strong> y <strong className="text-txt-main font-extrabold">Versión Fan</strong>.
              </p>

              {/* Dos mini tarjetas comparativas: En Stock vs Bajo Pedido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-sub/80 border border-stroke rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-['Montserrat',sans-serif] font-black text-xs uppercase">
                    <CheckCircle2 size={14} />
                    <span>En Stock Físico</span>
                  </div>
                  <p className="text-[11px] text-txt-muted font-medium leading-snug">
                    Prendas listas en almacén para entrega inmediata en 24-48h.
                  </p>
                </div>

                <div className="bg-surface-sub/80 border border-stroke rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-['Montserrat',sans-serif] font-black text-xs uppercase">
                    <Clock size={14} />
                    <span>Bajo Pedido (19-27 días)</span>
                  </div>
                  <p className="text-[11px] text-txt-muted font-medium leading-snug">
                    Reserva con S/ 40, fotos/videos reales antes de importar. Cierre cada domingo.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stroke flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shadow-md shadow-[#22c55e]/20"
              >
                <span>VER CATÁLOGO OFICIAL</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>

              <span className="text-[11px] font-bold text-txt-muted">
                Envíos a Lima y Provincias
              </span>
            </div>
          </div>

          {/* Columna Derecha (7 cols): Galería de Entregas + 4 Indicadores Integrados */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
              <div className="rounded-3xl overflow-hidden h-72 sm:h-80 shadow-md relative group border border-stroke">
                <img
                  src="/banners/showcase_real_madrid.webp"
                  alt="Entregas reales Selección Peruana"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    ENTREGAS REALES
                  </span>
                  <p className="keep-white text-white text-xs sm:text-sm font-bold mt-1.5">
                    Selecciones y clubes con envíos a todo el Perú
                  </p>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden h-72 sm:h-80 shadow-md relative group border border-stroke">
                <img
                  src="/banners/showcase_legend.webp"
                  alt="Clientes felices Andrew Camisetas"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-andrew-primary text-black text-[10px] font-black uppercase tracking-wider shadow-sm">
                    CLIENTES SATISFECHOS
                  </span>
                  <p className="keep-white text-white text-xs sm:text-sm font-bold mt-1.5">
                    Calidad A1 en Versión Jugador y Versión Fan
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Indicadores horizontales debajo de las fotos aprovechando las 7 columnas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-surface-card p-3.5 rounded-2xl border border-stroke text-center space-y-0.5 shadow-xs"
                >
                  <div className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base text-andrew-primary">
                    {s.value}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-txt-main">
                    {s.label}
                  </div>
                  <div className="text-[10px] font-medium text-txt-muted">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 2. PILARES DE CALIDAD EN UNA SOLA FILA DE 4 COLUMNAS A LO ANCHO */}
        <div className="bg-surface-card border border-stroke rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stroke pb-4">
            <div>
              <span className="text-andrew-primary text-[11px] font-black uppercase tracking-wider block">
                NUESTRA GARANTÍA
              </span>
              <h2 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase text-txt-main">
                ¿POR QUÉ COMPRAR EN ANDREW CAMISETAS?
              </h2>
            </div>
            <span className="text-xs font-bold text-txt-muted">
              Atención directa y personalizada por WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pilares.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-surface-sub/70 border border-stroke hover:border-andrew-primary/50 rounded-2xl p-4 space-y-2.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-andrew-primary/15 border border-andrew-primary/35 flex items-center justify-center text-andrew-primary shrink-0">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main leading-snug">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-txt-muted text-xs leading-relaxed font-medium">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
