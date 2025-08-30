import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide global error handling
    provideBrowserGlobalErrorListeners(),
    // Provide zone change detection
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Provide router
    provideRouter(routes),
    // Provide HTTP client
    provideHttpClient()
  ]
};
