import { HttpInterceptorFn } from '@angular/common/http';
import { httpOptions } from '../utils/endpoint.util';

export const HttpOptionsInterceptorFn: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    headers: req.headers.set('Content-Type', httpOptions.headers.get('Content-Type') || 'application/json'),
    withCredentials: httpOptions.withCredentials
  });

  return next(clonedRequest);
};
