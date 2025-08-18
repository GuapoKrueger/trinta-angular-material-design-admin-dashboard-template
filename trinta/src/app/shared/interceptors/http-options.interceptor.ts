import { HttpInterceptorFn } from '@angular/common/http';
import { httpOptions } from '../utils/endpoint.util';

export const HttpOptionsInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Don't set Content-Type for FormData - let browser set it automatically with boundary
  const isFormData = req.body instanceof FormData;
  
  const clonedRequest = req.clone({
    headers: isFormData ? req.headers : req.headers.set('Content-Type', httpOptions.headers.get('Content-Type') || 'application/json'),
    withCredentials: httpOptions.withCredentials
  });

  return next(clonedRequest);
};
