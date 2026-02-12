import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-sobre-nosotros',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './sobre-nosotros.component.html',
    styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent {
    private readonly fallbackImage = 'https://via.placeholder.com/600x400';
    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement | null;
        if (!target || target.src === this.fallbackImage) {
            return;
        }
        target.src = this.fallbackImage;
    }
}