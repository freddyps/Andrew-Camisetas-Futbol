import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Truck, Shield, RefreshCcw } from 'lucide-react';

export default function ProductDetail({ item, onBack, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(item.gallery[0]);
  const [selectedVersion, setSelectedVersion] = useState('fan');
  const [selectedSize, setSelectedSize] = useState('M');
  const [customName, setCustomName] = useState(false);
  const [personalizationName, setPersonalizationName] = useState('');
  const [personalizationNumber, setPersonalizationNumber] = useState('');
  const [addShort, setAddShort] = useState(false);
  const [activeTab, setActiveTab] = useState('descripcion');

  const versionPrice = selectedVersion === 'fan' ? item.precio : item.precio + 15;
  const customizationPrice = customName ? 12.99 : 0;
  const shortPrice = addShort ? 39.99 : 0;
  const totalPrice = (versionPrice + customizationPrice + shortPrice).toFixed(2);

  const tabClasses = (tab) =>
    `rounded-none border-b-2 px-4 py-5 text-sm font-black uppercase tracking-[0.05em] transition ${
      activeTab === tab
        ? 'border-black bg-black text-white'
        : 'border-transparent bg-white text-gray-500 hover:text-black'
    }`;

  return (
    <main className="bg-white text-black py-10 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.05em] text-[#22c55e] hover:text-[#1fa75d]">
          <ArrowLeft size={18} /> Volver a productos
        </button>

        <div className="grid gap-6 md:gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-none border border-gray-200 bg-gray-100">
              <img src={selectedImage} alt={`Camiseta ${item.equipo} ${item.categoria} 2024/25 vista principal - Andrew Camisetas`} className="w-full object-cover h-[340px] md:h-[460px]" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {item.gallery.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  className={`overflow-hidden rounded-none border p-1 transition ${selectedImage === src ? 'border-[#22c55e] bg-[#d6f9dc]' : 'border-gray-200 bg-white hover:border-[#22c55e]'}`}
                >
                  <img src={src} alt={`Camiseta ${item.equipo} - Vista ${index + 1} - ${item.categoria}`} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-none bg-[#22c55e]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#22c55e]">{item.liga}</span>
              <span className="rounded-none bg-black text-white px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em]">{item.categoria}</span>
              <span className="rounded-none bg-[#fde68a] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#92400e]">Best Seller</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black">{item.equipo}</h1>
              <p className="text-sm md:text-base uppercase tracking-[0.05em] text-gray-500">Camiseta {item.categoria} 2024/25</p>
            </div>

            <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.05em] text-gray-500">Precio incluye IVA</p>
                  <p className="mt-2 text-3xl md:text-4xl font-black text-black">S/ {versionPrice.toFixed(2)}</p>
                </div>
                <div className="text-right text-sm uppercase tracking-[0.05em] text-[#22c55e] font-black">Disponible</div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedVersion('fan')}
                  className={`rounded-none border p-4 text-left transition ${selectedVersion === 'fan' ? 'border-[#22c55e] bg-[#d6f9dc]' : 'border-gray-200 bg-white hover:border-[#22c55e]'}`}
                >
                  <p className="text-sm uppercase tracking-[0.05em] text-gray-500">Versión fan</p>
                  <p className="mt-2 text-base md:text-lg font-black text-black">Calidad estándar</p>
                  <p className="mt-1 text-lg md:text-xl font-black">S/ {item.precio.toFixed(2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVersion('player')}
                  className={`rounded-none border p-4 text-left transition ${selectedVersion === 'player' ? 'border-[#22c55e] bg-[#d6f9dc]' : 'border-gray-200 bg-white hover:border-[#22c55e]'}`}
                >
                  <p className="text-sm uppercase tracking-[0.05em] text-gray-500">Versión jugador</p>
                  <p className="mt-2 text-base md:text-lg font-black text-black">Calidad premium</p>
                  <p className="mt-1 text-lg md:text-xl font-black">S/ {(item.precio + 15).toFixed(2)}</p>
                </button>
              </div>

              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.05em] text-gray-500">Talla *</p>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-none border px-4 py-3 text-sm font-black uppercase transition ${selectedSize === size ? 'border-[#22c55e] bg-[#d6f9dc]' : 'border-gray-200 bg-white hover:border-[#22c55e]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">Guía de tallas: S (34-36), M (38-40), L (42-44), XL (46-48)</p>
              </div>

              <div className="mt-4 rounded-none border border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-black uppercase tracking-[0.05em] text-black">Estampado de nombre/número</p>
                  <p className="text-sm text-gray-500">Personaliza tu camiseta (+S/ 12.99)</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={customName}
                    onChange={() => setCustomName(!customName)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-12 rounded-none border border-gray-300 bg-gray-200 transition peer-checked:bg-[#22c55e]"></div>
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-none bg-white shadow transition peer-checked:translate-x-6"></span>
                </label>
              </div>

              {customName && (
                <div className="mt-4 rounded-none border border-gray-200 bg-white p-5 space-y-3">
                  <h3 className="font-black uppercase tracking-[0.05em] text-black text-base">Personaliza tu camiseta</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                  <div>
                      <label className="text-sm font-black uppercase tracking-[0.05em] text-black block mb-2">Nombre</label>
                      <input
                        type="text"
                        value={personalizationName}
                        onChange={(e) => setPersonalizationName(e.target.value.toUpperCase())}
                        placeholder="MESSI"
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
                        maxLength="20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-black uppercase tracking-[0.05em] text-black block mb-2">Número</label>
                      <input
                        type="number"
                        value={personalizationNumber}
                        onChange={(e) => setPersonalizationNumber(e.target.value)}
                        placeholder="10"
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
                        min="0"
                        max="99"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-none border border-gray-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 overflow-hidden rounded-none border border-gray-200">
                    <img src={item.image} alt="Short del equipo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-black uppercase tracking-[0.05em] text-black">Agregar short del equipo</p>
                    <p className="text-sm text-gray-500">Completa tu uniforme oficial</p>
                    <p className="text-base md:text-lg font-black text-[#22c55e] mt-1">+S/ 39.99</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAddShort(!addShort)}
                  className={`inline-flex items-center justify-center gap-2 rounded-none px-4 py-3 text-sm font-black uppercase tracking-[0.05em] transition whitespace-nowrap ${addShort ? 'border-[#22c55e] bg-[#d6f9dc] text-[#22c55e]' : 'border border-gray-200 bg-white text-black hover:border-[#22c55e] hover:text-[#22c55e]'}`}
                >
                  <Plus size={14} /> {addShort ? 'Agregado' : 'Agregar'}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAddToCart(item, {
                    size: selectedSize,
                    version: selectedVersion,
                    customName,
                    personalizationName,
                    personalizationNumber,
                    addShort,
                    price: Number(totalPrice),
                  })
                }
                className="w-full rounded-none bg-black px-6 md:px-8 py-4 md:py-5 text-sm font-black uppercase tracking-[0.05em] text-white transition hover:bg-[#111]"
              >
                <span className="inline-flex items-center gap-2 md:gap-3 justify-center">
                  <ShoppingCart size={16} /> AGREGAR AL CARRITO - S/ {totalPrice}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid gap-4 md:gap-6 md:grid-cols-3">
          <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-6 md:p-8 text-center">
            <Truck className="mx-auto text-[#22c55e]" size={28} />
            <p className="mt-3 font-black uppercase tracking-[0.05em] text-black text-sm">Envío gratis</p>
            <p className="mt-1 text-xs text-gray-500">En compras +S/ 100</p>
          </div>
          <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-6 md:p-8 text-center">
            <Shield className="mx-auto text-[#22c55e]" size={28} />
            <p className="mt-3 font-black uppercase tracking-[0.05em] text-black text-sm">100% auténtico</p>
            <p className="mt-1 text-xs text-gray-500">Garantía oficial</p>
          </div>
          <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-6 md:p-8 text-center">
            <RefreshCcw className="mx-auto text-[#22c55e]" size={28} />
            <p className="mt-3 font-black uppercase tracking-[0.05em] text-black text-sm">Devolución</p>
            <p className="mt-1 text-xs text-gray-500">30 días garantía</p>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-none border border-gray-200 bg-white">
          <div className="grid grid-cols-3 text-center text-sm font-black uppercase tracking-[0.2em]">
            <button type="button" onClick={() => setActiveTab('descripcion')} className={tabClasses('descripcion')}>
              Descripción técnica
            </button>
            <button type="button" onClick={() => setActiveTab('materiales')} className={tabClasses('materiales')}>
              Materiales
            </button>
            <button type="button" onClick={() => setActiveTab('cuidados')} className={tabClasses('cuidados')}>
              Cuidados
            </button>
          </div>

          <div className="p-10">
            {activeTab === 'descripcion' && (
              <>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">Especificaciones técnicas</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
                  {item.description} Diseñada para fanáticos que buscan rendimiento, estilo y autenticidad en cada partido.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-4">
                  <div className="rounded-none bg-[#f8fafc] p-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Corte</p>
                    <p className="mt-3 text-lg font-black text-black">{item.details.corte}</p>
                  </div>
                  <div className="rounded-none bg-[#f8fafc] p-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Peso</p>
                    <p className="mt-3 text-lg font-black text-black">{item.details.peso}</p>
                  </div>
                  <div className="rounded-none bg-[#f8fafc] p-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Tecnología</p>
                    <p className="mt-3 text-lg font-black text-black">{item.details.tecnologia}</p>
                  </div>
                  <div className="rounded-none bg-[#f8fafc] p-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Origen</p>
                    <p className="mt-3 text-lg font-black text-black">{item.details.origen}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'materiales' && (
              <>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">Composición de materiales</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
                  Fabricada con materiales de primera calidad seleccionados para ofrecer el máximo confort, durabilidad y rendimiento deportivo. Todos nuestros materiales cumplen con los estándares internacionales de calidad.
                </p>

                <div className="mt-10 space-y-4">
                  <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-6 flex items-start gap-5">
                    <div className="mt-1 h-11 w-11 flex-none rounded-none bg-[#bbf7d0] text-[#047857] grid place-items-center font-black">100%</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Poliéster reciclado</p>
                      <p className="mt-2 text-sm text-gray-500">Material principal transpirable y de secado rápido.</p>
                    </div>
                  </div>
                  <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-6 flex items-start gap-5">
                    <div className="mt-1 h-11 w-11 flex-none rounded-none bg-[#bbf7d0] text-[#047857] grid place-items-center font-black">✓</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Tecnología anti-olor</p>
                      <p className="mt-2 text-sm text-gray-500">Tratamiento antibacterial que previene malos olores.</p>
                    </div>
                  </div>
                  <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-6 flex items-start gap-5">
                    <div className="mt-1 h-11 w-11 flex-none rounded-none bg-[#bbf7d0] text-[#047857] grid place-items-center font-black">✓</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Mesh transpirable</p>
                      <p className="mt-2 text-sm text-gray-500">Paneles de ventilación estratégica en zonas clave.</p>
                    </div>
                  </div>
                  <div className="rounded-none border border-[#d1fae5] bg-[#ecfdf5] p-6 flex items-start gap-5">
                    <div className="mt-1 h-11 w-11 flex-none rounded-none bg-[#bbf7d0] text-[#047857] grid place-items-center font-black">✓</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Compromiso ecológico</p>
                      <p className="mt-2 text-sm text-gray-500">Esta camiseta está fabricada con materiales 100% reciclados.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'cuidados' && (
              <>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">Instrucciones de cuidado</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
                  Para mantener tu camiseta en perfectas condiciones y prolongar su vida útil, sigue estas recomendaciones de lavado y cuidado.
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="rounded-none border border-[#22c55e]/20 bg-[#ecfdf5] p-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#22c55e] text-white">
                      ✓
                    </div>
                    <p className="mt-5 text-lg font-black uppercase tracking-[0.18em] text-black">Recomendaciones</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
                      <li>• Lavar a máquina a 30°C máximo</li>
                      <li>• Voltear la camiseta antes de lavar</li>
                      <li>• Usar detergente suave sin lejía</li>
                      <li>• Secar al aire libre, evitar secadora</li>
                      <li>• Planchar a baja temperatura si es necesario</li>
                    </ul>
                  </div>
                  <div className="rounded-none border border-red-200 bg-[#fef2f2] p-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#ef4444] text-white">
                      −
                    </div>
                    <p className="mt-5 text-lg font-black uppercase tracking-[0.18em] text-black">Evitar</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
                      <li>• No usar lejía o blanqueadores</li>
                      <li>• No lavar con prendas oscuras</li>
                      <li>• No planchar sobre estampados</li>
                      <li>• No usar suavizante en exceso</li>
                      <li>• No retorcer al escurrir</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 rounded-none bg-black p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#a3f7d3]">Consejo pro</p>
                  <p className="mt-4 text-sm leading-7 text-white/80">
                    Para mantener los colores vibrantes y los estampados en perfecto estado, lava la camiseta del revés con agua fría y déjala secar en un lugar ventilado lejos de la luz solar directa.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
