import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LoginRegistro } from './modulos/zonaCliente/auth/views/login-registro/login-registro';

bootstrapApplication(LoginRegistro, appConfig)
  .catch((err) => console.error(err));
