import { Injectable } from "@nestjs/common";
import { PdfMaker } from "./pdf-maker.interface";
import * as pdfMake from 'pdfmake';
import { OrderReceiptModel } from "../../../order/models/order-response.model";
import { BillReport } from "./documents/bill-report.document";
import * as path from 'path';

const fonts = {
    Roboto: {
        normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
        bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
        italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf')
    }
}

@Injectable()
export class PdfMakeService implements PdfMaker {
    constructor() {
        pdfMake.addFonts(fonts);
    }

    async generatePDF(orderData: OrderReceiptModel): Promise<Buffer> {
        const definition = new BillReport().getDefinition(orderData);
        const buffer = await pdfMake.createPdf(definition).getBuffer();
        return buffer;
    }
}