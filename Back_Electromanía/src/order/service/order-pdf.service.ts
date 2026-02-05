import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { OrderReceiptService } from './order-receipt-html.service';
import { OrderReceiptModel } from '../models/order-response.model';

@Injectable()
export class OrderPdfService {
  private readonly logger = new Logger(OrderPdfService.name);

  constructor(private readonly receiptService: OrderReceiptService) {}

  async generatePdf(orderData: OrderReceiptModel): Promise<Buffer> {
    const html = this.receiptService.generateReceiptHtml(orderData);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error('Error generating PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}