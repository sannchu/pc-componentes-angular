import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TiendaApiService } from '../_shared_/controllers/services/tienda-api.service';
import type { Producto } from '../_shared_/models/Producto';
import { MiniProducto } from './MiniProducto/mini-producto';

@Component({
  selector: 'app-productos-cat',
  standalone: true,
  imports: [MiniProducto],
  templateUrl: './productos-cat.html',
  styleUrl: './productos-cat.css',
})
export class ProductosCat {
  readonly productos = signal<Producto[]>([]);
  readonly pathCat = signal<string | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');
  private readonly tiendaApi = inject(TiendaApiService);
  private solicitud = 0;

  constructor(route: ActivatedRoute, destroyRef: DestroyRef) {
    route.queryParamMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((params) => {
      const pathCat = params.get('pathCat');
      this.pathCat.set(pathCat);
      if (!pathCat) {
        this.productos.set([]);
        this.cargando.set(false);
        this.error.set('');
        return;
      }
      void this.cargarProductos(pathCat);
    });
  }


  private async cargarProductos(pathCat: string): Promise<void> {
    const solicitudActual = ++this.solicitud;
    this.cargando.set(true);
    this.error.set('');
    try {
      const productos = await this.tiendaApi.getProductos(pathCat);
      if (solicitudActual === this.solicitud) this.productos.set(productos);
    } catch (error) {
      if (solicitudActual === this.solicitud) {
        this.error.set(error instanceof Error ? error.message : 'No se pudieron cargar los productos.');
        this.productos.set([]);
      }
    } finally {
      if (solicitudActual === this.solicitud) this.cargando.set(false);
    }
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Productos\ProductosPorCategoria.Hook.js
// import { useState, useEffect } from 'react';
//
// const API_PRODUCTOS = 'http://localhost:3000/api/Tienda/Productos'
//
// export default function useProductosPorCategoria(pathCat) {
//     const [productos, setProductos] = useState([]);
//     const [cargando, setCargando] = useState(false);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         if (!pathCat) { return; }
//         async function fetchProductos() {
//             setCargando(true);
//             setError(null);
//
//             const petProductos=await fetch(`${API_PRODUCTOS}?pathCat=${pathCat}`);
//             const respuesta=await petProductos.json();
//
//             if (respuesta.codigo !== 0) throw new Error(`Error al obtener los productos: ${respuesta.mensaje}`);
//
//             setProductos(respuesta.datos?.productos ?? []);
//             setCargando(false);
//         }
//
//         fetchProductos();
//     }, [pathCat]);
//
//    return { productos, cargando, error };
// }


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Productos\ProductosCat.jsx
// import './ProductosCat.css'
// //import { useParams } from 'react-router' //<---- hook de react-router para interceptar segmentos variables en url
// import { useSearchParams } from 'react-router' //<---- hook de react-router para interceptar valores variables por query string en url
// import useProductosPorCategoria from './ProductosPorCategoria.Hook.js'
// import MiniProducto from './MiniProducto/MiniProducto.jsx'
//
// function ProductosCat(){
//     //---- hook para interceptar segmentos variables en URL -----------------
//     // const valorDevueltoPorHookUseParams=useParams() //<--- el hook useParams() de react-router nos permite acceder a los parametros de la url
//     // console.log('valorDevueltoPorHookUseParams: ', valorDevueltoPorHookUseParams) //<--- el hook useParams() de react-router nos permite acceder a los parametros de la url
//     //const { nombreCat } = useParams();
//     
//     //---- hook para interceptar valores variables por query string en URL -----------------
//     // const valorDevueltoPorHookUseSearchParams=useSearchParams() //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
//     // console.log('valorDevueltoPorHookUseSearchParams: ', valorDevueltoPorHookUseSearchParams) //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
//     const [searchParams, setSearchParams] = useSearchParams() //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url    
//     // console.log('valor de 1º posicion array devuelve hook: ', searchParams);
//     // console.log('valor de 2º posicion array devuelve hook: ', setSearchParams);
//     
//     const pathCat = searchParams.get('pathCat') //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
//     const { productos, cargando, error } = useProductosPorCategoria(pathCat);
//
//     if (cargando) {
//         return <div className="d-flex flex-column justify-content-center align-items-center ">Cargando...</div>
//     }
//
//     if (error) {
//         return <div className="d-flex flex-column justify-content-center align-items-center ">Error: {error}</div>
//     }
//
//     return (
//         <div className="d-flex flex-column justify-content-center align-items-center ">
//         {
//             productos.length === 0 ? (
//                 <div className="text-muted">No hay productos en esta categoría</div>
//             ) : (
//                 <div className="productos-cat-grid">
//                     {
//                         productos.map(
//                             producto => (
//                                     <div key={producto._id} className="producto-cat-item">
//                                         <MiniProducto producto={producto} />
//                                     </div>
//                             )
//                         )
//                     }
//                 </div>
//             )
//         }
//         </div>
//     )
// }
//
// export default ProductosCat
