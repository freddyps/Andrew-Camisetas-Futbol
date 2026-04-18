import { Check, MapPin, Package, Award, Zap } from 'lucide-react';

export default function About({ onBack }) {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#22c55e] selection:text-black px-6 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-[#22c55e] hover:text-[#1fa75d]"
        >
          ← Volver
        </button>

        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.05em]">Nosotros</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">Somos la tienda online líder en camisetas de fútbol de calidad en Perú.</p>
        </div>

        <div className="grid gap-16 mb-16">
          <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-12 shadow-sm">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.05em]">Nuestra historia</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fundada en 2020, Andrew Camisetas nace con la pasión por el fútbol y la moda. Comenzamos como una pequeña tienda local y hoy somos referentes en venta online de camisetas de las mejores ligas del mundo.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nuestro objetivo es ofrecer productos de la más alta calidad con diseños exclusivos y personalizados, con un servicio de atención al cliente inmejorable.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cada camiseta que vendemos es cuidadosamente seleccionada para garantizar autenticidad y durabilidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#22c55e] text-white mb-4">
                <Award size={24} />
              </div>
              <h3 className="mb-3 text-xl font-black uppercase tracking-[0.05em]">Calidad garantizada</h3>
              <p className="text-sm text-gray-700">Todas nuestras camisetas pasan controles de calidad rigurosos antes de ser enviadas.</p>
            </div>

            <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#22c55e] text-white mb-4">
                <Zap size={24} />
              </div>
              <h3 className="mb-3 text-xl font-black uppercase tracking-[0.05em]">Envíos rápidos</h3>
              <p className="text-sm text-gray-700">Procesamos y enviamos tu pedido en menos de 24 horas. Envío gratis a partir de €100.</p>
            </div>

            <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#22c55e] text-white mb-4">
                <Package size={24} />
              </div>
              <h3 className="mb-3 text-xl font-black uppercase tracking-[0.05em]">Embalaje premium</h3>
              <p className="text-sm text-gray-700">Tus camisetas llegan perfectas en embalajes protegidos y ecológicos.</p>
            </div>

            <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#22c55e] text-white mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="mb-3 text-xl font-black uppercase tracking-[0.05em]">Cobertura nacional</h3>
              <p className="text-sm text-gray-700">Enviamos a toda Lima y el interior del país con seguridad garantizada.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-black uppercase tracking-[0.05em]">¿Por qué elegirnos?</h2>
          <div className="space-y-4">
            {[
              'Camisetas originales de las mejores marcas deportivas',
              'Personalización profesional: nombres y números en tela',
              'Precios competitivos sin comprometer calidad',
              'Atención al cliente 24/7 a través de WhatsApp y email',
              'Garantía de satisfacción: cambios o devoluciones fáciles',
              'Programa de descuentos para clientes frecuentes',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 rounded-none border border-gray-200 bg-white p-4">
                <div className="mt-1 h-5 w-5 flex-none rounded-none bg-[#22c55e] flex items-center justify-center text-white">
                  <Check size={16} />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.05em]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <p className="text-4xl font-black text-[#22c55e]">5000+</p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.1em] text-gray-600">Clientes satisfechos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-[#22c55e]">1000+</p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.1em] text-gray-600">Diseños disponibles</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-[#22c55e]">24/7</p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.1em] text-gray-600">Soporte disponible</p>
          </div>
        </div>

        <div className="rounded-none border border-gray-200 bg-white p-12 shadow-sm">
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.05em]">Contacto</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-[0.15em]">Email</p>
              <p className="mt-2 text-lg font-black">info@andrewcamisetas.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-[0.15em]">WhatsApp</p>
              <p className="mt-2 text-lg font-black">+51 987 654 321</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-[0.15em]">Ubicación</p>
              <p className="mt-2 text-lg font-black">Lima, Perú</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
