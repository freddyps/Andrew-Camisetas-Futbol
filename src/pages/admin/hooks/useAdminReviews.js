import { useState, useEffect } from 'react';
import { getAllReviewsAdmin, aprobarReview, eliminarReview } from '../../../services/reviewService';

/**
 * Custom Hook useAdminReviews:
 * Centraliza la carga y moderación de opiniones de clientes
 * (aprobación para prueba social o eliminación).
 */
export function useAdminReviews({ onNotificar = () => {} }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewsAdmin();
      setReviews(data || []);
    } catch (err) {
      console.error('Error cargando reviews en admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReviews();

    const handleUpdate = () => cargarReviews();
    window.addEventListener('andrew_reviews_updated', handleUpdate);
    return () => window.removeEventListener('andrew_reviews_updated', handleUpdate);
  }, []);

  const handleAprobarReview = async (id) => {
    const actualizadas = await aprobarReview(id);
    setReviews(actualizadas);
    onNotificar('¡Reseña aprobada con éxito! Ya es visible en la tienda.');
  };

  const handleEliminarReview = async (id) => {
    const actualizadas = await eliminarReview(id);
    setReviews(actualizadas);
    onNotificar('Reseña eliminada del sistema.');
  };

  const reviewsPendientesCount = reviews.filter(r => !r.aprobado).length;

  return {
    reviews,
    loading,
    reviewsPendientesCount,
    cargarReviews,
    handleAprobarReview,
    handleEliminarReview
  };
}
