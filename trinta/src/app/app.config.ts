import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptorFn } from './shared/interceptors/auth.interceptor';
import { HttpOptionsInterceptorFn } from './shared/interceptors/http-options.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes), 
        provideClientHydration(), 
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([AuthInterceptorFn, HttpOptionsInterceptorFn])),
    ]
};