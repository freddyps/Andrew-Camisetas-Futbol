import { useState, useEffect, useRef } from 'react';
import { getPedidos, getPedidosSync, actualizarEstadoPedido, eliminarPedido } from '../../../services/orderService';

/**
 * Reproduce un sonido sutil de notificación (doble campana suave) usando Web Audio API
 * sin depender de archivos MP3 externos.
 */
function reproducirSonidoPedido() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    [587.33, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.3);
    });
  } catch {
    // El navegador puede bloquear audio si no hubo interacción previa del usuario
  }
}

/**
 * Custom Hook useAdminOrders:
 * Centraliza la carga de pedidos, alertas visuales + sonoras de nuevos pedidos pendientes,
 * actualización de estados de pago y eliminación de registros.
 */
export function useAdminOrders({ onNotificar = () => {} }) {
  const [pedidos, setPedidos] = useState(() => getPedidosSync());
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const prevPendientesRef = useRef(
    getPedidosSync().filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length
  );

  const cargarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const data = await getPedidos();
      const lista = data || [];
      setPedidos(lista);

      const nuevosPendientes = lista.filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length;
      if (nuevosPendientes > prevPendientesRef.current) {
        reproducirSonidoPedido();
        onNotificar(`🔔 ¡Nuevo pedido recibido! Tienes ${nuevosPendientes} por verificar.`);
      }
      prevPendientesRef.current = nuevosPendientes;
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    cargarPedidos();

    const handleUpdate = () => {
      const lista = getPedidosSync();
      setPedidos(lista);
      const nuevosPendientes = lista.filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length;
      if (nuevosPendientes > prevPendientesRef.current) {
        reproducirSonidoPedido();
        onNotificar(`🔔 ¡Nuevo pedido recibido! Tienes ${nuevosPendientes} por verificar.`);
      }
      prevPendientesRef.current = nuevosPendientes;
    };
    window.addEventListener('andrew_pedidos_updated', handleUpdate);
    return () => window.removeEventListener('andrew_pedidos_updated', handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCambiarEstadoPedido = async (id, nuevoEstado) => {
    const actualizados = await actualizarEstadoPedido(id, nuevoEstado);
    setPedidos(actualizados);
    prevPendientesRef.current = actualizados.filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length;
    onNotificar(`Estado de pedido actualizado a: ${nuevoEstado}`);
    if (pedidoDetalle && pedidoDetalle.id === id) {
      setPedidoDetalle((prev) => ({ ...prev, estado: nuevoEstado }));
    }
  };

  const handleEliminarPedido = async (id) => {
    const actualizados = await eliminarPedido(id);
    setPedidos(actualizados);
    prevPendientesRef.current = actualizados.filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length;
    onNotificar('Pedido eliminado de la lista.');
    if (pedidoDetalle && pedidoDetalle.id === id) {
      setPedidoDetalle(null);
    }
  };

  // Contadores analíticos
  const pedidosPendientes = pedidos.filter((p) => p.estado === 'PENDIENTE_VERIFICACION').length;
  const pedidosConfirmados = pedidos.filter(
    (p) => p.estado === 'ADELANTO_VERIFICADO' || p.estado === 'PAGO_COMPLETO_CONFIRMADO'
  ).length;

  return {
    pedidos,
    pedidoDetalle,
    setPedidoDetalle,
    loadingPedidos,
    pedidosPendientes,
    pedidosConfirmados,
    cargarPedidos,
    handleCambiarEstadoPedido,
    handleEliminarPedido
  };
}
