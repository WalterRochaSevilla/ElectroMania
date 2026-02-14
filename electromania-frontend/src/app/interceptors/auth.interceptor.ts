import { HttpInterceptorFn } from '@angular/common/http';
import { API } from '../constants';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(API.BASE)) {
        const cloned = req.clone({
            withCredentials: true
        });
        return next(cloned);
    }
    return next(req);
};