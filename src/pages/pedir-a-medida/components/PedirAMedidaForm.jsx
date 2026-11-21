import React from 'react';
import { Send, Shirt, Sparkles } from 'lucide-react';

const CLUBES_RAPIDOS = [
  'Real Madrid',
  'FC Barcelona',
  'Selección Peruana',
  'AC Milan',
  'Manchester City',
  'PSG',
  'Boca Juniors',
  'Alianza Lima',
  'Universitario'
];

const TALLAS_DISPONIBLES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PedirAMedidaForm({ formData, setFormData, handleSubmit, enviado }) {
  return (
    <div className="lg:col-span-7 xl:col-span-7 bg-surface-card border border-stroke rounded-3xl p-5 sm:p-7 shadow-lg space-y-5 transition-colors">

      {/* CABECERA SIMPLE Y CLARA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stroke">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-andrew-primary/15 border border-andrew-primary/35 flex items-center justify-center text-andrew-primary shrink-0">
            <Shirt size={20} strokeWidth={2.3} />
          </div>
          <div>
            <h1 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase text-txt-main tracking-tight">
              ENCARGA TU CAMISETA A MEDIDA
            </h1>
            <p className="text-txt-muted text-xs font-medium">
              Completa estos 3 pasos rápidos y te cotizamos al instante por WhatsApp.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-['Montserrat',sans-serif] font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-xs">
          <span>Reserva con S/ 40</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PASO 1: EQUIPO Y TEMPORADA */}
        <div className="bg-surface-sub/60 border border-stroke rounded-2xl p-4 space-y-3.5">
          <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main tracking-wider block">
            1. ¿QUÉ CAMISETA BUSCAS?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Equipo o Selección *
              </label>
              <input
                type="text"
                required
                value={formData.equipoSeleccion}
                onChange={(e) => setFormData({ ...formData, equipoSeleccion: e.target.value })}
                placeholder="Ej: Real Madrid, Selección Peruana..."
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none transition-colors font-semibold"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Temporada o Modelo
              </label>
              <input
                type="text"
                value={formData.temporadaAno}
                onChange={(e) => setFormData({ ...formData, temporadaAno: e.target.value })}
                placeholder="Ej: 2025/26 Local, Retro 1998..."
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none transition-colors font-semibold"
              />
            </div>
          </div>

          {/* Sugerencias rápidas en 1 clic */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-bold uppercase text-txt-muted mr-1">
              Rápido:
            </span>
            {CLUBES_RAPIDOS.map((club) => {
              const activo = formData.equipoSeleccion.toLowerCase() === club.toLowerCase();
              return (
                <button
                  key={club}
                  type="button"
                  onClick={() => setFormData({ ...formData, equipoSeleccion: club })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    activo
                      ? 'bg-andrew-primary text-black border-andrew-primary shadow-xs'
                      : 'bg-surface-card text-txt-muted border-stroke hover:border-andrew-primary hover:text-txt-main'
                  }`}
                >
                  {club}
                </button>
              );
            })}
          </div>
        </div>

        {/* PASO 2: TALLA, VERSIÓN Y MANGA */}
        <div className="bg-surface-sub/60 border border-stroke rounded-2xl p-4 space-y-3.5">
          <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main tracking-wider block">
            2. ELIGE TU TALLA Y VERSIÓN
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            {/* Talla */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-txt-muted">
                Talla:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TALLAS_DISPONIBLES.map((talla) => {
                  const activa = formData.tallas === talla;
                  return (
                    <button
                      key={talla}
                      type="button"
                      onClick={() => setFormData({ ...formData, tallas: talla })}
                      className={`min-w-11 h-10 px-3 rounded-xl font-['Montserrat',sans-serif] text-xs font-black uppercase border transition-all cursor-pointer ${
                        activa
                          ? 'bg-andrew-primary text-black border-andrew-primary shadow-sm'
                          : 'bg-surface-card text-txt-main border-stroke hover:border-andrew-primary'
                      }`}
                    >
                      {talla}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Versión */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-txt-muted">
                Versión de camiseta:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'jugador', label: 'Versión Jugador' },
                  { id: 'fan', label: 'Versión Fan' }
                ].map((v) => {
                  const activo = formData.version === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, version: v.id })}
                      className={`h-10 px-2 rounded-xl border font-['Montserrat',sans-serif] font-black text-xs uppercase transition-all cursor-pointer ${
                        activo
                          ? 'bg-andrew-primary text-black border-andrew-primary shadow-sm'
                          : 'bg-surface-card text-txt-main border-stroke hover:border-andrew-primary'
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manga */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-txt-muted">
                Manga:
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    manga: formData.manga === 'corta' ? 'larga' : 'corta'
                  })
                }
                className={`w-full h-10 px-2.5 rounded-xl border font-['Montserrat',sans-serif] font-black text-xs uppercase cursor-pointer transition-all ${
                  formData.manga === 'larga'
                    ? 'bg-andrew-primary text-black border-andrew-primary'
                    : 'bg-surface-card border-stroke text-txt-main hover:border-andrew-primary'
                }`}
              >
                {formData.manga === 'larga' ? 'Larga' : 'Corta'}
              </button>
            </div>
          </div>
        </div>

        {/* PASO 3: PERSONALIZACIÓN DE ESPALDA (SIEMPRE VISIBLE Y DIRECTO) */}
        <div className="bg-surface-sub/60 border border-stroke rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-andrew-primary" />
              <span>3. PERSONALIZA LA ESPALDA (OPCIONAL)</span>
            </span>
            <span className="bg-andrew-primary/15 text-andrew-primary text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
              Estampado Gratis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Nombre en la espalda
              </label>
              <input
                type="text"
                maxLength={14}
                value={formData.nombreDorsal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conDorsal: true,
                    nombreDorsal: e.target.value.toUpperCase()
                  })
                }
                placeholder="EJ: RONALDO / TU NOMBRE"
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 uppercase outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Número
              </label>
              <input
                type="text"
                maxLength={2}
                value={formData.numeroDorsal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conDorsal: true,
                    numeroDorsal: e.target.value.replace(/[^0-9]/g, '')
                  })
                }
                placeholder="10"
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 uppercase outline-none font-black text-center"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Parche en manga
              </label>
              <select
                value={formData.parche}
                onChange={(e) => setFormData({ ...formData, parche: e.target.value })}
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3 py-2.5 text-xs sm:text-sm text-txt-main font-bold outline-none cursor-pointer"
              >
                <option value="ninguno">Sin parches</option>
                <option value="champions">Parche Champions</option>
                <option value="liga">Parche Liga Local</option>
                <option value="mundial">Parche Mundial / Copa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Tu Nombre (Para atenderte)
              </label>
              <input
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                placeholder="Ej: Freddy Alexander"
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2 text-xs text-txt-main placeholder:text-txt-muted/60 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                Nota adicional (Opcional)
              </label>
              <input
                type="text"
                value={formData.detallesAdicionales}
                onChange={(e) => setFormData({ ...formData, detallesAdicionales: e.target.value })}
                placeholder="Ej: deseo incluir short, cuello polo..."
                className="w-full bg-surface-card border border-stroke focus:border-andrew-primary rounded-xl px-3.5 py-2 text-xs text-txt-main placeholder:text-txt-muted/60 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {enviado && (
          <div className="p-3 bg-andrew-primary/15 border border-andrew-primary/40 rounded-xl text-center text-xs text-andrew-primary font-black uppercase">
            ✓ Abriendo WhatsApp con tu pedido listo...
          </div>
        )}

        {/* BOTÓN PRINCIPAL ENVIAR A WHATSAPP */}
        <button
          type="submit"
          className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] shadow-md shadow-[#22c55e]/25"
        >
          <Send size={16} strokeWidth={2.5} />
          <span>COTIZAR Y RESERVAR POR WHATSAPP</span>
        </button>

      </form>
    </div>
  );
}
