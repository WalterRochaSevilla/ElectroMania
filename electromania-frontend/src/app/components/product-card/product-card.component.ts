import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../models';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {

    @Input() product!: ProductCard;
    @Input() isOffer = false;
    @Input() isFeatured = false;

    @Output() addToCart = new EventEmitter<ProductCard>();
    @Output() cardClick = new EventEmitter<ProductCard>();

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
