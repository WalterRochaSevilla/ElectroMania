import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export const COMMON_TEST_PROVIDERS = [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideTranslateService({
        fallbackLang: 'es'
    }),
    {
        provide: ActivatedRoute,
        useValue: {
            snapshot: {
                paramMap: convertToParamMap({ id: '1' })
            },
            paramMap: of(convertToParamMap({ id: '1' }))
        }
    }
];