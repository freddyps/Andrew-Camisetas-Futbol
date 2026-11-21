import React from 'react';
import { Package, CheckCircle2, Sparkles, Layers } from 'lucide-react';

/**
 * DashboardStatsCards:
 * Métricas ejecutivas del inventario con lectura clara, íconos enmarcados y jerarquía visual limpia.
 */
export default function DashboardStatsCards({
  totalProductos = 0,
  enStockCount = 0,
  bajoPedidoCount = 0,
  totalUnidades = 0
}) {
  const cards = [
    {
      label: 'MODELOS EN CATÁLOGO',
      value: totalProductos,
      helper: 'Camisetas publicadas en tienda',
      icon: Package,
      accent: 'text-txt-main',
      iconBg: 'bg-andrew-primary/15 text-andrew-primary border-andrew-primary/30',
      border: 'border-stroke'
    },
    {
      label: 'EN STOCK INMEDIATO',
      value: enStockCount,
      helper: `${totalUnidades} ${totalUnidades === 1 ? 'unidad física lista' : 'unidades físicas listas'}`,
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      border: 'border-emerald-500/30'
    },
    {
      label: 'MODELOS AGOTADOS',
      value: bajoPedidoCount,
      helper: 'Sin stock físico en almacén',
      icon: Sparkles,
      accent: 'text-red-500',
      iconBg: 'bg-red-500/15 text-red-500 border-red-500/30',
      border: 'border-red-500/30'
    },
    {
      label: 'TOTAL UNIDADES FÍSICAS',
      value: totalUnidades,
      helper: 'Suma total de tallas S, M, L y XL',
      icon: Layers,
      accent: 'text-andrew-primary',
      iconBg: 'bg-andrew-primary/15 text-andrew-primary border-andrew-primary/30',
      border: 'border-stroke'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`bg-surface-card border ${c.border} rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm transition-colors`}
          >
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-txt-muted block truncate">
                {c.label}
              </span>
              <div className={`font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black leading-none ${c.accent}`}>
                {c.value}
              </div>
              <p className="text-[11px] text-txt-muted font-medium truncate">
                {c.helper}
              </p>
            </div>

            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <Icon size={20} strokeWidth={2.2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
