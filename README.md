# PcComponentes Angular

Migración del frontend React del workspace `pc-componentes` a Angular. La tienda mantiene zonas separadas para cliente y catálogo; las pantallas Angular están en `src/modulos`.

## Iniciar el proyecto

1. Inicia el backend Node del workspace React en `http://localhost:3000`.
2. Desde esta carpeta ejecuta:

   ```bash
   npm install
   npm start
   ```

3. Abre `http://localhost:4200`.

La API de tienda y cliente se configura en `src/modulos/zonaTienda/_shared_/controllers/services/tienda-api.service.ts` y `src/modulos/zonaCliente/auth/controllers/cliente-auth.service.ts`.

## Rutas

- `/`: inicio dentro del layout de tienda.
- `/Productos?pathCat=...`: productos de la categoría indicada.
- `/DetallesProducto/:idProducto`: detalle y galería del producto.
- `/Cliente/LoginRegistro`: acceso, registro y autenticación con Google.
- `/comunicacion`: ejemplo Angular de comunicación entre componentes.

El carrito y la sesión se comparten mediante `StoreGlobal`. Los productos consultados se conservan en una caché en memoria.

## Código React conservado

El JSX y JavaScript originales se han conservado al final de los archivos TypeScript equivalentes, línea a línea y comentados para que no se ejecuten ni interfieran con la compilación Angular.

## Compilar

```bash
npm run build
```
