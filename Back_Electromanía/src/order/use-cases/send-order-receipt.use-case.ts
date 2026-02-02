// src/orders/use-cases/send-order-receipt.usecase.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { OrderPdfService } from '../service/order-pdf.service';
import { OrderReceiptService } from '../service/order-receipt-html.service';
import { MailService } from '../../mail/service/mail.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/service/prisma.service';

@Injectable()
export class SendOrderReceiptUseCase {
  logger = new Logger('SendOrderReceiptUseCase')
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly pdfService: OrderPdfService,
    private readonly receiptService: OrderReceiptService,
    private readonly mailService: MailService,
  ) {}

  async execute(orderId: number, sendPdf: boolean = true,tx?:Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    const order = await this.orderService.getOrderForXML(orderId, prisma);
    this.logger.log("order:",order);
    const userEmail = order.user.email;
    if (sendPdf) {
      // Generar PDF y enviar
      const pdfBuffer = await this.pdfService.generatePdf(order);
      const htmlContent = this.receiptService.generateReceiptHtml(order);
      
      await this.mailService.sendOrderReceipt(
        userEmail,
        order.order_id,
        pdfBuffer,
        htmlContent,
      );
    } else {
      // Enviar solo HTML
      const htmlContent = this.receiptService.generateReceiptHtml(order);
      await this.mailService.sendOrderReceiptHtml(
        userEmail,
        order.order_id,
        htmlContent,
      );
    }

    return {
      message: 'Receipt sent successfully',
      orderId: order.order_id,
      sentTo: userEmail,
    };
  }
}