import React from 'react';
import { Star, Check, Trash2, MessageSquare, RefreshCw, Clock } from 'lucide-react';

/**
 * ReviewsModerationTable:
 * Módulo de moderación administrativa de reseñas y testimonios.
 * Permite al administrador revisar comentarios enviados por clientes,
 * aprobarlos para visibilidad pública o eliminarlos de Supabase.
 */
export default function ReviewsModerationTable({
  reviews = [],
  onAprobar,
  onEliminar,
  onRecargar
}) {
  const pendientes = reviews.filter(r => !r.aprobado);
  const aprobadas = reviews.filter(r => r.aprobado);

  return (
    <div className="space-y-6">
      {/* Métricas de Moderación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-amber-500/30 hover:border-amber-500/50 transition-colors rounded-2xl p-5 space-y-1 bg-gradient-to-br from-surface-card to-amber-500/10">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-300">
            <span className="text-[11px] font-bold uppercase">POR MODERAR / APROBAR</span>
            <Clock size={18} />
          </div>
          <div className="font-['Montserrat',sans-serif] text-3xl font-black text-amber-600 dark:text-amber-300">
            {pendientes.length}
          </div>
          <p className="text-[10px] text-txt-muted">Comentarios esperando revisión</p>
        </div>

        <div className="bg-surface-card border border-emerald-500/30 hover:border-emerald-500/50 transition-colors rounded-2xl p-5 space-y-1 bg-gradient-to-br from-surface-card to-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[11px] font-bold uppercase">RESEÑAS APROBADAS</span>
            <Check size={18} />
          </div>
          <div className="font-['Montserrat',sans-serif] text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {aprobadas.length}
          </div>
          <p className="text-[10px] text-txt-muted">Visibles públicamente en la tienda</p>
        </div>

        <div className="bg-surface-card border border-stroke hover:border-stroke-hover transition-colors rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-txt-muted">
            <span className="text-[11px] font-bold uppercase">TOTAL OPINIONES</span>
            <MessageSquare size={18} className="text-andrew-primary" />
          </div>
          <div className="font-['Montserrat',sans-serif] text-3xl font-black text-txt-main">
            {reviews.length}
          </div>
          <p className="text-[10px] text-txt-muted">Histórico de reseñas recibidas</p>
        </div>
      </div>

      {/* Tabla de Moderación */}
      <div className="bg-surface-card border border-stroke rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <div className="p-4 border-b border-stroke flex items-center justify-between gap-4">
          <div>
            <h3 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main">
              BANDEJA DE MODERACIÓN DE RESEÑAS
            </h3>
            <p className="text-txt-muted text-xs">
              Aprueba las reseñas legítimas para que generen prueba social en la página de producto y catálogo.
            </p>
          </div>
          <button
            type="button"
            onClick={onRecargar}
            className="px-3 py-1.5 bg-surface-sub hover:bg-surface-sub/80 text-txt-main border border-stroke hover:border-stroke-hover rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw size={13} />
            <span>Actualizar</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <MessageSquare size={40} className="mx-auto text-txt-muted" />
            <h4 className="font-black text-sm uppercase text-txt-main">No hay reseñas para moderar</h4>
            <p className="text-xs text-txt-muted">Las nuevas opiniones que los clientes publiquen aparecerán en esta bandeja.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Montserrat',sans-serif]">
              <thead className="bg-surface-sub border-b border-stroke text-txt-muted uppercase text-[11px]">
                <tr>
                  <th className="py-4 px-4 font-bold">Cliente / Fecha</th>
                  <th className="py-4 px-4 font-bold">Producto ID</th>
                  <th className="py-4 px-4 font-bold">Calificación</th>
                  <th className="py-4 px-4 font-bold">Comentario del Aficionado</th>
                  <th className="py-4 px-4 font-bold">Estado</th>
                  <th className="py-4 px-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke text-txt-muted">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-surface-sub/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-txt-main block uppercase">{rev.nombre_cliente}</span>
                      <span className="text-[10px] text-txt-muted">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-txt-main text-[11px]">
                      {rev.producto_id || 'General'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            size={12}
                            fill={st <= Number(rev.calificacion) ? 'currentColor' : 'none'}
                            className={st <= Number(rev.calificacion) ? 'text-amber-400' : 'text-txt-muted/30'}
                          />
                        ))}
                        <span className="text-[11px] text-txt-muted font-bold ml-1">({rev.calificacion}/5)</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-txt-main text-xs leading-relaxed line-clamp-3">
                        "{rev.comentario}"
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      {rev.aprobado ? (
                        <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <Check size={11} strokeWidth={3} />
                          APROBADA
                        </span>
                      ) : (
                        <span className="bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <Clock size={11} />
                          PENDIENTE
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!rev.aprobado && (
                          <button
                            type="button"
                            onClick={() => onAprobar(rev.id)}
                            className="px-3 py-1.5 bg-andrew-primary hover:bg-[#1fa75d] text-black font-black text-[11px] uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                            title="Aprobar para publicar en la tienda"
                          >
                            <Check size={13} strokeWidth={3} />
                            <span>APROBAR</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEliminar(rev.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
