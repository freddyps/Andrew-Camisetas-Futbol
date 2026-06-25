import React, { useState } from 'react';
import { User, LogOut, Package, ArrowLeft, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function UserProfile({ user, onBack, onLogout, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser(profileForm);
    }
    setIsEditing(false);
  };

  // MOCK DE HISTORIAL DE COMPRAS ELEGANTE (PRO LOOK)
  const mockOrders = [
    {
      id: 'AC-39485',
      date: '28 de Mayo, 2026',
      total: 139.90,
      status: 'En tránsito',
      percent: 65,
      items: '1x Camiseta Real Madrid (Local) · Talla M'
    },
    {
      id: 'AC-32890',
      date: '14 de Abril, 2026',
      total: 99.00,
      status: 'Entregado',
      percent: 100,
      items: '1x Camiseta Selección Peruana (Local) · Talla L'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors animate-fade-in-up"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        {/* CONTAINER GRILLA (2 COLUMNAS) */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.8fr] items-start animate-fade-in-up">
          
          {/* COLUMNA 1: MI PERFIL (GLASS PANEL) */}
          <div className="glass-panel border border-white/10 p-6 space-y-6">
            <div className="text-center pb-6 border-b border-white/5">
              <div className="h-20 w-20 bg-[#22c55e] text-black font-display font-black text-3xl mx-auto flex items-center justify-center glow-green-sm mb-4">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-display font-black text-xl text-white uppercase truncate">{user.name}</h3>
              <p className="text-[#22c55e] text-[9px] font-bold tracking-[0.2em] uppercase mt-1 glow-text-green">SOCIO OFICIAL</p>
            </div>

            {/* Formulario / Info */}
            {!isEditing ? (
              <div className="space-y-4 text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#22c55e]" />
                  <div className="truncate">
                    <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">CORREO ELECTRÓNICO</p>
                    <p className="text-white mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#22c55e]" />
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">TELÉFONO / WHATSAPP</p>
                    <p className="text-white mt-0.5">{user.phone || 'No registrado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#22c55e]" />
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">DIRECCIÓN DE ENTREGA</p>
                    <p className="text-white mt-0.5 truncate max-w-[200px]">{user.address || 'No registrada'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="border border-white/10 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 py-3 text-[10px] font-display font-black uppercase tracking-wider text-white transition-colors cursor-pointer text-center"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-white py-3 text-[10px] font-display font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <LogOut size={12} /> Salir
                  </button>
                </div>
              </div>
            ) : (
              // Modo edición
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-white/10 bg-white/5 py-2.5 text-[9px] font-display font-black uppercase tracking-wider text-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#22c55e] hover:bg-[#1fa75d] text-black py-2.5 text-[9px] font-display font-black uppercase tracking-wider transition-colors glow-green-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* COLUMNA 2: DETALLES COMPRAS / PEDIDOS (REAL SYSTEM LOOK) */}
          <div className="space-y-6">
            
            {/* Cabecera compras */}
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-300">
              <Package className="text-[#22c55e]" size={16} />
              <span>Historial de Pedidos</span>
            </div>

            {/* Listado de Pedidos */}
            <div className="space-y-5">
              {mockOrders.map((order) => (
                <div 
                  key={order.id}
                  className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#22c55e]/25 transition-all duration-300 relative group"
                >
                  {/* Encabezado del Pedido */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">{order.date}</span>
                      <h4 className="font-display font-black text-sm uppercase tracking-wide text-white mt-0.5">
                        Pedido: <span className="text-[#22c55e] glow-text-green">{order.id}</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">MONTO TOTAL</span>
                      <span className="font-display font-black text-base text-white">S/ {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Items del Pedido */}
                  <p className="text-xs text-gray-400 font-semibold mb-6">{order.items}</p>

                  {/* ===== BARRA DE PROGRESO DE ENTREGA (DELIVERY STEP TRACKER) ===== */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest">
                      <span className="text-[#22c55e]">Procesado</span>
                      <span className={order.percent >= 50 ? "text-[#22c55e]" : "text-gray-500"}>En Ruta</span>
                      <span className={order.percent === 100 ? "text-[#22c55e]" : "text-gray-500"}>Entregado</span>
                    </div>
                    
                    {/* Barra de progreso de fondo */}
                    <div className="w-full h-1.5 bg-white/5 relative">
                      {/* Barra de progreso activa */}
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#22c55e] glow-green-sm transition-all duration-500"
                        style={{ width: `${order.percent}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] px-2 py-0.5 glow-text-green">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje de Seguridad */}
            <div className="border border-white/5 bg-[#22c55e]/5 p-5 flex items-start gap-4">
              <ShieldCheck size={20} className="text-[#22c55e] shrink-0" />
              <div>
                <h4 className="text-xs font-display font-black uppercase text-white">Datos Encriptados & Seguros</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
                  Tu perfil oficial del Club Andrew Camisetas está respaldado con la tecnología de encriptación de datos de Supabase. Tus datos nunca serán compartidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
