import React, { useState } from 'react';
import {
  X,
  Upload,
  ImageIcon,
  Plus,
  Trash2,
  Star,
  Tag,
  Package,
  Sparkles,
  Link2,
  Minus,
  CheckCircle2
} from 'lucide-react';

/**
 * ProductFormModal:
 * Modal profesional de 2 columnas para dar de alta nuevas camisetas o modificar existentes.
 * Columna izquierda: Galería visual de fotos con soporte para múltiples imágenes y portada.
 * Columna derecha: Datos generales, precios, descripción y control interactivo de tallas y stock.
 */
export default function ProductFormModal({
  isOpen,
  onClose,
  isEditMode = false,
  productoData,
  setProductoData,
  onSubmit,
  fileInputRef,
  onSubirImagen,
  subiendoImg = false
}) {
  const [urlManual, setUrlManual] = useState('');
  const [mostrarInputUrl, setMostrarInputUrl] = useState(false);

  if (!isOpen || !productoData) return null;

  // Obtener galería actual de imágenes válidas
  const galeriaActual = Array.isArray(productoData.galeria) && productoData.galeria.length > 0
    ? productoData.galeria.filter(Boolean)
    : (productoData.imagen && productoData.imagen !== '/brand/logo_andrew_v2.webp' ? [productoData.imagen] : []);

  const fotoPortada = galeriaActual[0] || null;

  const handleAgregarUrlManual = () => {
    const limpia = urlManual.trim();
    if (!limpia) return;
    const nuevaGaleria = [...galeriaActual, limpia];
    setProductoData({
      ...productoData,
      imagen: nuevaGaleria[0],
      galeria: nuevaGaleria
    });
    setUrlManual('');
    setMostrarInputUrl(false);
  };

  const handleEliminarFotoGaleria = (indexAEliminar) => {
    const nuevaGaleria = galeriaActual.filter((_, idx) => idx !== indexAEliminar);
    setProductoData({
      ...productoData,
      imagen: nuevaGaleria[0] || '',
      galeria: nuevaGaleria
    });
  };

  const handleMarcarFotoPrincipal = (indexPrincipal) => {
    if (indexPrincipal === 0 || !galeriaActual[indexPrincipal]) return;
    const seleccionada = galeriaActual[indexPrincipal];
    const resto = galeriaActual.filter((_, idx) => idx !== indexPrincipal);
    const nuevaGaleria = [seleccionada, ...resto];
    setProductoData({
      ...productoData,
      imagen: seleccionada,
      galeria: nuevaGaleria
    });
  };

  const actualizarStockTalla = (talla, nuevaCant) => {
    const cantValidada = Math.max(0, parseInt(nuevaCant) || 0);
    const baseTallas = {
      S: productoData.stockPorTalla?.S ?? Math.floor((productoData.stock || 0) / 4),
      M: productoData.stockPorTalla?.M ?? Math.floor((productoData.stock || 0) / 4),
      L: productoData.stockPorTalla?.L ?? Math.floor((productoData.stock || 0) / 4),
      XL: productoData.stockPorTalla?.XL ?? Math.floor((productoData.stock || 0) / 4)
    };
    const nuevoStockPorTalla = {
      ...baseTallas,
      [talla]: cantValidada
    };
    const sumaTotal = Object.values(nuevoStockPorTalla).reduce((acc, v) => acc + (parseInt(v) || 0), 0);
    setProductoData({
      ...productoData,
      stockPorTalla: nuevoStockPorTalla,
      stock: sumaTotal,
      inStock: sumaTotal > 0
    });
  };

  const stockTotalCalculado = productoData.stockPorTalla
    ? Object.values(productoData.stockPorTalla).reduce((acc, v) => acc + (parseInt(v) || 0), 0)
    : (productoData.stock || 0);

  const ahorroCalculado =
    productoData.precioAntes && parseFloat(productoData.precioAntes) > (parseFloat(productoData.precio) || 0)
      ? (parseFloat(productoData.precioAntes) - (parseFloat(productoData.precio) || 0)).toFixed(0)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-overlay-backdrop backdrop-blur-md">
      <div className="bg-surface-card border border-stroke rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-colors">

        {/* 1. CABECERA FIJA DEL MODAL */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-stroke bg-surface-sub/50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-andrew-primary/15 border border-andrew-primary/35 text-andrew-primary flex items-center justify-center shrink-0">
              <Package size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="bg-andrew-primary text-black font-['Montserrat',sans-serif] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                  {isEditMode ? 'MODO EDICIÓN' : 'NUEVO PRODUCTO'}
                </span>
                <span className="text-[11px] font-bold text-txt-muted hidden sm:inline">
                  Catálogo Oficial Andrew
                </span>
              </div>
              <h3 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase text-txt-main truncate mt-0.5">
                {isEditMode ? `Editar: ${productoData.nombre}` : 'Publicar Nueva Camiseta'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-surface-card hover:bg-red-500/15 hover:text-red-500 hover:border-red-500/30 text-txt-muted border border-stroke flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. CUERPO DEL FORMULARIO EN 2 COLUMNAS (SCROLLABLE) */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* COLUMNA IZQUIERDA (5 cols): GALERÍA Y FOTOS DE LA PRENDA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface-sub border border-stroke rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-txt-main tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-andrew-primary" />
                    <span>FOTOS DE LA PRENDA</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-andrew-primary/15 text-andrew-primary">
                    {galeriaActual.length} {galeriaActual.length === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>

                {/* Input oculto con selección múltiple */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={onSubirImagen}
                  className="hidden"
                />

                {/* Visor grande de portada o Zona de Subida si está vacío */}
                {fotoPortada ? (
                  <div className="relative rounded-2xl bg-surface-card border border-stroke p-3 h-52 flex items-center justify-center overflow-hidden group">
                    <img
                      src={fotoPortada}
                      alt="Foto de portada"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-andrew-primary text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <Star size={10} fill="currentColor" /> Portada Principal
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEliminarFotoGaleria(0)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-surface-card/90 hover:bg-red-500 text-red-500 hover:text-white border border-stroke flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                      title="Quitar esta foto"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={subiendoImg}
                    className="w-full h-52 rounded-2xl border-2 border-dashed border-andrew-primary/40 hover:border-andrew-primary bg-surface-card hover:bg-andrew-primary/5 p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-andrew-primary/15 text-andrew-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <div className="space-y-1">
                      <span className="block font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main">
                        {subiendoImg ? 'SUBIENDO FOTOS...' : 'HAZ CLIC PARA SUBIR FOTOS'}
                      </span>
                      <span className="block text-[11px] text-txt-muted">
                        Puedes elegir <strong className="text-andrew-primary">1 o varias imágenes</strong> a la vez desde tu PC o celular
                      </span>
                    </div>
                  </button>
                )}

                {/* Tira de miniaturas cuando ya hay fotos */}
                {galeriaActual.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-txt-muted uppercase">
                      Galería ({galeriaActual.length}) · Clic en una miniatura para hacerla portada:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {galeriaActual.map((imgUrl, idx) => {
                        const esPrincipal = idx === 0;
                        return (
                          <div
                            key={`${idx}-${imgUrl.slice(0, 20)}`}
                            onClick={() => !esPrincipal && handleMarcarFotoPrincipal(idx)}
                            className={`relative rounded-xl bg-surface-card border p-1.5 h-16 flex items-center justify-center overflow-hidden transition-all ${
                              esPrincipal
                                ? 'border-andrew-primary ring-2 ring-andrew-primary/25'
                                : 'border-stroke hover:border-andrew-primary cursor-pointer opacity-80 hover:opacity-100'
                            }`}
                            title={esPrincipal ? 'Foto de portada actual' : 'Clic para usar como portada'}
                          >
                            <img
                              src={imgUrl}
                              alt={`Miniatura ${idx + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />
                            {esPrincipal && (
                              <span className="absolute bottom-1 left-1 bg-andrew-primary text-black text-[8px] font-black px-1 rounded">
                                1°
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEliminarFotoGaleria(idx);
                              }}
                              className="absolute top-1 right-1 w-4 h-4 rounded bg-surface-card/90 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Eliminar foto"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}

                      {/* Botón rápido para agregar más fotos */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={subiendoImg}
                        className="h-16 rounded-xl border border-dashed border-andrew-primary/50 hover:border-andrew-primary bg-andrew-primary/5 hover:bg-andrew-primary/15 text-andrew-primary flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
                        title="Subir más fotos desde tu dispositivo"
                      >
                        <Plus size={16} />
                        <span className="text-[9px] font-black uppercase">Subir más</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Botones secundarios de carga (Subir archivo / Pegar enlace URL) */}
                <div className="pt-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={subiendoImg}
                      className="flex-1 py-2 px-3 rounded-xl bg-surface-card hover:bg-input-bg border border-stroke text-txt-main font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload size={13} className="text-andrew-primary" />
                      <span>{subiendoImg ? 'Cargando...' : 'Subir desde equipo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMostrarInputUrl(!mostrarInputUrl)}
                      className={`py-2 px-3 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        mostrarInputUrl
                          ? 'bg-andrew-primary/15 border-andrew-primary/40 text-andrew-primary'
                          : 'bg-surface-card hover:bg-input-bg border-stroke text-txt-muted hover:text-txt-main'
                      }`}
                    >
                      <Link2 size={13} />
                      <span>Por enlace URL</span>
                    </button>
                  </div>

                  {mostrarInputUrl && (
                    <div className="flex items-center gap-1.5 pt-1 animate-fade-in">
                      <input
                        type="text"
                        value={urlManual}
                        onChange={(e) => setUrlManual(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAgregarUrlManual();
                          }
                        }}
                        placeholder="https://ejemplo.com/camiseta.webp"
                        className="w-full bg-surface-card border border-stroke rounded-xl px-3 py-2 text-[11px] text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAgregarUrlManual}
                        className="px-3 py-2 rounded-xl bg-andrew-primary text-black font-black text-[11px] shrink-0 cursor-pointer hover:bg-[#1fa75d]"
                      >
                        Añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (7 cols): DATOS DEL PRODUCTO, PRECIOS Y TALLAS */}
            <div className="lg:col-span-7 space-y-4">

              {/* BLOQUE 1: INFORMACIÓN PRINCIPAL */}
              <div className="bg-surface-sub border border-stroke rounded-2xl p-4 space-y-3.5">
                <span className="text-[11px] font-black uppercase text-txt-main tracking-wider flex items-center gap-1.5">
                  <Tag size={14} className="text-andrew-primary" />
                  <span>1. DATOS DE LA CAMISETA</span>
                </span>

                {/* Nombre */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                    NOMBRE DEL MODELO / EQUIPO *
                  </label>
                  <input
                    type="text"
                    required
                    value={productoData.nombre}
                    onChange={(e) => setProductoData({ ...productoData, nombre: e.target.value.toUpperCase() })}
                    placeholder="EJ: REAL MADRID LOCAL 2025/26"
                    className="w-full bg-surface-card border border-stroke rounded-xl px-3.5 py-2.5 text-xs font-bold text-txt-main placeholder:text-txt-muted/50 uppercase outline-none focus:border-andrew-primary transition-colors"
                  />
                </div>

                {/* Categoría y Etiqueta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                      CATEGORÍA DEL CATÁLOGO:
                    </label>
                    <select
                      value={productoData.categoria}
                      onChange={(e) => {
                        const val = e.target.value;
                        const lower = val.toLowerCase();
                        const catId = lower.includes('short')
                          ? 'shorts'
                          : lower.includes('retro')
                          ? 'retro'
                          : lower.includes('liga')
                          ? 'la-liga'
                          : lower.includes('premier')
                          ? 'premier-league'
                          : 'selecciones';
                        setProductoData({ ...productoData, categoria: val, categoriaId: catId });
                      }}
                      className="w-full bg-surface-card border border-stroke rounded-xl px-3 py-2.5 text-xs font-bold text-txt-main outline-none focus:border-andrew-primary transition-colors cursor-pointer"
                    >
                      <option value="SELECCIONES" className="bg-surface-card text-txt-main">SELECCIONES NACIONALES</option>
                      <option value="RETRO / CLÁSICOS" className="bg-surface-card text-txt-main">RETRO / CLÁSICOS</option>
                      <option value="LA LIGA" className="bg-surface-card text-txt-main">LA LIGA ESPAÑOLA</option>
                      <option value="PREMIER LEAGUE" className="bg-surface-card text-txt-main">PREMIER LEAGUE</option>
                      <option value="SHORTS & BERMUDAS" className="bg-surface-card text-txt-main">SHORTS & BERMUDAS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                      INSIGNIA / ETIQUETA ESPECIAL:
                    </label>
                    <input
                      type="text"
                      value={productoData.tag || ''}
                      onChange={(e) => setProductoData({ ...productoData, tag: e.target.value.toUpperCase() })}
                      placeholder="EJ: NOVEDAD, RETRO, MUNDIAL"
                      className="w-full bg-surface-card border border-stroke rounded-xl px-3 py-2.5 text-xs font-bold text-txt-main uppercase outline-none focus:border-andrew-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-0.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                      PRECIO VENTA (S/) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-black text-andrew-primary">S/</span>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={productoData.precio}
                        onChange={(e) => setProductoData({ ...productoData, precio: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-surface-card border border-stroke rounded-xl pl-8 pr-3 py-2.5 text-xs font-black text-txt-main outline-none focus:border-andrew-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                      PRECIO ANTES (OPCIONAL):
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-txt-muted">S/</span>
                      <input
                        type="number"
                        step="0.5"
                        value={productoData.precioAntes ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductoData({
                            ...productoData,
                            precioAntes: val === '' ? null : (parseFloat(val) || null),
                            oferta: val !== '' && parseFloat(val) > (parseFloat(productoData.precio) || 0)
                          });
                        }}
                        placeholder="120"
                        className="w-full bg-surface-card border border-stroke rounded-xl pl-8 pr-3 py-2.5 text-xs font-semibold text-txt-main outline-none focus:border-andrew-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
                    <div className="h-[38px] rounded-xl bg-surface-card border border-stroke px-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-txt-muted uppercase">Descuento:</span>
                      {ahorroCalculado ? (
                        <span className="text-[11px] font-black text-andrew-primary bg-andrew-primary/15 px-2 py-0.5 rounded-md">
                          Ahorra S/ {ahorroCalculado}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-txt-muted">Sin oferta</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-txt-muted mb-1">
                    DESCRIPCIÓN BREVE DE LA PRENDA:
                  </label>
                  <textarea
                    rows={2}
                    value={productoData.descripcion || ''}
                    onChange={(e) => setProductoData({ ...productoData, descripcion: e.target.value })}
                    placeholder="Detalles de la tela, versión jugador, escudos termo-sellados..."
                    className="w-full bg-surface-card border border-stroke rounded-xl px-3.5 py-2 text-xs text-txt-main outline-none focus:border-andrew-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* BLOQUE 2: INVENTARIO FÍSICO POR TALLAS */}
              <div className="bg-surface-sub border border-stroke rounded-2xl p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase text-txt-main tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-andrew-primary" />
                    <span>2. STOCK FÍSICO DISPONIBLE POR TALLA</span>
                  </span>

                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${
                      stockTotalCalculado > 0
                        ? 'text-andrew-primary bg-andrew-primary/15 border-andrew-primary/30'
                        : 'text-red-500 bg-red-500/15 border-red-500/30'
                    }`}
                  >
                    {stockTotalCalculado > 0 ? `Total: ${stockTotalCalculado} unidades` : 'Sin stock (Agotado)'}
                  </span>
                </div>

                {/* Controles de Stock por Talla con botones - y + */}
                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-txt-muted uppercase">
                    <span>UNIDADES FÍSICAS DISPONIBLES EN CADA TALLA:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Usa - / + o escribe el número</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['S', 'M', 'L', 'XL'].map((talla) => {
                      const stockActual = productoData.stockPorTalla?.[talla] !== undefined
                        ? parseInt(productoData.stockPorTalla[talla]) || 0
                        : Math.floor((productoData.stock || 0) / 4);
                      const sinStock = stockActual <= 0;

                      return (
                        <div
                          key={talla}
                          className={`rounded-xl border p-2.5 text-center space-y-2 transition-colors ${
                            sinStock
                              ? 'bg-surface-card border-stroke opacity-75'
                              : 'bg-surface-card border-emerald-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between px-1">
                            <span className="font-['Montserrat',sans-serif] font-black text-xs text-txt-main">
                              TALLA {talla}
                            </span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                sinStock
                                  ? 'bg-red-500/15 text-red-500'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {sinStock ? 'Agotado' : `${stockActual} u.`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1 bg-input-bg border border-stroke rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => actualizarStockTalla(talla, stockActual - 1)}
                              className="w-7 h-7 rounded-md bg-surface-card hover:bg-red-500/15 hover:text-red-500 text-txt-main flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title={`Restar 1 a talla ${talla}`}
                            >
                              <Minus size={12} />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={stockActual}
                              onChange={(e) => actualizarStockTalla(talla, e.target.value)}
                              className="w-full bg-transparent text-center font-black text-xs text-txt-main outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => actualizarStockTalla(talla, stockActual + 1)}
                              className="w-7 h-7 rounded-md bg-surface-card hover:bg-andrew-primary hover:text-black text-txt-main flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title={`Sumar 1 a talla ${talla}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. BARRA INFERIOR DE ACCIONES */}
          <div className="mt-6 pt-4 border-t border-stroke flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-surface-sub hover:bg-input-bg border border-stroke text-txt-muted hover:text-txt-main text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {!isEditMode && (
                <button
                  type="button"
                  onClick={(e) => onSubmit(e, true)}
                  className="px-4 py-3 rounded-xl bg-andrew-primary/15 hover:bg-andrew-primary/25 border border-andrew-primary/40 text-andrew-primary text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Guarda esta camiseta y limpia el formulario para subir otra seguida"
                >
                  <Plus size={15} />
                  <span>Guardar y Subir Otra</span>
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#22c55e]/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>{isEditMode ? 'Guardar Cambios' : 'Publicar en Catálogo'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
