import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  CreditCard,
  Check,
  AlertCircle,
  MessageSquare,
  Minus
} from 'lucide-react';
import { useAdminProducts } from './hooks/useAdminProducts';
import { useAdminOrders } from './hooks/useAdminOrders';
import { useAdminReviews } from './hooks/useAdminReviews';
import DashboardStatsCards from './components/DashboardStatsCards';
import OrdersDataTable from './components/OrdersDataTable';
import ProductFormModal from './components/ProductFormModal';
import ReviewsModerationTable from './components/ReviewsModerationTable';

/**
 * AdminPanelPage:
 * Panel de Control Administrativo rediseñado para máxima claridad, orden visual
 * y edición rápida de tallas, precios y estados de pedidos.
 */
export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'pedidos' | 'reviews'
  const [mensajeExito, setMensajeExito] = useState('');

  const notificar = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // 1. Hook de Productos e Inventario
  const {
    productosFiltrados,
    search,
    setSearch,
    filtroStock,
    setFiltroStock,
    totalProductos,
    enStockCount,
    bajoPedidoCount,
    totalUnidades,
    modalNuevo,
    setModalNuevo,
    productoEditando,
    setProductoEditando,
    productoAEliminar,
    setProductoAEliminar,
    subiendoImg,
    nuevoProducto,
    setNuevoProducto,
    fileInputNuevoRef,
    fileInputEditRef,
    handleToggleStock,
    handleCambioStockPorTalla,
    handleConfirmarEliminar,
    handleSubirImagenNuevo,
    handleSubirImagenEdit,
    handleCrearProducto,
    handleGuardarEdicion
  } = useAdminProducts({ onNotificar: notificar });

  // 2. Hook de Pedidos y Validación
  const {
    pedidos,
    pedidoDetalle,
    setPedidoDetalle,
    pedidosPendientes,
    pedidosConfirmados,
    cargarPedidos,
    handleCambiarEstadoPedido,
    handleEliminarPedido
  } = useAdminOrders({ onNotificar: notificar });

  // 3. Hook de Reseñas y Moderación
  const {
    reviews,
    reviewsPendientesCount,
    cargarReviews,
    handleAprobarReview,
    handleEliminarReview
  } = useAdminReviews({ onNotificar: notificar });

  return (
    <div className="min-h-screen bg-bg-base text-txt-main pt-32 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-10 select-none transition-colors duration-200">
      <div className="max-w-[1620px] mx-auto space-y-6">

        {/* 1. CABECERA EJECUTIVA + PESTAÑAS INTEGRADAS */}
        <div className="bg-surface-card border border-stroke rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-andrew-primary/15 border border-andrew-primary/35 px-3 py-1 rounded-full text-andrew-primary text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>PANEL ADMINISTRADOR ANDREW</span>
              </div>
              <h1 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-txt-main pt-1">
                GESTIÓN DE <span className="text-andrew-primary">TIENDA, STOCK & PEDIDOS</span>
              </h1>
              <p className="text-txt-muted text-xs sm:text-sm">
                Controla las unidades por talla en tiempo real, valida pagos de Yape y Plin, y publica nuevos modelos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('productos');
                  setModalNuevo(true);
                }}
                className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(34,197,94,0.3)] cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} />
                <span>NUEVA CAMISETA</span>
              </button>
            </div>
          </div>

          {/* Barra segmentada de módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-sub p-1.5 rounded-2xl border border-stroke">
            <button
              type="button"
              onClick={() => setActiveTab('productos')}
              className={`font-['Montserrat',sans-serif] text-xs font-black uppercase py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'productos'
                  ? 'bg-andrew-primary text-black shadow-sm'
                  : 'text-txt-muted hover:text-txt-main hover:bg-surface-card'
              }`}
            >
              <Package size={16} />
              <span>1. INVENTARIO DE CAMISETAS ({totalProductos})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pedidos')}
              className={`font-['Montserrat',sans-serif] text-xs font-black uppercase py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'pedidos'
                  ? 'bg-andrew-primary text-black shadow-sm'
                  : 'text-txt-muted hover:text-txt-main hover:bg-surface-card'
              }`}
            >
              <CreditCard size={16} />
              <span>2. PEDIDOS Y PAGOS ({pedidos.length})</span>
              {pedidosPendientes > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'pedidos' ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'
                }`}>
                  {pedidosPendientes} por verificar
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`font-['Montserrat',sans-serif] text-xs font-black uppercase py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'reviews'
                  ? 'bg-andrew-primary text-black shadow-sm'
                  : 'text-txt-muted hover:text-txt-main hover:bg-surface-card'
              }`}
            >
              <MessageSquare size={16} />
              <span>3. RESEÑAS DE CLIENTES ({reviews.length})</span>
              {reviewsPendientesCount > 0 && (
                <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                  {reviewsPendientesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notificación flotante de confirmación */}
        {mensajeExito && (
          <div className="bg-andrew-primary/15 border border-andrew-primary/40 text-andrew-primary p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-md">
            <Check size={16} strokeWidth={3} />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* =====================================================================
            MÓDULO 1: INVENTARIO DE CAMISETAS Y CONTROL DE STOCK POR TALLA
           ===================================================================== */}
        {activeTab === 'productos' && (
          <div className="space-y-5">
            <DashboardStatsCards
              totalProductos={totalProductos}
              enStockCount={enStockCount}
              bajoPedidoCount={bajoPedidoCount}
              totalUnidades={totalUnidades}
            />

            {/* Barra de Búsqueda y Filtros de Disponibilidad */}
            <div className="bg-surface-card border border-stroke rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full sm:w-96">
                <Search size={15} className="absolute left-3.5 top-3 text-txt-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar camiseta por nombre, liga o etiqueta..."
                  className="w-full bg-input-bg border border-stroke rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] text-txt-muted font-extrabold uppercase mr-1">MOSTRAR:</span>
                <button
                  type="button"
                  onClick={() => setFiltroStock('todos')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer border ${
                    filtroStock === 'todos' 
                      ? 'bg-txt-main text-bg-base border-txt-main' 
                      : 'bg-surface-sub text-txt-muted border-stroke hover:text-txt-main'
                  }`}
                >
                  Todos ({totalProductos})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroStock('stock')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer border ${
                    filtroStock === 'stock' 
                      ? 'bg-andrew-primary text-black border-andrew-primary' 
                      : 'bg-surface-sub text-txt-muted border-stroke hover:text-txt-main'
                  }`}
                >
                  En Stock ({enStockCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroStock('pedido')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer border ${
                    filtroStock === 'pedido' 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-surface-sub text-txt-muted border-stroke hover:text-txt-main'
                  }`}
                >
                  Agotados ({bajoPedidoCount})
                </button>
              </div>
            </div>

            {/* Lista de Productos en Tarjetas Horizontales Fáciles de Usar */}
            {productosFiltrados.length === 0 ? (
              <div className="bg-surface-card border border-stroke rounded-2xl text-center py-14 px-4 space-y-3 shadow-sm">
                <Package size={38} className="mx-auto text-txt-muted opacity-60" />
                <h4 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main">
                  No se encontraron camisetas con ese filtro
                </h4>
                <button
                  type="button"
                  onClick={() => setModalNuevo(true)}
                  className="bg-andrew-primary text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Agregar Nueva Camiseta</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {productosFiltrados.map((item) => {
                  const tallasLista = Array.isArray(item.tallas) && item.tallas.length > 0 ? item.tallas : ['S', 'M', 'L', 'XL'];

                  return (
                    <div
                      key={item.id}
                      className="bg-surface-card border border-stroke hover:border-stroke-hover rounded-2xl p-4 sm:p-5 shadow-sm transition-all"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        
                        {/* Columna 1: Imagen + Nombre + Categoría y Precio (4 cols) */}
                        <div className="lg:col-span-4 flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-sub border border-stroke p-2 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={item.imagen} alt={item.nombre} className="max-h-full max-w-full object-contain" />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="bg-surface-sub border border-stroke text-txt-main text-[10px] font-black uppercase px-2 py-0.5 rounded">
                                {item.categoria}
                              </span>
                              {item.tag && (
                                <span className="bg-andrew-primary/15 text-andrew-primary text-[10px] font-black uppercase px-2 py-0.5 rounded">
                                  {item.tag}
                                </span>
                              )}
                            </div>

                            <h3 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main truncate">
                              {item.nombre}
                            </h3>

                            <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
                              <span className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base text-andrew-primary">
                                S/ {Number(item.precio || 89).toFixed(2)}
                              </span>
                              {item.precioAntes && (
                                <span className="text-xs text-txt-muted line-through font-semibold">
                                  S/ {Number(item.precioAntes).toFixed(2)}
                                </span>
                              )}
                              {!item.inStock && item.categoriaId !== 'shorts' && (
                                <span className="text-[11px] text-txt-muted font-bold">
                                  · Short encargo: +S/ {Number(item.precioShort || 35).toFixed(0)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Columna 2: Estado de Inventario (En Stock vs Agotado) (2 cols) */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between gap-2 bg-surface-sub border border-stroke rounded-xl p-3">
                          <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider">
                            ESTADO STOCK:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleStock(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                              item.inStock && (item.stock || 0) > 0
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/25'
                                : 'bg-red-500/15 text-red-500 border-red-500/35 hover:bg-red-500/25'
                            }`}
                            title="Haz clic para activar o poner en 0 el stock"
                          >
                            <span className={`w-2 h-2 rounded-full ${item.inStock && (item.stock || 0) > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span>{item.inStock && (item.stock || 0) > 0 ? `EN STOCK (${item.stock})` : 'AGOTADO (0)'}</span>
                          </button>
                        </div>

                        {/* Columna 3: Control Directo de Stock por Talla (S, M, L, XL) con botones - / + (4 cols) */}
                        <div className="lg:col-span-4">
                          <div className="bg-surface-sub border border-stroke rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-txt-muted">
                              <span>UNIDADES POR TALLA (CLIC EN - / +):</span>
                              <span className="text-andrew-primary">Total: {item.stock || 0} u.</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {tallasLista.map((t) => {
                                const cantTalla = item.stockPorTalla?.[t] !== undefined
                                  ? parseInt(item.stockPorTalla[t])
                                  : Math.floor((item.stock || 0) / tallasLista.length);
                                const agotado = cantTalla <= 0;

                                return (
                                  <div
                                    key={t}
                                    className={`rounded-xl border p-1.5 text-center space-y-1 transition-colors ${
                                      agotado
                                        ? 'bg-surface-card border-red-500/30'
                                        : 'bg-surface-card border-emerald-500/35'
                                    }`}
                                  >
                                    <span className={`text-[11px] font-black block ${
                                      agotado ? 'text-red-500' : 'text-txt-main'
                                    }`}>
                                      {t}
                                    </span>
                                    <div className="flex items-center justify-between gap-0.5 bg-input-bg rounded-lg px-1 py-0.5 border border-stroke">
                                      <button
                                        type="button"
                                        onClick={() => handleCambioStockPorTalla(item.id, t, Math.max(0, cantTalla - 1))}
                                        className="w-5 h-5 rounded hover:bg-surface-card flex items-center justify-center text-txt-muted hover:text-txt-main cursor-pointer"
                                        title={`Restar 1 en talla ${t}`}
                                      >
                                        <Minus size={10} />
                                      </button>
                                      <span className={`text-xs font-black ${agotado ? 'text-red-500' : 'text-andrew-primary'}`}>
                                        {cantTalla}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCambioStockPorTalla(item.id, t, cantTalla + 1)}
                                        className="w-5 h-5 rounded hover:bg-surface-card flex items-center justify-center text-txt-muted hover:text-txt-main cursor-pointer"
                                        title={`Sumar 1 en talla ${t}`}
                                      >
                                        <Plus size={10} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Columna 4: Botones de Acción Claros con Texto (2 cols) */}
                        <div className="lg:col-span-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setProductoEditando({ ...item })}
                            className="flex-1 lg:flex-initial px-3.5 py-2.5 rounded-xl bg-surface-sub hover:bg-andrew-primary hover:text-black text-txt-main border border-stroke font-['Montserrat',sans-serif] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Editar datos, foto o precios de la camiseta"
                          >
                            <Edit3 size={14} />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductoAEliminar(item)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/25 transition-colors cursor-pointer"
                            title="Eliminar camiseta del catálogo"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            MÓDULO 2: GESTOR DE PEDIDOS Y VALIDACIÓN DE PAGOS
           ===================================================================== */}
        {activeTab === 'pedidos' && (
          <OrdersDataTable
            pedidos={pedidos}
            pedidoDetalle={pedidoDetalle}
            setPedidoDetalle={setPedidoDetalle}
            pedidosPendientes={pedidosPendientes}
            pedidosConfirmados={pedidosConfirmados}
            onRecargarPedidos={cargarPedidos}
            onCambiarEstado={handleCambiarEstadoPedido}
            onEliminarPedido={handleEliminarPedido}
          />
        )}

        {/* =====================================================================
            MÓDULO 3: BANDEJA DE MODERACIÓN DE RESEÑAS
           ===================================================================== */}
        {activeTab === 'reviews' && (
          <ReviewsModerationTable
            reviews={reviews}
            onAprobar={handleAprobarReview}
            onEliminar={handleEliminarReview}
            onRecargar={cargarReviews}
          />
        )}

        {/* MODAL 1: NUEVA CAMISETA */}
        <ProductFormModal
          isOpen={modalNuevo}
          onClose={() => setModalNuevo(false)}
          isEditMode={false}
          productoData={nuevoProducto}
          setProductoData={setNuevoProducto}
          onSubmit={handleCrearProducto}
          fileInputRef={fileInputNuevoRef}
          onSubirImagen={handleSubirImagenNuevo}
          subiendoImg={subiendoImg}
        />

        {/* MODAL 2: EDITAR CAMISETA */}
        <ProductFormModal
          isOpen={Boolean(productoEditando)}
          onClose={() => setProductoEditando(null)}
          isEditMode={true}
          productoData={productoEditando}
          setProductoData={setProductoEditando}
          onSubmit={handleGuardarEdicion}
          fileInputRef={fileInputEditRef}
          onSubirImagen={handleSubirImagenEdit}
          subiendoImg={subiendoImg}
        />

        {/* MODAL 3: CONFIRMAR ELIMINACIÓN */}
        {productoAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-md">
            <div className="bg-surface-card border border-red-500/30 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-500/15 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                <AlertCircle size={28} />
              </div>

              <div>
                <h4 className="font-['Montserrat',sans-serif] font-black text-lg uppercase text-txt-main">
                  ¿ELIMINAR PRENDA?
                </h4>
                <p className="text-txt-muted text-xs mt-1">
                  Estás a punto de borrar del catálogo la camiseta <strong className="text-txt-main">"{productoAEliminar.nombre}"</strong>. Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProductoAEliminar(null)}
                  className="w-full py-3 rounded-xl bg-surface-sub hover:bg-surface-sub/80 text-txt-main border border-stroke font-['Montserrat',sans-serif] text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarEliminar}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-['Montserrat',sans-serif] text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  SÍ, ELIMINAR
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
