/**
 * Generador de Tickets de Venta
 * Formato para impresoras térmicas (80mm)
 */

import type { Venta } from '../types';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export interface ConfiguracionTicket {
  nombreKiosco?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  mensajePersonalizado?: string;
}

/**
 * Genera el HTML del ticket de venta
 */
export function generarHTMLTicket(
  venta: Venta,
  config: ConfiguracionTicket = {}
): string {
  const {
    nombreKiosco = 'Kiosco',
    direccion = '',
    telefono = '',
    email = '',
    mensajePersonalizado = 'Gracias por su compra',
  } = config;

  const fecha = format(new Date(venta.fechaVenta), 'dd/MM/yyyy HH:mm', { locale: esLocale });

  // Calcular totales
  const total = venta.total;

  const itemsHTML = venta.items
    .map(
      (item) => `
    <tr>
      <td class="item-nombre">${item.producto?.nombre || 'Producto'}</td>
    </tr>
    <tr>
      <td class="item-detalle">${item.cantidad} × $${item.precioUnitario.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
      <td class="item-total">$${item.subtotal.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Ticket de Venta #${venta.numeroVenta}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: 80mm;
      max-width: 100%;
      padding: 10mm 5mm;
      background: white;
      color: black;
      margin: 0 auto;
    }
    
    @media screen and (max-width: 480px) {
      body {
        padding: 5mm 3mm;
        font-size: 11px;
      }
    }
    
    .ticket {
      width: 100%;
      max-width: 70mm;
    }
    
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    
    .nombre-kiosco {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .info-kiosco {
      font-size: 10px;
      line-height: 1.4;
      color: #333;
    }
    
    .detalle-venta {
      margin: 10px 0;
      font-size: 11px;
    }
    
    .detalle-venta p {
      margin: 3px 0;
    }
    
    .items {
      margin: 15px 0;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      padding: 10px 0;
    }
    
    .items table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .item-nombre {
      font-weight: bold;
      padding: 3px 0;
      font-size: 11px;
    }
    
    .item-detalle {
      font-size: 10px;
      color: #666;
      padding-left: 10px;
    }
    
    .item-total {
      text-align: right;
      font-weight: bold;
      font-size: 11px;
    }
    
    .total {
      margin-top: 10px;
      text-align: right;
      font-size: 14px;
      font-weight: bold;
      border-top: 2px solid #000;
      padding-top: 5px;
    }
    
    .metodo-pago {
      margin: 10px 0;
      font-size: 11px;
      text-align: center;
    }
    
    .mensaje {
      text-align: center;
      margin: 15px 0;
      font-size: 11px;
      font-style: italic;
      padding: 10px;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
    }
    
    .footer {
      text-align: center;
      font-size: 9px;
      color: #666;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #000;
    }
    
    .separador {
      border-top: 1px dashed #000;
      margin: 10px 0;
    }
    
    @media print {
      body {
        padding: 5mm;
      }
      
      .no-print {
        display: none;
      }
      
      @page {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="nombre-kiosco">${nombreKiosco}</div>
      ${direccion ? `<div class="info-kiosco">${direccion}</div>` : ''}
      ${telefono ? `<div class="info-kiosco">Tel: ${telefono}</div>` : ''}
      ${email ? `<div class="info-kiosco">${email}</div>` : ''}
    </div>
    
    <div class="detalle-venta">
      <p><strong>Ticket #${venta.numeroVenta}</strong></p>
      <p>Fecha: ${fecha}</p>
    </div>
    
    <div class="separador"></div>
    
    <div class="items">
      <table>
        ${itemsHTML}
      </table>
    </div>
    
    <div class="total">
      TOTAL: $${total.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </div>
    
    <div class="metodo-pago">
      Método de pago: <strong>${venta.metodoPago.toUpperCase()}</strong>
    </div>
    
    <div class="mensaje">
      ${mensajePersonalizado}
    </div>
    
    <div class="footer">
      <p>Gracias por su preferencia</p>
      <p>${new Date().getFullYear()} - Sistema de Gestión de Kiosco</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Abre el ticket en una nueva ventana para imprimir
 */
export function imprimirTicket(venta: Venta, config: ConfiguracionTicket = {}): void {
  const html = generarHTMLTicket(venta, config);
  const ventana = window.open('', '_blank', 'width=300,height=600');
  
  if (!ventana) {
    alert('Por favor, permite ventanas emergentes para imprimir el ticket');
    return;
  }

  ventana.document.write(html);
  ventana.document.close();
  
  // Esperar a que se cargue el contenido antes de imprimir
  ventana.onload = () => {
    setTimeout(() => {
      ventana.print();
      // Cerrar ventana después de imprimir (opcional)
      // ventana.close();
    }, 250);
  };
}

/**
 * Descarga el ticket como PDF (usando impresión del navegador)
 */
export function descargarTicketPDF(venta: Venta, config: ConfiguracionTicket = {}): void {
  imprimirTicket(venta, config);
}

