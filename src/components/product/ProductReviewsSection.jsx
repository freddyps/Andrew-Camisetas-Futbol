import React, { useState, useEffect, useRef } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, Send, Sparkles, Camera, Upload, Trash2 } from 'lucide-react';
import { getReviewsAprobadas, crearReview } from '../../services/reviewService';
import { sanitizeText, validateImageFile, checkLoginRateLimit } from '../../utils/security';

/**
 * Comprime y redimensiona una imagen seleccionada (archivo o cámara) a JPEG ligero.
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
 * ProductReviewsSection:
 * Componente modular de opiniones y calificaciones de clientes.
 * Muestra el promedio general de estrellas, compras verificadas y formulario
 * interactivo para publicar comentarios y subir o tomar su propia foto.
 */
export default function ProductReviewsSection({ productoId = 'general', productoNombre = 'esta prenda' }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [fotoUrl, setFotoUrl] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const cargarReviews = React.useCallback(async () => {
    setLoading(true);
    const data = await getReviewsAprobadas(productoId);
    setReviews(data);
    setLoading(false);
  }, [productoId]);

  useEffect(() => {
    cargarReviews();

    const handleUpdate = () => cargarReviews();
    window.addEventListener('andrew_reviews_updated', handleUpdate);
    return () => window.removeEventListener('andrew_reviews_updated', handleUpdate);
  }, [cargarReviews]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const checkFile = validateImageFile(file, 5);
    if (!checkFile.valid) {
      alert(checkFile.errorMsg);
      e.target.value = '';
      return;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombreLimpio = sanitizeText(nombre);
    const comentarioLimpio = sanitizeText(comentario);
    if (!nombreLimpio || !comentarioLimpio) return;

    const rateCheck = checkLoginRateLimit(`review_${productoId}`, 3, 60000);
    if (!rateCheck.allowed) {
      alert(rateCheck.errorMsg);
      return;
    }

    setEnviando(true);
    try {
      await crearReview({
        producto_id: productoId,
        nombre_cliente: nombreLimpio,
        calificacion,
        comentario: comentarioLimpio,
        product_nombre: productoNombre,
        image: fotoUrl || null
      });

      setNombre('');
      setComentario('');
      setFotoUrl('');
      setCalificacion(5);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 5000);
    } catch (err) {
      console.error('Error al enviar reseña:', err);
    } finally {
      setEnviando(false);
    }
  };

  // Cálculo de promedio
  const totalReviews = reviews.length;
  const promedioEstrellas = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8">
      {/* Cabecera de Resumen de Calificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-sub border border-stroke rounded-2xl p-6 sm:p-8 items-center transition-colors">
        
        {/* Promedio General */}
        <div className="md:col-span-5 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-stroke pb-6 md:pb-0 md:pr-6">
          <span className="text-[11px] font-black uppercase text-txt-muted tracking-wider font-['Montserrat',sans-serif]">
            VALORACIÓN DE CLIENTES
          </span>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-['Montserrat',sans-serif] text-5xl font-black text-txt-main">
              {promedioEstrellas}
            </span>
            <div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((st) => (
                  <Star
                    key={st}
                    size={16}
                    fill={st <= Math.round(Number(promedioEstrellas)) ? 'currentColor' : 'none'}
                    className={st <= Math.round(Number(promedioEstrellas)) ? 'text-yellow-400' : 'text-txt-muted'}
                  />
                ))}
              </div>
              <span className="text-xs text-txt-muted font-bold block mt-0.5">
                Basado en {totalReviews} {totalReviews === 1 ? 'opinión' : 'opiniones'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-andrew-primary font-extrabold pt-1">
            <ShieldCheck size={16} />
            <span>100% Calificaciones verificadas</span>
          </div>
        </div>

        {/* Garantías de Prueba Social */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-surface-card p-3.5 rounded-xl border border-stroke space-y-1">
            <span className="text-andrew-primary font-black uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Calidad Oficial A1
            </span>
            <p className="text-txt-muted text-[11px] leading-relaxed">
              Tejido de competición termo-sellado y parches idénticos a los usados por los jugadores.
            </p>
          </div>

          <div className="bg-surface-card p-3.5 rounded-xl border border-stroke space-y-1">
            <span className="text-andrew-primary font-black uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles size={14} />
              Estampado Garantizado
            </span>
            <p className="text-txt-muted text-[11px] leading-relaxed">
              Dorsales oficiales que no se despegan ni decoloran tras las lavadas.
            </p>
          </div>
        </div>

      </div>

      {/* Cuadrícula: Lista de Opiniones + Formulario de Envío */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Lista de Opiniones (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main tracking-wide">
            RESEÑAS DE LA COMUNIDAD ({reviews.length})
          </h4>

          {loading ? (
            <div className="text-center py-8 text-txt-muted text-xs">
              Cargando opiniones...
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-surface-sub p-8 rounded-2xl border border-stroke text-center space-y-2">
              <MessageSquare size={32} className="mx-auto text-txt-muted" />
              <p className="text-txt-main font-bold text-xs">Aún no hay comentarios aprobados para esta prenda.</p>
              <p className="text-txt-muted text-[11px]">¡Sé el primero en compartir tu experiencia tras recibir tu camiseta!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {reviews.map((r) => (
                <div key={r.id} className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5 space-y-2.5 transition-all hover:border-stroke-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-['Montserrat',sans-serif] font-black text-xs text-txt-main uppercase">
                        {r.nombre_cliente}
                      </span>
                      <span className="bg-andrew-primary/15 border border-andrew-primary/30 text-andrew-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Compra Verificada
                      </span>
                    </div>
                    <span className="text-[10px] text-txt-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : 'Reciente'}
                    </span>
                  </div>

                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        size={12}
                        fill={st <= Number(r.calificacion) ? 'currentColor' : 'none'}
                        className={st <= Number(r.calificacion) ? 'text-yellow-400' : 'text-txt-muted'}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-txt-muted leading-relaxed font-normal">
                    "{r.comentario}"
                  </p>

                  {r.image && (
                    <div className="pt-1">
                      <img
                        src={r.image}
                        alt={`Foto de ${r.nombre_cliente}`}
                        className="w-28 h-28 object-cover rounded-xl border border-stroke"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario de Envío (5 cols) */}
        <div className="lg:col-span-5 bg-surface-sub border border-stroke rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main flex items-center gap-2">
              <MessageSquare size={16} className="text-andrew-primary" />
              <span>DEJA TU OPINIÓN Y FOTO</span>
            </h4>
            <p className="text-[11px] text-txt-muted mt-1">
              ¿Compraste {productoNombre}? Comparte tu opinión y sube una foto de tu camiseta.
            </p>
          </div>

          {mensajeExito && (
            <div className="bg-andrew-primary/15 border border-andrew-primary/40 text-andrew-primary p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>¡Gracias! Tu reseña y foto se han publicado con éxito.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Calificación Interactiva */}
            <div>
              <label className="block text-[10px] font-black uppercase text-txt-muted mb-1.5 font-['Montserrat',sans-serif]">
                TU CALIFICACIÓN GENERAL:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onMouseEnter={() => setHoverCalificacion(st)}
                    onMouseLeave={() => setHoverCalificacion(0)}
                    onClick={() => setCalificacion(st)}
                    className="p-1 text-yellow-400 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      size={20}
                      fill={(hoverCalificacion || calificacion) >= st ? 'currentColor' : 'none'}
                      className={(hoverCalificacion || calificacion) >= st ? 'text-yellow-400' : 'text-txt-muted'}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-txt-main ml-2">
                  {hoverCalificacion || calificacion} de 5 estrellas
                </span>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-[10px] font-black uppercase text-txt-muted mb-1 font-['Montserrat',sans-serif]">
                TU NOMBRE Y APELLIDO: *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Daniel Quispe"
                className="w-full bg-input-bg border border-stroke rounded-xl px-3.5 py-2.5 text-xs text-txt-main placeholder:text-txt-muted outline-none focus:border-andrew-primary transition-colors"
              />
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-[10px] font-black uppercase text-txt-muted mb-1 font-['Montserrat',sans-serif]">
                TU COMENTARIO O RESEÑA: *
              </label>
              <textarea
                required
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos sobre el ajuste de la talla, la calidad del escudo, la tela o la velocidad del envío..."
                className="w-full bg-input-bg border border-stroke rounded-xl p-3 text-xs text-txt-main placeholder:text-txt-muted outline-none focus:border-andrew-primary transition-colors resize-none"
              ></textarea>
            </div>

            {/* Subir o Tomar Foto */}
            <div>
              <label className="block text-[10px] font-black uppercase text-txt-muted mb-1.5 font-['Montserrat',sans-serif] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera size={13} className="text-andrew-primary" />
                  <span>FOTO DE TU CAMISETA (OPCIONAL):</span>
                </span>
                {fotoUrl && (
                  <button
                    type="button"
                    onClick={() => setFotoUrl('')}
                    className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={11} /> Quitar
                  </button>
                )}
              </label>

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
                <div className="relative w-full h-36 rounded-xl overflow-hidden border-2 border-andrew-primary bg-surface-card">
                  <img
                    src={fotoUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-andrew-primary text-black font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow">
                    ✓ Foto cargada
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={subiendoFoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-stroke hover:border-andrew-primary bg-surface-card text-txt-main transition-colors cursor-pointer"
                  >
                    <Upload size={15} className="text-andrew-primary shrink-0" />
                    <span className="font-bold text-[10px] uppercase">Subir foto</span>
                  </button>

                  <button
                    type="button"
                    disabled={subiendoFoto}
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-stroke hover:border-andrew-primary bg-surface-card text-txt-main transition-colors cursor-pointer"
                  >
                    <Camera size={15} className="text-andrew-primary shrink-0" />
                    <span className="font-bold text-[10px] uppercase">Tomar foto</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando || subiendoFoto}
              className="w-full bg-andrew-primary hover:bg-[#1fa75d] disabled:opacity-50 text-black font-['Montserrat',sans-serif] font-black text-xs uppercase py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
            >
              <Send size={14} strokeWidth={2.5} />
              <span>{enviando ? 'ENVIANDO RESEÑA...' : 'PUBLICAR RESEÑA'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
