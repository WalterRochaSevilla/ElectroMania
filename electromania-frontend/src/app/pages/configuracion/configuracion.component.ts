import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, Language } from '../../services/language.service';
@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './configuracion.component.html',
    styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
    readonly languageService = inject(LanguageService);
    get currentLang(): Language {
        return this.languageService.currentLang();
    }
    get availableLanguages() {
        return this.languageService.availableLanguages;
    }
    onLanguageChange(lang: Language): void {
        this.languageService.setLanguage(lang);
    }
}