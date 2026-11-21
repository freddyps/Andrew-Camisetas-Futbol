import React from 'react';
import { usePedirAMedida } from './hooks/usePedirAMedida';
import PedirAMedidaForm from './components/PedirAMedidaForm';
import PedirAMedidaStepsInfo from './components/PedirAMedidaStepsInfo';

/**
 * PedirAMedidaPage:
 * Contenedor limpio sin cabeceras ni insignias repetidas.
 */
export default function PedirAMedidaPage({ onBackToHome = () => {} }) {
  const { formData, setFormData, enviado, handleSubmit } = usePedirAMedida();

  return (
    <div className="w-full bg-bg-base text-txt-main min-h-screen select-none transition-colors">
      <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-36 sm:pt-40 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* LADO IZQUIERDO: FORMULARIO */}
          <PedirAMedidaForm 
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            enviado={enviado}
            onBackToHome={onBackToHome}
          />

          {/* LADO DERECHO: PROCESO DE RESERVA */}
          <PedirAMedidaStepsInfo formData={formData} />
        </div>
      </div>
    </div>
  );
}
