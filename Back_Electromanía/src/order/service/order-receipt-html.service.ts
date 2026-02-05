// src/orders/service/order-receipt-html.service.ts
import { Injectable } from '@nestjs/common';
import { OrderReceiptModel } from '../models/order-response.model';

@Injectable()
export class OrderReceiptService {
  generateReceiptHtml(orderData: OrderReceiptModel): string {
    const itemsHtml = orderData.orderItems
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Bs. ${Number(item.unit_price).toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Bs. ${Number(item.total).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const paymentStatus = orderData.payment
      ? `
        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; color: #0369a1;">Información de Pago</h3>
          <p style="margin: 5px 0;"><strong>Método:</strong> ${orderData.payment.method.translate}</p>
          <p style="margin: 5px 0;"><strong>Estado:</strong> ${orderData.payment.status.translate}</p>
          <p style="margin: 5px 0;"><strong>Monto:</strong> Bs. ${Number(orderData.payment.amount).toFixed(2)}</p>
        </div>
      `
      : '<p style="color: #dc2626; font-weight: bold;">Pago Pendiente</p>';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo - Orden #${orderData.order_id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Inter', 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #1e40af;
      font-size: 28px;
    }
    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .cart-icon {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>') no-repeat center;
      background-size: contain;
    }
    .doc-icon {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23334155"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>') no-repeat center;
      background-size: contain;
    }
    .user-icon {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23334155"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') no-repeat center;
      background-size: contain;
    }
    .box-icon {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23334155"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>') no-repeat center;
      background-size: contain;
    }
    .order-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-section {
      padding: 15px;
      background: #f8fafc;
      border-radius: 5px;
    }
    .info-section h3 {
      margin: 0 0 10px 0;
      color: #334155;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .info-section p {
      margin: 5px 0;
      color: #64748b;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    th:last-child, td:last-child {
      text-align: right;
    }
    .total-section {
      text-align: right;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    .total-section h2 {
      margin: 0;
      color: #1e40af;
      font-size: 24px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #64748b;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1><span class="icon cart-icon"></span> RECIBO DE COMPRA</h1>
      <p style="margin: 10px 0 0 0; color: #64748b;">Orden #${orderData.order_id}</p>
      <span class="status-badge status-${orderData.status.value.toLowerCase()}">${orderData.status.translate}</span>
    </div>

    <div class="order-info">
      <div class="info-section">
        <h3><span class="icon doc-icon"></span> Información de la Orden</h3>
        <p><strong>Fecha:</strong> ${new Date(orderData.created_at).toLocaleString('es-BO', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })}</p>
        <p><strong>Estado:</strong> ${orderData.status.translate}</p>
      </div>

      <div class="info-section">
        <h3><span class="icon user-icon"></span> Información del Cliente</h3>
        <p><strong>Nombre:</strong> ${orderData.user.name}</p>
        <p><strong>Email:</strong> ${orderData.user.email}</p>
        <p><strong>Teléfono:</strong> ${orderData.user.phone_number}</p>
        <p><strong>NIT/CI:</strong> ${orderData.user.nit_ci}</p>
        <p><strong>Razón Social:</strong> ${orderData.user.social_reason}</p>
      </div>
    </div>

    <h3 style="color: #334155; margin-bottom: 15px; display: flex; align-items: center;">
      <span class="icon box-icon"></span> Detalle de Productos
    </h3>
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align: center;">Cantidad</th>
          <th style="text-align: right;">Precio Unit.</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="total-section">
      <h2>Total: Bs. ${Number(orderData.total).toFixed(2)}</h2>
    </div>

    ${paymentStatus}

    <div class="footer">
      <p>Gracias por su compra</p>
      <p>Este es un recibo generado electrónicamente</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}