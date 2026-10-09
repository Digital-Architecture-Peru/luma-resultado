import { HttpInterceptorFn } from '@angular/common/http';

/** Cliente ficticio (H2): en producción lo reemplazaría la identidad del IdP. */
export const DEMO_CUSTOMER_ID = 'CLI-001';

export const customerInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith('/api/')
    ? next(req.clone({ setHeaders: { 'X-Customer-Id': DEMO_CUSTOMER_ID } }))
    : next(req);
