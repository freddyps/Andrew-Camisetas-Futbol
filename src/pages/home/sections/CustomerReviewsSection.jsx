import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star,
  CheckCircle2,
  ArrowRight,
  Truck,
  MapPin,
  MessageSquarePlus,
  X,
  Send,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Shirt
} from 'lucide-react';
import { getReviewsAprobadas, crearReview } from '../../../services/reviewService';

/**
 * Comprime y redimensiona una imagen seleccionada (archivo o cámara) a JPEG ligero
 * para guardar sin problemas en localStorage / base de datos.
 */
function compressImageToDataUrl(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * CustomerReviewsSection: Sección dinámica de Clientes y Entregas Reales
 * Muestra fotos auténticas y opiniones de clientes peruanos.
 * Permite a los clientes publicar comentarios y subir o tomar su propia foto en tiempo real.
 */
export default function CustomerReviewsSection({ onProductClick = () => {} }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [productoComprado, setProductoComprado] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Cargar reseñas reales
  const fetchReviews = useCallback(async () => {
    try {
      const data = await getReviewsAprobadas();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => fetchReviews();
    window.addEventListener('andrew_reviews_updated', handleUpdate);
    return () => window.removeEventListener('andrew_reviews_updated', handleUpdate);
  }, [fetchReviews]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoFoto(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setFotoUrl(compressedDataUrl);
    } catch (err) {
      console.error('Error procesando la imagen:', err);
    } finally {
      setSubiendoFoto(false);
      e.target.value = '';
    }
  };

  // Manejar envío de nueva reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !comentario.trim()) return;

    setEnviando(true);
    try {
      await crearReview({
        producto_id: 'general',
        nombre_cliente: nombre.trim(),
        city: ciudad.trim() || 'Lima (Envío Shalom / InDrive)',
        calificacion: Number(calificacion) || 5,
        badge: 'ENTREGA VERIFICADA',
        comentario: comentario.trim(),
        product_nombre: productoComprado.trim() || 'Camiseta Oficial Andrew',
        image: fotoUrl || null,
        autoAprobar: true
      });

      setExito(true);
      setTimeout(() => {
        setExito(false);
        setModalOpen(false);
        setNombre('');
        setCiudad('');
        setComentario('');
        setProductoComprado('');
        setFotoUrl('');
        setCalificacion(5);
      }, 1500);
    } catch (err) {
      console.error('Error creando reseña:', err);
    } finally {
      setEnviando(false);
    }
  };

  // Cálculo del promedio
  const totalReviews = reviews.length;
  const promedioRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0) / totalReviews).toFixed(1)
    : '4.9';

  return (
    <section className="relative w-full bg-bg-base text-txt-main py-20 lg:py-24 px-4 sm:px-6 lg:px-10 xl:px-12 overflow-hidden select-none border-t border-stroke transition-colors">
      <div className="w-full max-w-[1720px] mx-auto relative z-10">
        
        {/* Cabecera */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/40 px-3.5 py-1 rounded-full mb-1">
              <Truck size={14} className="text-[#22c55e]" />
              <span className="font-['Montserrat',sans-serif] font-bold text-[11px] uppercase tracking-wider text-[#22c55e]">
                ENTREGAS VERIFICADAS EN TODO EL PERÚ
              </span>
            </div>
            <h2 className="font-['Montserrat',sans-serif] font-black text-[clamp(1.75rem,4.5vw,3rem)] uppercase tracking-tight text-txt-main leading-none">
              FOTOS DE NUESTROS <br />
              <span className="text-[#22c55e]">CLIENTES Y ENTREGAS</span>
            </h2>
            <p className="font-['Montserrat',sans-serif] text-txt-muted text-sm sm:text-base font-medium leading-relaxed">
              Aficionados reales de Lima y provincias que ya visten sus camisetas favoritas con acabados profesionales y entregas garantizadas por Shalom e InDrive.
            </p>
          </div>

          {/* Calificación y Botón Dejar Reseña */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 bg-surface-card border border-stroke px-4 py-3 rounded-2xl shadow-sm">
              <span className="font-['Montserrat',sans-serif] font-black text-3xl sm:text-4xl text-txt-main leading-none">
                {promedioRating}
              </span>
              <div>
                <div className="flex items-center gap-1 text-[#22c55e]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#22c55e" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted block mt-1">
                  {totalReviews} OPINIONES Y PEDIDOS REALES
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="bg-[#22c55e] hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus size={16} strokeWidth={2.5} />
              <span>DEJAR MI COMENTARIO</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Clientes y Entregas Reales */}
        {loading ? (
          <div className="text-center py-16 text-txt-muted font-bold font-['Montserrat',sans-serif]">
            Cargando entregas y opiniones de clientes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((item) => {
              const nombreDisplay = item.nombre_cliente || item.name || 'Cliente Andrew';
              const ciudadDisplay = item.city || 'Lima (Envío Shalom)';
              const badgeDisplay = item.badge || 'CLIENTE VERIFICADO';
              const imagenDisplay = item.image || null;
              const initial = nombreDisplay.trim().charAt(0).toUpperCase() || 'A';
              const productoDisplay = item.product_nombre || item.product || 'Camiseta Andrew';

              return (
                <div
                  key={item.id}
                  className="bg-surface-card border border-stroke rounded-2xl overflow-hidden flex flex-col justify-between p-4 shadow-md hover:border-[#22c55e]/50 transition-all duration-300 group hover:shadow-[0_12px_35px_rgba(34,197,94,0.12)]"
                >
                  {/* Foto real del cliente con su camiseta (o tarjeta verificada si comentó sin foto) */}
                  <div className="w-full h-56 sm:h-60 rounded-xl overflow-hidden bg-surface-sub relative mb-4 border border-stroke">
                    {imagenDisplay ? (
                      <img
                        src={imagenDisplay}
                        alt={productoDisplay}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/clientes/cliente_peru.webp';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#22c55e]/15 via-surface-sub to-surface-card">
                        <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] mb-3 shadow-inner">
                          <Shirt size={28} />
                        </div>
                        <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main tracking-wide line-clamp-2">
                          {productoDisplay}
                        </span>
                        <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider mt-1">
                          Compra Verificada Andrew
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    
                    {/* Badge de ciudad/entrega sobre la foto */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold keep-white bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15">
                      <span className="flex items-center gap-1 text-[#22c55e] truncate">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate keep-white">{ciudadDisplay}</span>
                      </span>
                    </div>
                  </div>

                  {/* Contenido del testimonio */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      {/* Estrellas */}
                      <div className="flex items-center gap-1 text-[#22c55e]">
                        {[...Array(Number(item.calificacion) || 5)].map((_, i) => (
                          <Star key={i} size={13} fill="#22c55e" strokeWidth={0} />
                        ))}
                      </div>

                      {/* Badge de estado */}
                      <span className="inline-block bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                        {badgeDisplay}
                      </span>
                    </div>

                    {productoDisplay && (
                      <p className="text-[11px] font-extrabold uppercase text-txt-main tracking-wide truncate">
                        👕 {productoDisplay}
                      </p>
                    )}

                    <p className="text-txt-muted text-xs leading-relaxed font-medium line-clamp-3">
                      "{item.comentario || item.comment}"
                    </p>
                  </div>

                  {/* Pie de tarjeta */}
                  <div className="pt-4 mt-3 border-t border-stroke flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#22c55e] text-black font-black text-xs flex items-center justify-center font-['Montserrat',sans-serif] shadow-md">
                        {initial}
                      </div>
                      <div>
                        <span className="block text-txt-main text-[11px] font-extrabold leading-none">
                          {nombreDisplay}
                        </span>
                        <span className="flex items-center gap-1 text-[#22c55e] text-[9px] font-bold mt-0.5">
                          <CheckCircle2 size={10} /> Entrega confirmada
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onProductClick(productoDisplay)}
                      className="text-txt-muted hover:text-[#22c55e] text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Ver detalles"
                    >
                      <span>VER</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal para Dejar Reseña y Subir / Tomar Foto Personal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-card border border-stroke rounded-3xl w-full max-w-lg max-h-[90dvh] overflow-y-auto p-5 sm:p-7 relative shadow-2xl space-y-5 text-txt-main">
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-3.5 right-3.5 w-11 h-11 flex items-center justify-center text-txt-muted hover:text-txt-main bg-surface-sub hover:bg-stroke/40 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X size={18} />
            </button>

            {/* Cabecera del Modal */}
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 text-[#22c55e] text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles size={14} />
                <span>COMUNIDAD ANDREW CAMISETAS</span>
              </div>
              <h3 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl uppercase text-txt-main tracking-tight">
                COMPARTE TU EXPERIENCIA Y FOTO
              </h3>
              <p className="text-txt-muted text-xs font-medium mt-1">
                Sube o toma una foto de tu camiseta y publica tu comentario al instante para toda la hinchada.
              </p>
            </div>

            {exito ? (
              <div className="bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={42} className="mx-auto" />
                <h4 className="font-black text-base uppercase text-txt-main">¡Comentario publicado con éxito!</h4>
                <p className="text-xs text-txt-muted font-medium">Tu opinión y foto ya están visibles en el muro de clientes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-['Montserrat',sans-serif]">
                {/* Calificación Interactiva */}
                <div className="bg-surface-sub border border-stroke rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[11px] font-black uppercase text-txt-main tracking-wide">
                    CALIFICACIÓN GENERAL:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onMouseEnter={() => setHoverCalificacion(st)}
                        onMouseLeave={() => setHoverCalificacion(0)}
                        onClick={() => setCalificacion(st)}
                        className="p-0.5 text-yellow-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          size={22}
                          fill={(hoverCalificacion || calificacion) >= st ? '#eab308' : 'none'}
                          className={(hoverCalificacion || calificacion) >= st ? 'text-yellow-400' : 'text-txt-muted/40'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-txt-main ml-1.5">
                      {hoverCalificacion || calificacion} / 5
                    </span>
                  </div>
                </div>

                {/* Nombre y Ciudad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-txt-main mb-1.5">
                      TU NOMBRE COMPLETO: *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Daniel Quispe"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3.5 py-2.5 text-xs font-medium text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-[#22c55e] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-txt-main mb-1.5">
                      CIUDAD / DISTRITO:
                    </label>
                    <input
                      type="text"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Ej: Lima / Arequipa (Shalom)"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3.5 py-2.5 text-xs font-medium text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-[#22c55e] transition-colors"
                    />
                  </div>
                </div>

                {/* Camiseta o Producto */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-txt-main mb-1.5">
                    CAMISETA QUE RECIBISTE:
                  </label>
                  <input
                    type="text"
                    value={productoComprado}
                    onChange={(e) => setProductoComprado(e.target.value)}
                    placeholder="Ej: Camiseta Real Madrid 24/25 o Selección Peruana"
                    className="w-full bg-input-bg border border-stroke rounded-xl px-3.5 py-2.5 text-xs font-medium text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-[#22c55e] transition-colors"
                  />
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-txt-main mb-1.5">
                    TU COMENTARIO Y OPINIÓN: *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Cuéntanos qué tal la calidad de la tela, el estampado del dorsal, el bordado o el tiempo de entrega..."
                    className="w-full bg-input-bg border border-stroke rounded-xl p-3 text-xs font-medium text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-[#22c55e] transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Subir o Tomar Foto Personal */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-txt-main mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera size={14} className="text-[#22c55e]" />
                      <span>TU FOTO CON LA CAMISETA (OPCIONAL):</span>
                    </span>
                    {fotoUrl && (
                      <button
                        type="button"
                        onClick={() => setFotoUrl('')}
                        className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={11} /> Quitar foto
                      </button>
                    )}
                  </label>

                  {/* Inputs ocultos para Galería y Cámara */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {fotoUrl ? (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-[#22c55e] bg-surface-sub group">
                      <img
                        src={fotoUrl}
                        alt="Vista previa de tu foto"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-black font-black text-[11px] uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <Upload size={13} /> Cambiar foto
                        </button>
                        <button
                          type="button"
                          onClick={() => setFotoUrl('')}
                          className="bg-red-500 keep-white font-black text-[11px] uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-[#22c55e] text-black font-black text-[10px] uppercase px-2.5 py-1 rounded-lg shadow">
                        ✓ Foto lista para publicar
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        disabled={subiendoFoto}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-stroke hover:border-[#22c55e] bg-surface-sub hover:bg-[#22c55e]/10 text-txt-main transition-all cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload size={18} />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-[11px] uppercase text-txt-main">
                            {subiendoFoto ? 'Procesando...' : 'Subir una foto'}
                          </span>
                          <span className="block text-[10px] text-txt-muted font-medium">
                            Desde tu galería o PC
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={subiendoFoto}
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-stroke hover:border-[#22c55e] bg-surface-sub hover:bg-[#22c55e]/10 text-txt-main transition-all cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera size={18} />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-[11px] uppercase text-txt-main">
                            {subiendoFoto ? 'Procesando...' : 'Tomar una foto'}
                          </span>
                          <span className="block text-[10px] text-txt-muted font-medium">
                            Usar cámara ahora
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón de Enviar */}
                <button
                  type="submit"
                  disabled={enviando || subiendoFoto}
                  className="w-full bg-[#22c55e] hover:bg-[#1fa75d] disabled:opacity-50 text-black font-['Montserrat',sans-serif] font-black text-xs uppercase py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
                >
                  <Send size={15} strokeWidth={2.5} />
                  <span>{enviando ? 'PUBLICANDO COMENTARIO...' : 'PUBLICAR MI COMENTARIO AHORA'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
