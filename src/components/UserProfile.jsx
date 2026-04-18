import { User, Mail, MapPin, LogOut, Settings } from 'lucide-react';

// ============================================================================
// COMPONENTE: UserProfile (Página de perfil de usuario)
// Descripción: Muestra datos del usuario y permite cerrar sesión
// Props:
//   - onBack: función para volver a la página anterior
//   - onLogout: función para cerrar sesión
//   - user: datos del usuario actual
// ============================================================================

export default function UserProfile({ onBack, onLogout, user }) {
  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black font-sans selection:bg-[#22c55e] selection:text-black px-6 py-8 md:px-10">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-[#22c55e] hover:text-[#1fa75d]"
          >
            ← Volver
          </button>
          <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-8 shadow-sm text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Acceso requerido</p>
            <h1 className="text-3xl font-black text-black mb-4">Debes iniciar sesión</h1>
            <p className="text-sm text-gray-600">Regresa e inicia sesión o crea una cuenta para ver tu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  const { name, email, phone, address, city, zipCode, orders = [] } = user;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#22c55e] selection:text-black px-6 py-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-[#22c55e] hover:text-[#1fa75d]"
        >
          ← Volver
        </button>

        <div className="space-y-8">
          <div className="flex flex-col gap-6 rounded-none border border-gray-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-none bg-[#22c55e] flex items-center justify-center">
                <User size={32} className="text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-[0.1em]">Bienvenido</p>
                <h1 className="text-2xl font-black uppercase tracking-[0.05em]">{name}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-none border border-red-200 bg-[#fef2f2] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-none border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-black uppercase tracking-[0.05em]">Información personal</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">Email</p>
                  <p className="mt-1 text-sm font-black">{email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">Teléfono</p>
                  <p className="mt-1 text-sm font-black">{phone || 'No registrado'}</p>
                </div>
              </div>
              <button className="mt-6 w-full rounded-none border border-gray-200 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-black transition hover:border-[#22c55e] hover:text-[#22c55e]">
                <Settings className="inline mr-2" size={16} /> Editar perfil
              </button>
            </div>

            <div className="rounded-none border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-black uppercase tracking-[0.05em]">Dirección de envío</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">Dirección</p>
                  <p className="mt-1 text-sm font-black">{address || 'No registrada'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">Ciudad</p>
                    <p className="mt-1 text-sm font-black">{city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">Código postal</p>
                    <p className="mt-1 text-sm font-black">{zipCode || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-none border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-black uppercase tracking-[0.05em]">Mis pedidos</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.05em]">{order.id}</p>
                      <p className="mt-1 text-xs text-gray-500 uppercase tracking-[0.1em]">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black uppercase tracking-[0.05em]">{order.total}</p>
                      <p className={`mt-1 text-xs font-black uppercase tracking-[0.1em] ${
                        order.status === 'Entregado' ? 'text-[#22c55e]' : 'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No tienes pedidos aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
