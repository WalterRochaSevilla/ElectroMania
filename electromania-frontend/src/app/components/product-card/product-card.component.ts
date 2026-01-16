import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/productos.service';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

    @Input() product!: Product;
    @Input() isOffer = false;
    @Input() isFeatured = false;

    @Output() addToCart = new EventEmitter<Product>();
    @Output() cardClick = new EventEmitter<Product>();

    onAddToCart(event: Event) {
        event.stopPropagation(); // Prevent card click
        this.addToCart.emit(this.product);
    }

    onCardClick() {
        this.cardClick.emit(this.product);
    }

    getDiscountPrice(price: number): number {
        return price * 0.85; // Example 15% discount for offers
    }

    handleImageError(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'https://via.placeholder.com/300?text=No+Image';
    }
}
