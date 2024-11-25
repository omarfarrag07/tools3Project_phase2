import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const configWithHttpClient = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Ensure existing providers are included
    provideHttpClient(withFetch()), // Add HttpClient with fetch support
  ],
};

bootstrapApplication(AppComponent, configWithHttpClient) // Pass the updated configuration
  .catch(err => console.error(err));
