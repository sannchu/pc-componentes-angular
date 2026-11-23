import { Routes } from '@angular/router';
import { LoginRegistro } from '../modulos/zonaCliente/auth/views/login-registro/login-registro';
import { FormPadre } from '../modulos/zonaCliente/comunicacion/form-padre/form-padre';
import { Layout } from '../modulos/zonaTienda/Layout/layout';
import { Home } from '../modulos/zonaTienda/home/home';
import { ProductosCat } from '../modulos/zonaTienda/productos/productos-cat';
import { DetallesProducto } from '../modulos/zonaTienda/detallesProducto/detalles-producto';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'Productos', component: ProductosCat },
      { path: 'DetallesProducto/:idProducto', component: DetallesProducto },
    ],
  },
  { path: 'Cliente/LoginRegistro', component: LoginRegistro },
  { path: 'login', redirectTo: 'Cliente/LoginRegistro' },
  { path: 'comunicacion', component: FormPadre },
  { path: '**', redirectTo: '' },
];
