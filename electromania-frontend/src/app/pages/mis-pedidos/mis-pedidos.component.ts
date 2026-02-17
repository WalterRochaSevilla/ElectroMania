import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { ModalService } from '../../services/modal.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Order } from '../../models';
import { ToastService } from '../../services/toast.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
    selector: 'app-mis-pedidos',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, ConfirmationModalComponent],
    templateUrl: './mis-pedidos.component.html',
    styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent implements OnInit, OnDestroy {
    private orderService = inject(OrderService);
    private translate = inject(TranslateService);
    private modalService = inject(ModalService);
    private toast = inject(ToastService);
    private sanitizer = inject(DomSanitizer);
    private receiptObjectUrl: string | null = null;
    private resizeHandler = this.onResize.bind(this);
    orders = signal<Order[]>([]);
    loading = signal(true);
    receiptModalOpen = signal(false);
    receiptLoading = signal(false);
    receiptUrl = signal<SafeResourceUrl | null>(null);
    currentReceiptOrderId = signal<number | null>(null);
    async ngOnInit() {
        await this.loadOrders();
        window.addEventListener('resize', this.resizeHandler);
    }
    ngOnDestroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        this.unlockBodyScroll();
        this.releaseReceiptObjectUrl();
    }
    private onResize(): void {
        if (this.receiptModalOpen() && window.matchMedia('(max-width: 900px)').matches) {
            this.closeReceiptModal();
        }
    }
    async loadOrders() {
        this.loading.set(true);
        try {
            this.orders.set(await this.orderService.getMyOrders());
        }
        catch {
            console.error('Error loading orders');
        }
        finally {
            this.loading.set(false);
        }
    }
    getStatusLabel(status: string): string {
        return this.orderService.getStatusLabel(status);
    }
    getStatusClass(status: string): string {
        return this.orderService.getStatusClass(status);
    }
    formatDate(dateString?: string): string {
        if (!dateString) {
            return this.translate.instant('COMMON.NOT_AVAILABLE');
        }
        const parsedDate = new Date(dateString);
        if (Number.isNaN(parsedDate.getTime())) {
            return this.translate.instant('COMMON.NOT_AVAILABLE');
        }
        return parsedDate.toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    formatCurrency(amount: number): string {
        return `${this.translate.instant('CART.BS')} ${amount.toFixed(2)}`;
    }
    async viewReceipt(orderId: number): Promise<void> {
        this.receiptLoading.set(true);
        try {
            let html = await this.orderService.getReceipt(orderId);
            const faviconLink = `<link rel="icon" type="image/png" href="${window.location.origin}/favicon.png">`;
            const hideScrollbar = '<style>html,body{scrollbar-width:none;-ms-overflow-style:none}::-webkit-scrollbar{display:none}</style>';
            html = html.replace(/<head[^>]*>/i, '$&' + faviconLink + hideScrollbar);
            this.releaseReceiptObjectUrl();
            this.receiptObjectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));

            const isMobileView = window.matchMedia('(max-width: 900px)').matches;
            if (isMobileView) {
                window.open(this.receiptObjectUrl, '_blank', 'noopener,noreferrer');
                this.currentReceiptOrderId.set(null);
                setTimeout(() => this.releaseReceiptObjectUrl(), 60_000);
                return;
            }

            this.receiptUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.receiptObjectUrl));
            this.currentReceiptOrderId.set(orderId);
            this.lockBodyScroll();
            this.receiptModalOpen.set(true);
        }
        catch {
            this.toast.error(this.translate.instant('MY_ORDERS.RECEIPT_ERROR'));
        }
        finally {
            this.receiptLoading.set(false);
        }
    }
    closeReceiptModal(): void {
        this.receiptModalOpen.set(false);
        this.unlockBodyScroll();
        this.currentReceiptOrderId.set(null);
        this.releaseReceiptObjectUrl();
        this.receiptUrl.set(null);
    }
    private releaseReceiptObjectUrl(): void {
        if (this.receiptObjectUrl) {
            URL.revokeObjectURL(this.receiptObjectUrl);
            this.receiptObjectUrl = null;
        }
    }
    private lockBodyScroll(): void {
        document.body.classList.add('no-scroll');
        document.documentElement.style.overflow = 'hidden';
    }
    private unlockBodyScroll(): void {
        document.body.classList.remove('no-scroll');
        document.documentElement.style.overflow = '';
    }
    canViewReceipt(status: string): boolean {
        return status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED';
    }
    async cancelOrder(orderId: number): Promise<void> {
        const confirmed = await this.modalService.confirm({
            title: this.translate.instant('MY_ORDERS.CANCEL_TITLE'),
            message: this.translate.instant('MY_ORDERS.CONFIRM_CANCEL'),
            confirmText: this.translate.instant('MY_ORDERS.CANCEL'),
            cancelText: this.translate.instant('COMMON.CANCEL'),
            type: 'danger'
        });
        if (!confirmed) {
            return;
        }
        try {
            await this.orderService.cancelOrder(orderId);
            await this.loadOrders();
        }
        catch {
            console.error('Error canceling order');
        }
    }
}