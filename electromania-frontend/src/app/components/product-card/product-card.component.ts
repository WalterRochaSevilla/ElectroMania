import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

    @Input() product: any;
    @Input() isOffer = false;
    @Input() isFeatured = false;

    @Output() addToCart = new EventEmitter<any>();
    @Output() cardClick = new EventEmitter<any>();

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

    handleImageError(event: any) {
        event.target.src = 'https://via.placeholder.com/300?text=No+Image';
    }
}
