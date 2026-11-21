import { useState } from 'react';
import { SITE_CONFIG } from '../../../config/siteConfig';

export function usePedirAMedida() {
  const [formData, setFormData] = useState({
    equipoSeleccion: '',
    temporadaAno: '',
    version: 'jugador', // 'jugador' | 'fan'
    manga: 'corta', // 'corta' | 'larga'
    tallas: 'M',
    cantidadPrendas: 1,
    conDorsal: true,
    nombreDorsal: '',
    numeroDorsal: '',
    parche: 'ninguno', // 'champions' | 'liga' | 'mundial' | 'ninguno'
    nombreCompleto: '',
    telefono: '',
    detallesAdicionales: ''
  });

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.equipoSeleccion.trim()) {
      alert('Por favor ingresa o selecciona el equipo o selección que deseas encargar.');
      return;
    }

    const versionLabel = {
      jugador: '🔥 Versión Jugador',
      fan: '👕 Versión Fan'
    }[formData.version] || formData.version.toUpperCase();

    const parcheLabel = {
      champions: '🏆 Parche Champions League',
      liga: '⚽ Parche Liga Local (LaLiga / Premier / Serie A / Liga 1)',
      mundial: '🌎 Parche Mundial / Copa América / Euro',
      ninguno: '🚫 Sin parches adicionales'
    }[formData.parche] || formData.parche;

    const dorsalTexto = (formData.nombreDorsal?.trim() || formData.numeroDorsal?.trim())
      ? `${formData.nombreDorsal?.trim() || 'SIN NOMBRE'} #${formData.numeroDorsal?.trim() || 'S/N'} (Tipografía oficial)`
      : 'Sin estampado en espalda';

    const mensaje = encodeURIComponent(
      `¡Hola Andrew Camisetas! ⚽ Quiero realizar un *ENCARGO DIRECTO A MEDIDA*:\n\n` +
      `👕 *Equipo / Selección:* ${formData.equipoSeleccion}\n` +
      `📅 *Temporada / Modelo:* ${formData.temporadaAno || 'Por confirmar'}\n` +
      `⚡ *Versión:* ${versionLabel} (${formData.manga === 'larga' ? 'Manga Larga' : 'Manga Corta'})\n` +
      `📏 *Talla:* ${formData.tallas} (Cantidad: ${formData.cantidadPrendas})\n` +
      `🔢 *Dorsal Oficial:* ${dorsalTexto}\n` +
      `🎖️ *Parches:* ${parcheLabel}\n` +
      (formData.nombreCompleto ? `👤 *Cliente:* ${formData.nombreCompleto}\n` : '') +
      (formData.telefono ? `📱 *WhatsApp:* ${formData.telefono}\n` : '') +
      (formData.detallesAdicionales ? `📝 *Notas:* ${formData.detallesAdicionales}\n` : '') +
      `\n💰 *Modalidad:* Abono de reserva S/ ${SITE_CONFIG.reserva.montoMinimoAdelanto}.00`
    );

    window.open(`${SITE_CONFIG.whatsapp.link}?text=${mensaje}`, '_blank', 'noopener,noreferrer');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
  };

  return {
    formData,
    setFormData,
    enviado,
    handleSubmit
  };
}
