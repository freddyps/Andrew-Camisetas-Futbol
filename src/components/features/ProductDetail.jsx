import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Minus, Truck, Shield, RefreshCw, Heart, CheckCircle2, Ruler, X, AlertTriangle, Star } from 'lucide-react';
import { products as allProducts } from '../../data/products';
import { useAppContext } from '../../context/AppContext';

export default function ProductDetail({ item, onBack, onAddToCart, wishlistItems = [], onToggleWishlist }) {
  const { products: ctxProducts } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(item.gallery[0] || item.image);
  const [selectedVersion, setSelectedVersion] = useState('fan');
  const [selectedSize, setSelectedSize] = useState('M');
  const [customName, setCustomName] = useState(false);
  const [personalizationName, setPersonalizationName] = useState('');
  const [personalizationNumber, setPersonalizationNumber] = useState('');
  const [addShort, setAddShort] = useState(false);
  const [activeTab, setActiveTab] = useState('descripcion');

  // Cantidad de productos
  const [quantity, setQuantity] = useState(1);

  // Estado para el modal de Guía de Tallas
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [showInteractivePreview, setShowInteractivePreview] = useState(false);

  // ESTADO DE RESEÑAS OPERACIONAL
  const [reviews, setReviews] = useState([]);

  // Formulario de reseña nueva
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
      try {
        const response = await fetch(`${djangoApiBaseUrl.replace(/\/$/, '')}/api/camisetas/${item.id}/`);
        if (response.ok) {
          const data = await response.json();
          if (data.resenas) {
            const mapped = data.resenas.map(r => ({
              id: r.id,
              author: r.nombre_cliente,
              rating: r.calificacion,
              date: new Date(r.fecha).toLocaleDateString('es-PE'),
              text: r.comentario
            }));
            setReviews(mapped);
          } else {
            setReviews([]);
          }
        }
      } catch (err) {
        setReviews([
          {
            id: 1,
            author: "Paolo Guerrero",
            rating: 5,
            date: "Hace 3 días",
            text: "La calidad del bordado y las costuras de la Selección Peruana es increíble. El entallado de jugador (Slim Fit) queda perfecto si pides una talla más. ¡100% recomendado!"
          },
          {
            id: 2,
            author: "Claudio Pizarro",
            rating: 5,
            date: "Hace 1 semana",
            text: "El simulador en tiempo real de la espalda es tal cual llega físicamente. Compré la del Real Madrid y el estampado dorado oficial brilla espectacular. Envío rápido a San Isidro."
          },
          {
            id: 3,
            author: "Christian Cueva",
            rating: 4,
            date: "Hace 2 semanas",
            text: "Excelente tela transpirable jacquard mesh, perfecta para pichangas de fin de semana. Le agregué el short oficial y el uniforme quedó de primera."
          }
        ]);
      }
    };
    fetchReviews();
  }, [item.id]);

  useEffect(() => {
    if (customName || addShort) {
      setShowInteractivePreview(true);
    } else {
      setShowInteractivePreview(false);
    }
  }, [customName, addShort]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) {
      setReviewSubmitMessage('Por favor ingresa tu nombre y un comentario para tu reseña.');
      return;
    }

    const reviewData = {
      camiseta: item.id,
      nombre_cliente: newReviewAuthor,
      calificacion: Number(newReviewRating),
      comentario: newReviewText
    };

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${djangoApiBaseUrl.replace(/\/$/, '')}/api/resenas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      if (response.ok) {
        const saved = await response.json();
        const normalized = {
          id: saved.id,
          author: saved.nombre_cliente,
          rating: saved.calificacion,
          date: "Hoy",
          text: saved.comentario
        };
        setReviews(prev => [normalized, ...prev]);
        setNewReviewAuthor('');
        setNewReviewRating(5);
        setNewReviewText('');
        setReviewSubmitMessage('✓ ¡Gracias por tu reseña! Ha sido publicada con éxito.');
      } else {
        setReviewSubmitMessage('✗ Error al guardar la reseña en el servidor.');
      }
    } catch (err) {
      const review = {
        id: Date.now(),
        author: newReviewAuthor,
        rating: Number(newReviewRating),
        date: "Hoy (Local)",
        text: newReviewText
      };
      setReviews(prev => [review, ...prev]);
      setNewReviewAuthor('');
      setNewReviewRating(5);
      setNewReviewText('');
      setReviewSubmitMessage('✓ ¡Gracias por tu reseña (Guardada localmente)!');
    }
  };

  const isFavorite = wishlistItems.some((fav) => fav.id === item.id);

  const versionPrice = selectedVersion === 'fan' ? item.precio : item.precio + 15;
  const customizationPrice = customName ? 15.00 : 0;
  const shortPrice = addShort ? 40.00 : 0;
  const totalPrice = (versionPrice + customizationPrice + shortPrice).toFixed(2);
  const finalPrice = (totalPrice * quantity).toFixed(2);

  const tabClasses = (tab) =>
    `font-display text-xs sm:text-sm font-black uppercase tracking-[0.15em] py-4.5 transition-all duration-300 relative cursor-pointer ${
      activeTab === tab
        ? 'text-[#22c55e] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#22c55e] after:shadow-[0_0_8px_#22c55e]'
        : 'text-gray-400 hover:text-white'
    }`;

  // DYNAMIC ADAPTIVE PREVIEW SIMULATOR STYLE GENERATOR
  const getSimulatorStyle = (teamName) => {
    const name = teamName.toLowerCase();
    
    if (name.includes('madrid')) {
      return {
        bg: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#d97706', // gold
        shortColor: '#ffffff',
        hasStripes: false,
        hasSash: false,
        hasCenterStripe: false,
      };
    }
    if (name.includes('barcelona')) {
      return {
        bg: '#0f172a', // deep blue
        textColor: '#fef08a', // gold letters
        accentColor: '#dc2626',
        shortColor: '#0f172a',
        hasStripes: true,
        stripeColor: '#dc2626', // red stripes
        hasSash: false,
        hasCenterStripe: false,
      };
    }
    if (name.includes('united') || name.includes('arsenal')) {
      return {
        bg: '#dc2626', // red
        textColor: '#ffffff',
        accentColor: '#111827',
        shortColor: '#ffffff',
        hasStripes: false,
        hasSash: false,
        hasCenterStripe: false,
      };
    }
    if (name.includes('paris') || name.includes('psg')) {
      return {
        bg: '#172554', // dark navy
        textColor: '#ffffff',
        accentColor: '#ef4444', // red
        shortColor: '#172554',
        hasStripes: false,
        hasSash: false,
        hasCenterStripe: true, // red/white center stripes
      };
    }
    if (name.includes('bayern')) {
      return {
        bg: '#991b1b', // dark red
        textColor: '#ffffff',
        accentColor: '#dc2626',
        shortColor: '#991b1b',
        hasStripes: false,
        hasSash: false,
        hasCenterStripe: false,
      };
    }
    if (name.includes('juventus')) {
      return {
        bg: '#ffffff',
        textColor: '#eab308', // gold/yellow letters
        accentColor: '#000000',
        shortColor: '#000000',
        hasStripes: true,
        stripeColor: '#000000', // black stripes
        hasSash: false,
        hasCenterStripe: false,
      };
    }
    if (name.includes('peru') || name.includes('peruana')) {
      return {
        bg: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#dc2626', // red sash
        shortColor: '#ffffff',
        hasStripes: false,
        hasSash: true,
        hasCenterStripe: false,
      };
    }

    // Default Fallback
    return {
      bg: '#171717',
      textColor: '#22c55e',
      accentColor: '#22c55e',
      shortColor: '#171717',
      hasStripes: false,
      hasSash: false,
      hasCenterStripe: false,
    };
  };

  const sim = getSimulatorStyle(item.equipo);

  // Filtrar productos relacionados para venta cruzada (Sugerencias) - Priorizando misma liga/categoría
  const activeProducts = ctxProducts && ctxProducts.length ? ctxProducts : allProducts;
  const recommendedProducts = activeProducts
    .filter((p) => p.id !== item.id)
    .sort((a, b) => {
      if (a.liga === item.liga && b.liga !== item.liga) return -1;
      if (a.liga !== item.liga && b.liga === item.liga) return 1;
      if (a.categoria === item.categoria && b.categoria !== item.categoria) return -1;
      if (a.categoria !== item.categoria && b.categoria === item.categoria) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <main className="bg-[#050505] text-white py-12 px-6 md:px-12 min-h-screen">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        
        {/* BOTÓN VOLVER Y FAVORITOS */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button 
            onClick={onBack} 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver al Catálogo
          </button>
          
          <button
            type="button"
            onClick={() => onToggleWishlist?.(item)}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/40 bg-white/[0.02] hover:bg-red-500/5 transition-all cursor-pointer text-xs uppercase tracking-wider font-extrabold rounded-full"
          >
            <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
            <span>{isFavorite ? "Favorito" : "Guardar"}</span>
          </button>
        </div>

        {/* DETALLE PRINCIPAL: 2 COLUMNAS */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
          <div className="space-y-4">
            {/* Imagen Grande */}
            <div className="overflow-hidden border border-white/5 bg-white/[0.01] aspect-[4/5] relative group rounded-2xl flex flex-col items-center justify-center p-6">
              {showInteractivePreview ? (
                <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${addShort ? 'gap-3' : ''}`}>
                  <div className="absolute top-4 left-4 text-[8px] font-black text-gray-500 uppercase tracking-widest z-10">VISTA PREVIA PERSONALIZADA</div>
                  
                  {/* Jersey */}
                  <div 
                    className="w-40 h-52 border border-white/10 relative flex flex-col items-center justify-start pt-6 shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl shrink-0 animate-scale-in"
                    style={{ backgroundColor: sim.bg }}
                  >
                    {/* Cuello del polo */}
                    <div className="absolute top-0 w-14 h-3.5 bg-white/10 rounded-b-full z-10"></div>
                    
                    {/* Líneas laterales o detalles */}
                    <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/25"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-black/25"></div>

                    {/* DETALLES DINÁMICOS VECTORIALES ESTILO JERSEY */}
                    
                    {/* Rayas Verticales */}
                    {sim.hasStripes && (
                      <div className="absolute inset-0 opacity-80 pointer-events-none flex justify-around">
                        <span className="w-5 h-full" style={{ backgroundColor: sim.stripeColor }}></span>
                        <span className="w-5 h-full" style={{ backgroundColor: sim.stripeColor }}></span>
                        <span className="w-5 h-full" style={{ backgroundColor: sim.stripeColor }}></span>
                      </div>
                    )}

                    {/* Franja Diagonal Sash */}
                    {sim.hasSash && (
                      <div 
                        className="absolute w-[200%] h-9 opacity-95 rotate-[-45deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-xl" 
                        style={{ backgroundColor: sim.accentColor }}
                      />
                    )}

                    {/* Franja Central Vertical */}
                    {sim.hasCenterStripe && (
                      <div 
                        className="absolute top-0 bottom-0 w-8 opacity-95 pointer-events-none flex justify-center items-center" 
                        style={{ backgroundColor: sim.accentColor, left: 'calc(50% - 16px)' }}
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-[2.5px] bg-white opacity-80"></span>
                        <span className="absolute right-0 top-0 bottom-0 w-[2.5px] bg-white opacity-80"></span>
                      </div>
                    )}

                    {/* Nombre Personalizado */}
                    <div className="w-full text-center mt-2.5 px-2.5 overflow-hidden z-10">
                      <span 
                        className="font-display font-black text-[11px] tracking-[0.25em] block uppercase tracking-wider truncate"
                        style={{ color: sim.textColor }}
                      >
                        {customName ? (personalizationName.trim() || "ANDREW") : ""}
                      </span>
                    </div>
                    
                    {/* Número Personalizado Grande */}
                    <div className="flex-1 flex items-center justify-center -mt-3 z-10">
                      <span 
                        className="font-display font-black text-5xl tracking-tighter"
                        style={{ 
                          color: sim.textColor,
                          textShadow: sim.bg === '#ffffff' ? 'none' : '0 0 10px rgba(255,255,255,0.2)'
                        }}
                      >
                        {customName ? (personalizationNumber.trim() || "10") : ""}
                      </span>
                    </div>

                    {/* Borde inferior */}
                    <div 
                      className="absolute bottom-2.5 text-[7px] font-black uppercase tracking-widest z-10 opacity-70"
                      style={{ color: sim.textColor }}
                    >
                      ANDREW ELITE
                    </div>
                  </div>

                  {/* Visualizador de Short (Pantalón corto) */}
                  {addShort && (
                    <div 
                      className="w-28 h-18 border border-white/10 relative flex flex-col justify-between pt-1 pb-2 shadow-2xl transition-all duration-300 overflow-hidden rounded-lg animate-scale-in shrink-0"
                      style={{ backgroundColor: sim.shortColor }}
                    >
                      {/* Cintura del short */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-black/25 flex justify-around">
                        <span className="w-0.5 h-full bg-white/10"></span>
                        <span className="w-0.5 h-full bg-white/10"></span>
                        <span className="w-0.5 h-full bg-white/10"></span>
                      </div>

                      {/* División de piernas */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-2 bg-black/35 rounded-t-full z-10"></div>

                      {/* Número en la pierna izquierda */}
                      {customName && personalizationNumber && (
                        <span 
                          className="absolute bottom-1 right-2.5 font-display font-black text-[9px]"
                          style={{ color: sim.textColor }}
                        >
                          {personalizationNumber}
                        </span>
                      )}

                      {/* Inicial en pierna derecha */}
                      <span 
                        className="absolute bottom-1 left-2.5 font-display font-black text-[6px] uppercase tracking-tighter opacity-85"
                        style={{ color: sim.textColor }}
                      >
                        A
                      </span>

                      {/* Franjas decorativas laterales del short */}
                      <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: sim.accentColor }}></div>
                      <div className="absolute top-0 bottom-0 right-0 w-2" style={{ backgroundColor: sim.accentColor }}></div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <img 
                    src={selectedImage} 
                    alt={`Camiseta ${item.equipo} vista principal`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-display font-black px-3 py-1.5 uppercase tracking-wider rounded-full">
                    Elite Quality
                  </span>
                </>
              )}
            </div>

            {/* Miniaturas de Galería */}
            <div className="grid grid-cols-4 gap-4">
              {item.gallery.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedImage(src);
                    setShowInteractivePreview(false);
                  }}
                  className={`overflow-hidden border p-1 transition-all duration-300 aspect-square bg-white/[0.01] cursor-pointer rounded-xl ${
                    (!showInteractivePreview && selectedImage === src) 
                      ? 'border-[#22c55e] bg-[#22c55e]/10' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={src} alt={`Camiseta vista ${index + 1}`} className="h-full w-full object-cover rounded-lg" />
                </button>
              ))}

              {/* Miniatura Especial de Vista Previa Personalizada */}
              {(customName || addShort) && (
                <button
                  type="button"
                  onClick={() => setShowInteractivePreview(true)}
                  className={`overflow-hidden border p-2 transition-all duration-300 aspect-square flex flex-col items-center justify-center cursor-pointer rounded-xl bg-black border-dashed ${
                    showInteractivePreview 
                      ? 'border-[#22c55e] bg-[#22c55e]/10' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-[8px] font-display font-black text-center text-[#22c55e] uppercase tracking-wider leading-none">
                    DISEÑO<br />3D
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: CONFIGURACIÓN E INTERACCIÓN */}
          <div className="space-y-6">
            
            {/* Cabecera del Producto */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3.5">
                <span className="bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-xs font-display font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full glow-text-green">
                  {item.liga}
                </span>
                <span className="bg-white/10 text-white text-xs font-display font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  Camiseta {item.categoria}
                </span>
                <span className="bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-display font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  BEST SELLER
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white leading-none">
                {item.equipo}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2">
                Temporada Oficial 2025/2026
              </p>
            </div>

            {/* PANEL DE CONFIGURACIÓN (GLASS PANEL) */}
            <div className="glass-panel border border-white/10 p-6 space-y-6 shadow-2xl rounded-2xl">
              
              {/* Precios y Alerta de Stock Real */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs text-gray-500 font-extrabold uppercase tracking-widest">PRECIO INCLUYE I.G.V.</p>
                  <p className="mt-1 text-3xl font-display font-black text-white tracking-tight">S/ {versionPrice.toFixed(2)}</p>
                </div>
                
                {/* Gestor Dinámico de Stock */}
                <div className="text-right">
                  {item.stock <= 15 ? (
                    <div className="inline-flex items-center gap-1.5 text-xs text-red-500 font-display font-black uppercase glow-text-red animate-pulse bg-red-500/5 px-3 py-1 border border-red-500/15 rounded-full">
                      <AlertTriangle size={12} />
                      ¡SOLO QUEDAN {item.stock} UNIDADES!
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] font-display font-black uppercase glow-text-green bg-[#22c55e]/5 px-3 py-1 border border-[#22c55e]/15 rounded-full">
                      <CheckCircle2 size={12} />
                      ENVÍO INMEDIATO ({item.stock} DISP.)
                    </div>
                  )}
                </div>
              </div>

              {/* Selector de Versión (Fan vs Player) */}
              <div>
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-3">SELECCIONAR VERSIÓN</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVersion('fan')}
                    className={`text-left p-4 border transition-all duration-300 cursor-pointer rounded-xl ${
                      selectedVersion === 'fan' 
                        ? 'border-[#22c55e] bg-[#22c55e]/5' 
                        : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                    }`}
                  >
                    <p className="text-[10px] font-display font-black uppercase tracking-wider text-gray-400">Versión Fan</p>
                    <p className="mt-1 text-xs font-black text-white uppercase">Calidad Cómoda</p>
                    <p className="mt-2 text-base font-display font-black text-[#22c55e]">S/ {item.precio.toFixed(2)}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVersion('player')}
                    className={`text-left p-4 border transition-all duration-300 cursor-pointer rounded-xl ${
                      selectedVersion === 'player' 
                        ? 'border-[#22c55e] bg-[#22c55e]/5' 
                        : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                    }`}
                  >
                    <p className="text-[10px] font-display font-black uppercase tracking-wider text-[#22c55e] glow-text-green">Versión Jugador (+S/ 15)</p>
                    <p className="mt-1 text-xs font-black text-white uppercase">Corte Atlético Elite</p>
                    <p className="mt-2 text-base font-display font-black text-[#22c55e]">S/ {(item.precio + 15).toFixed(2)}</p>
                  </button>
                </div>
              </div>

              {/* Selector de Talla y Guía de Tallas */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">TALLAS DISPONIBLES</p>
                  <button 
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] font-display font-black uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
                  >
                    <Ruler size={12} /> Guía de Tallas
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3.5 text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all duration-300 border cursor-pointer rounded-xl ${
                        selectedSize === size 
                          ? 'border-[#22c55e] bg-[#22c55e]/15 text-white glow-green-sm' 
                          : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Switch de Personalización */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-white">Estampado Oficial de Nombre/Número</p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5 uppercase tracking-wide">Personaliza tu camiseta (+S/ 15.00)</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={customName}
                      onChange={() => setCustomName(!customName)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 bg-white/10 peer-checked:bg-[#22c55e] transition-colors duration-300 rounded-full"></div>
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 bg-white transition-transform duration-300 peer-checked:translate-x-5 rounded-full"></span>
                  </label>
                </div>
              </div>

              {/* Formulario de Personalización e INCLUSIÓN DEL SIMULADOR EN VIVO ADAPTATIVO */}
              {customName && (
                <div className="mt-4 border border-white/10 bg-white/[0.01] p-5 space-y-5 animate-fade-in-up rounded-2xl">
                  <h3 className="font-display font-black uppercase text-xs sm:text-sm tracking-wider text-[#22c55e] glow-text-green">
                    Configurar Estampado
                  </h3>
                  
                  {/* Inputs de Configuración */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-2">Nombre en la espalda</label>
                      <input
                        type="text"
                        value={personalizationName}
                        onChange={(e) => setPersonalizationName(e.target.value.toUpperCase().slice(0, 14))}
                        placeholder="Ej: GUERRERO"
                        className="w-full bg-[#050505] border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold uppercase rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-2">Número oficial</label>
                      <input
                        type="text"
                        value={personalizationNumber}
                        onChange={(e) => setPersonalizationNumber(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="Ej: 9"
                        className="w-full bg-[#050505] border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] transition-all font-semibold rounded-lg"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Adición de Short del Equipo */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                  <div>
                    <p className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-white">¿Agregar Short del Equipo?</p>
                    <p className="text-xs text-[#22c55e] font-bold mt-0.5 uppercase tracking-wide">COMPLETA TU UNIFORME OFICIAL (+S/ 40.00)</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAddShort(!addShort)}
                    className={`px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 border rounded-xl ${
                      addShort 
                        ? 'border-[#22c55e] bg-[#22c55e]/15 text-white glow-green-sm' 
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {addShort ? 'AGREGADO ✓' : '+ AGREGAR'}
                  </button>
                </div>
              </div>

              {/* ===== SELECCIONADOR DE CANTIDAD DE PRODUCTO ESTILO NIKE/ADIDAS ===== */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-white">Cantidad</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">¿Cuántas unidades deseas comprar?</p>
                </div>
                
                <div className="flex items-center gap-3 border border-white/10 bg-black/40 px-4 py-2 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-black font-display text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(item.stock, q + 1))}
                    className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Botón Principal Añadir al Carrito con precio acumulado */}
              <button
                type="button"
                onClick={() =>
                  onAddToCart(item, {
                    size: selectedSize,
                    version: selectedVersion,
                    customName,
                    personalizationName: personalizationName.trim() || "ANDREW",
                    personalizationNumber: personalizationNumber.trim() || "10",
                    addShort,
                    price: Number(totalPrice),
                    quantity: quantity
                  })
                }
                className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-4.5 text-xs sm:text-sm font-display font-black uppercase tracking-[0.1em] transition-all glow-green cursor-pointer flex items-center justify-center gap-2 btn-premium rounded-xl"
              >
                <ShoppingCart size={16} /> AGREGAR A LA BOLSA · S/ {finalPrice}
              </button>
            </div>
          </div>
        </div>

        {/* BENEFICIOS RÁPIDOS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-white/5 bg-white/[0.01] p-6 text-center rounded-2xl">
            <Truck className="mx-auto text-[#22c55e] glow-text-green" size={24} />
            <p className="mt-3 font-display font-black uppercase tracking-wide text-sm">Envío gratis</p>
            <p className="mt-1 text-xs text-gray-400 font-semibold uppercase">En compras mayores a S/ 150</p>
          </div>
          <div className="border border-white/5 bg-white/[0.01] p-6 text-center rounded-2xl">
            <Shield className="mx-auto text-[#22c55e] glow-text-green" size={24} />
            <p className="mt-3 font-display font-black uppercase tracking-wide text-sm">Garantía total</p>
            <p className="mt-1 text-xs text-gray-400 font-semibold uppercase">Camisetas 100% de alta gama</p>
          </div>
          <div className="border border-white/5 bg-white/[0.01] p-6 text-center rounded-2xl">
            <RefreshCw className="mx-auto text-[#22c55e] glow-text-green" size={24} />
            <p className="mt-3 font-display font-black uppercase tracking-wide text-sm">Cambios rápidos</p>
            <p className="mt-1 text-xs text-gray-400 font-semibold uppercase">Hasta 7 días sin complicaciones</p>
          </div>
        </div>

        {/* TABS DE ESPECIFICACIONES TÉCNICAS */}
        <div className="mt-16 border border-white/5 bg-white/[0.01] overflow-hidden rounded-2xl">
          {/* Navegación de Tabs */}
          <div className="grid grid-cols-3 text-center bg-[#0d0d0d] border-b border-white/5">
            <button type="button" onClick={() => setActiveTab('descripcion')} className={tabClasses('descripcion')}>
              Especificaciones
            </button>
            <button type="button" onClick={() => setActiveTab('materiales')} className={tabClasses('materiales')}>
              Materiales Elite
            </button>
            <button type="button" onClick={() => setActiveTab('cuidados')} className={tabClasses('cuidados')}>
              Cuidados del Polo
            </button>
          </div>

          {/* Contenido de los Tabs */}
          <div className="p-8 md:p-12">
            
            {activeTab === 'descripcion' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-wide text-white">Detalles del Diseño</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-400 font-semibold max-w-3xl">
                  {item.description} Desarrollada en base a análisis ergonómicos que reducen la fricción y aumentan la ventilación corporal. Diseñada para lucir de forma espectacular tanto en la cancha como en la calle.
                </p>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 pt-4">
                  <div className="bg-[#050505] border border-white/5 p-5 text-center rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-black">Corte</p>
                    <p className="mt-2 text-sm font-display font-black text-white uppercase">{item.details.corte}</p>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-5 text-center rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-black">Peso Promedio</p>
                    <p className="mt-2 text-sm font-display font-black text-white uppercase">{item.details.peso}</p>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-5 text-center rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-black">Tecnología de Tela</p>
                    <p className="mt-2 text-sm font-display font-black text-white uppercase">{item.details.tecnologia}</p>
                  </div>
                  <div className="bg-[#050505] border border-white/5 p-5 text-center rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-black">Origen del Hilado</p>
                    <p className="mt-2 text-sm font-display font-black text-white uppercase">{item.details.origen}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'materiales' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-wide text-white">Composición & Tecnología</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-400 font-semibold max-w-3xl">
                  Nuestras camisetas premium se fabrican con microfibras de poliéster 100% recicladas de alto rendimiento deportivo, diseñadas para extraer el sudor y esparcirlo rápidamente.
                </p>

                <div className="space-y-3 max-w-2xl pt-4">
                  <div className="border border-[#22c55e]/20 bg-[#22c55e]/5 p-5 flex items-start gap-4 rounded-xl">
                    <div className="h-10 w-10 shrink-0 bg-[#22c55e] text-black font-display font-black grid place-items-center text-sm rounded-lg">100%</div>
                    <div>
                      <p className="text-xs sm:text-sm font-display font-black uppercase text-white tracking-wide">Poliéster Reciclado Eco-Friendly</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">Hilado ecológico de alta flexibilidad que reduce el impacto ambiental en su fabricación.</p>
                    </div>
                  </div>
                  <div className="border border-[#22c55e]/20 bg-[#22c55e]/5 p-5 flex items-start gap-4 rounded-xl">
                    <CheckCircle2 size={20} className="text-[#22c55e] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-display font-black uppercase text-white tracking-wide">Tejido Inteligente Jacquard</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">Paneles de ventilación en los costados y en las axilas que optimizan la respiración de la piel.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cuidados' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-wide text-white">Guía de Mantenimiento</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-400 font-semibold max-w-3xl">
                  Los estampados termo-sellados oficiales necesitan cuidados especiales para asegurar su adherencia y nitidez durante años.
                </p>

                <div className="grid gap-6 md:grid-cols-2 pt-4">
                  <div className="border border-[#22c55e]/10 bg-[#22c55e]/5 p-6 rounded-xl">
                    <p className="text-sm font-display font-black uppercase tracking-wider text-[#22c55e] glow-text-green mb-4">Recomendado</p>
                    <ul className="space-y-3.5 text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wide">
                      <li>✓ Lavar siempre volteando el polo al revés</li>
                      <li>✓ Lavar a máquina con agua fría (máx. 30°C)</li>
                      <li>✓ Utilizar detergentes líquidos neutros</li>
                      <li>✓ Colgar al aire libre, sin luz solar directa</li>
                    </ul>
                  </div>
                  
                  <div className="border border-red-500/10 bg-red-500/5 p-6 rounded-xl">
                    <p className="text-sm font-display font-black uppercase tracking-wider text-red-400 mb-4">Evitar Estrictamente</p>
                    <ul className="space-y-3.5 text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wide">
                      <li>✗ Nunca usar blanqueadores ni lejía</li>
                      <li>✗ Nunca usar secadora de aire caliente</li>
                      <li>✗ Nunca planchar directamente los estampados</li>
                      <li>✗ Evitar suavizantes en exceso (debilitan la goma)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== SECCIÓN DE RESEÑAS Y VALORACIONES INTERACTIVAS ESTILO NIKE/ADIDAS ===== */}
        <section className="mt-16 space-y-8">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-2xl font-display font-black uppercase tracking-wide text-white flex items-center gap-2">
              <Star className="text-[#22c55e] fill-[#22c55e]" size={22} /> Reseñas y Valoraciones
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
              Lo que opinan otros miembros oficiales del Club Andrew.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            
            {/* Panel Izquierdo: Promedio y Formulario */}
            <div className="space-y-6">
              <div className="glass-panel border border-white/10 p-6 text-center space-y-3 rounded-2xl">
                <p className="text-5xl font-display font-black text-[#22c55e] glow-text-green">4.9</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} className="fill-[#22c55e] text-[#22c55e]" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Promedio de {reviews.length} Reseñas</p>
              </div>

              {/* Formulario para escribir Reseña */}
              <div className="glass-panel border border-white/10 p-6 space-y-4 rounded-2xl bg-white/[0.01]">
                <h3 className="font-display font-black text-xs sm:text-sm uppercase text-white tracking-wider">Escribe una reseña</h3>
                
                {reviewSubmitMessage && (
                  <p className={`p-3 text-[11px] font-bold uppercase tracking-wider border rounded-lg ${
                    reviewSubmitMessage.includes('✓') ? 'border-[#22c55e]/20 bg-[#22c55e]/5 text-[#22c55e]' : 'border-red-500/20 bg-red-500/5 text-red-400'
                  }`}>
                    {reviewSubmitMessage}
                  </p>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Tu Nombre</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ej: Claudio Pizarro"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Puntuación (Estrellas)</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e] rounded-lg cursor-pointer font-bold uppercase tracking-wider"
                    >
                      <option value={5}>5 Estrellas (Excelente)</option>
                      <option value={4}>4 Estrellas (Muy Bueno)</option>
                      <option value={3}>3 Estrellas (Regular)</option>
                      <option value={2}>2 Estrellas (Malo)</option>
                      <option value={1}>1 Estrella (Pésimo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Tu Comentario</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Me pareció una camiseta excelente..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#22c55e] rounded-lg resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-[#22c55e] text-black hover:text-black py-3 text-2xs sm:text-xs font-display font-black uppercase tracking-wider transition-colors cursor-pointer rounded-xl glow-green-sm"
                  >
                    Publicar Reseña
                  </button>
                </form>
              </div>
            </div>

            {/* Lista de Reseñas */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-white/5 bg-white/[0.01] p-6 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-display font-black text-sm text-white uppercase">{rev.author}</h4>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            className={s <= rev.rating ? "fill-[#22c55e] text-[#22c55e]" : "text-gray-600"} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed mt-3">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN DE PRODUCTOS RECOMENDADOS (WOW VALUE EXTRA / NIKE RECOMMENDATIONS) ===== */}
        <section className="mt-20 space-y-8 border-t border-white/5 pt-16">
          <div>
            <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.15em] mb-2 glow-text-green">
              <Star size={12} className="fill-[#22c55e]" /> TE PODRÍA INTERESAR
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-white leading-none">
              Recomendados para ti
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => {
                  window.location.hash = `producto/${rec.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group border border-white/5 bg-[#0d0d0d] rounded-2xl overflow-hidden hover:border-[#22c55e]/20 transition-all duration-300 cursor-pointer shadow-md flex flex-col justify-between"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-2xl">
                  <img src={rec.image} alt={rec.equipo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">{rec.liga}</p>
                  <h4 className="font-display font-black text-base text-white uppercase group-hover:text-[#22c55e] transition-colors leading-none">{rec.equipo}</h4>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-display font-black text-sm text-white">S/ {rec.precio.toFixed(2)}</span>
                    <span className="text-[9px] font-bold text-[#22c55e] bg-[#22c55e]/5 px-2 py-0.5 rounded-full border border-[#22c55e]/10">VER DETALLE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== INTERACTIVE SIZE CHART MODAL (WOW VALUE ADDED) ===== */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay oscuro de fondo */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
            onClick={() => setSizeChartOpen(false)}
          />
          
          {/* Contenido del Modal */}
          <div className="relative glass-panel-dark border border-white/10 w-full max-w-lg p-6 sm:p-8 text-white shadow-2xl animate-scale-in rounded-2xl">
            {/* Botón cerrar */}
            <button 
              onClick={() => setSizeChartOpen(false)}
              className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 p-1.5 transition-colors cursor-pointer text-gray-400 hover:text-white rounded-lg"
            >
              <X size={18} />
            </button>

            {/* Encabezado */}
            <div className="mb-6 flex items-center gap-2">
              <Ruler className="text-[#22c55e] glow-text-green animate-pulse" size={20} />
              <div>
                <h3 className="font-display font-black text-lg uppercase leading-none">Guía de Tallas</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">MEDIDAS OFICIALES EN CENTÍMETROS (CM)</p>
              </div>
            </div>

            {/* Tabla de Medidas */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-extrabold uppercase tracking-wider bg-white/[0.01]">
                    <th className="py-3 px-4">TALLA</th>
                    <th className="py-3 px-4">PECHO (ANCHO)</th>
                    <th className="py-3 px-4">LARGO (ALTO)</th>
                    <th className="py-3 px-4">ESTATURA RECOM.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-display font-black text-[#22c55e]">S</td>
                    <td className="py-3.5 px-4 font-semibold">48 - 50 cm</td>
                    <td className="py-3.5 px-4 font-semibold">68 - 70 cm</td>
                    <td className="py-3.5 px-4 font-semibold">1.60 - 1.70 m</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-display font-black text-[#22c55e]">M</td>
                    <td className="py-3.5 px-4 font-semibold">50 - 52 cm</td>
                    <td className="py-3.5 px-4 font-semibold">70 - 72 cm</td>
                    <td className="py-3.5 px-4 font-semibold">1.70 - 1.78 m</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-display font-black text-[#22c55e]">L</td>
                    <td className="py-3.5 px-4 font-semibold">52 - 54 cm</td>
                    <td className="py-3.5 px-4 font-semibold">72 - 74 cm</td>
                    <td className="py-3.5 px-4 font-semibold">1.78 - 1.85 m</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-display font-black text-[#22c55e]">XL</td>
                    <td className="py-3.5 px-4 font-semibold">54 - 56 cm</td>
                    <td className="py-3.5 px-4 font-semibold">74 - 76 cm</td>
                    <td className="py-3.5 px-4 font-semibold">1.85 - 1.95 m</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Nota aclaratoria */}
            <div className="mt-6 border border-white/5 bg-[#22c55e]/5 p-4 rounded-xl text-2xs text-gray-300 leading-normal">
              <span className="text-[#22c55e] font-bold">NOTA PRO:</span> Las camisetas en **Versión Jugador (Slim Fit / Corte Atlético)** son entalladas al cuerpo. Si prefieres un ajuste más holgado para el uso diario, te sugerimos comprar una talla adicional a tu medida estándar de Versión Fan.
            </div>

            <button
              onClick={() => setSizeChartOpen(false)}
              className="mt-6 w-full border border-white/10 hover:border-[#22c55e]/50 bg-white/5 hover:bg-[#22c55e]/5 py-3 text-xs font-display font-black uppercase tracking-wider text-white hover:text-[#22c55e] transition-all cursor-pointer text-center rounded-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
