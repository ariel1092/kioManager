import { createContext, useContext, useState, ReactNode } from 'react';
import type { Venta } from '../types';

interface VentaContextType {
  ventaCompletada: Venta | null;
  mostrarModal: boolean;
  setVentaCompletada: (venta: Venta | null) => void;
  cerrarModal: () => void;
}

const VentaContext = createContext<VentaContextType | undefined>(undefined);

export function VentaProvider({ children }: { children: ReactNode }) {
  const [ventaCompletada, setVentaCompletada] = useState<Venta | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSetVentaCompletada = (venta: Venta | null) => {
    setVentaCompletada(venta);
    setMostrarModal(venta !== null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    // Limpiar la venta después de un pequeño delay para la animación
    setTimeout(() => {
      setVentaCompletada(null);
    }, 300);
  };

  return (
    <VentaContext.Provider
      value={{
        ventaCompletada,
        mostrarModal,
        setVentaCompletada: handleSetVentaCompletada,
        cerrarModal,
      }}
    >
      {children}
    </VentaContext.Provider>
  );
}

export function useVenta() {
  const context = useContext(VentaContext);
  if (context === undefined) {
    throw new Error('useVenta debe ser usado dentro de VentaProvider');
  }
  return context;
}



