import { Injectable, signal } from '@angular/core';

export interface ModalData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    isOpen = signal(false);
    data = signal<ModalData>({ title: '', message: '' });

    private resolveRef: ((value: boolean) => void) | null = null;

    confirm(data: ModalData): Promise<boolean> {
        this.data.set(data);
        this.isOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this.resolveRef = resolve;
        });
    }

    close(result: boolean) {
        this.isOpen.set(false);
        if (this.resolveRef) {
            this.resolveRef(result);
            this.resolveRef = null;
        }
    }
}
