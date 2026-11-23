import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Categoria } from '../../models/Categoria';
import type { Producto } from '../../models/Producto';

interface ApiResponse<T> {
  codigo: number;
  mensaje?: string;
  datos?: T;
}

@Injectable({ providedIn: 'root' })
export class TiendaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/Tienda';
  private readonly productosEnCache = new Map<string, Producto>();

  async getCategorias(pathCat = 'principales'): Promise<Categoria[]> {
    const respuesta = await firstValueFrom(
      this.http.get<ApiResponse<{ categorias?: Categoria[] }>>(
        `${this.baseUrl}/Categorias?pathCat=${encodeURIComponent(pathCat)}`,
      ),
    );
    if (respuesta.codigo !== 0) throw new Error(respuesta.mensaje || 'No se pudieron cargar las categorías.');
    return respuesta.datos?.categorias ?? [];
  }

  async getProductos(pathCat: string): Promise<Producto[]> {
    const respuesta = await firstValueFrom(
      this.http.get<ApiResponse<{ productos?: Producto[] }>>(
        `${this.baseUrl}/Productos?pathCat=${encodeURIComponent(pathCat)}`,
      ),
    );
    if (respuesta.codigo !== 0) throw new Error(respuesta.mensaje || 'No se pudieron cargar los productos.');
    return respuesta.datos?.productos ?? [];
  }

  async getProducto(idProducto: string): Promise<Producto | null> {
    const url = `${this.baseUrl}/Producto/${encodeURIComponent(idProducto)}`;
    const productoEnCache = this.productosEnCache.get(url);
    if (productoEnCache) return productoEnCache;

    const respuesta = await firstValueFrom(this.http.get<ApiResponse<{ producto?: Producto | null }>>(url));
    if (respuesta.codigo !== 0) throw new Error(respuesta.mensaje || 'No se pudo cargar el producto.');
    const producto = respuesta.datos?.producto ?? null;
    if (producto) this.productosEnCache.set(url, producto);
    return producto;
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: middlewares\UrlInCache.Middleware.js
//     import { getProductoApiUrl,
//             productosCacheContext,
//             productoCacheHitContext} from './routerContext.js';
//
//     export async function UrlInCacheMiddleware({context, params}, next){
//         const urlProducto = getProductoApiUrl(params.idProducto) //<---- url de la api para obtener producto con ese id
//         const productosCache = context.get(productosCacheContext) //<---- obtener del contexto de react-router el objeto Map que contiene los productos cacheados
//         const cacheHit = productosCache.has(urlProducto) //<----- comprobamos si para esa url hay un producto ya guardado
//
//         context.set(productoCacheHitContext, cacheHit)
//         console.log(
//             cacheHit
//             ? '===> el producto ya estaba en la cache, el loader no hara fetch:'
//             : '===> el producto no estaba en la cache, el loader hara fetch:',
//             urlProducto,
//         )
//
//         return next()
//     }


// Código React original conservado como referencia y totalmente comentado.
// Origen: middlewares\routerContext.js
// import { createContext } from 'react-router'
//
// export const productosCacheContext = createContext(new Map())
// export const productoCacheHitContext = createContext(false)
//
// export function getProductoApiUrl(idProducto) {
//   return `http://localhost:3000/api/Tienda/Producto/${encodeURIComponent(idProducto)}`
// }
//
