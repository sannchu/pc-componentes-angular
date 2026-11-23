import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaApiService } from '../../../../_shared_/controllers/services/tienda-api.service';
import type { Categoria } from '../../../../_shared_/models/Categoria';
import { DropDownSubcategorias } from './DropDownSubcategorias/drop-down-subcategorias';

@Component({
  selector: 'app-panel-subcategorias',
  standalone: true,
  imports: [DropDownSubcategorias],
  templateUrl: './panel-subcategorias.html',
  styleUrl: './panel-subcategorias.css',
})
export class PanelSubcategorias implements OnChanges {
  @Input() categoriaPadre: Categoria | null = null;
  @Output() readonly cerrarPanel = new EventEmitter<void>();
  @Output() readonly categoriaElegida = new EventEmitter<void>();

  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly categoriaAbierta = signal<string | null>(null);
  private readonly tiendaApi = inject(TiendaApiService);
  private readonly router = inject(Router);
  private solicitud = 0;

  ngOnChanges(): void {
    const pathCat = this.categoriaPadre?.pathCat;
    this.categoriaAbierta.set(null);
    if (!pathCat) {
      this.categorias.set([]);
      return;
    }
    void this.cargarSubcategorias(pathCat);
  }

  private async cargarSubcategorias(pathCat: string): Promise<void> {
    const solicitudActual = ++this.solicitud;
    this.cargando.set(true);
    this.error.set('');
    try {
      const categorias = await this.tiendaApi.getCategorias(pathCat);
      if (solicitudActual === this.solicitud) this.categorias.set(categorias);
    } catch (error) {
      if (solicitudActual === this.solicitud) {
        this.error.set(error instanceof Error ? error.message : 'No se pudieron cargar las subcategorías.');
        this.categorias.set([]);
      }
    } finally {
      if (solicitudActual === this.solicitud) this.cargando.set(false);
    }
  }

  alternarCategoria(categoria: Categoria): void {
    this.categoriaAbierta.update((idActual) => idActual === categoria._id ? null : categoria._id);
  }

  async mostrarProductos(pathCat: string): Promise<void> {
    await this.router.navigate(['/Productos'], { queryParams: { pathCat } });
    this.categoriaElegida.emit();
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Layout\Header\OffCanvasCategorias\PanelSubcategorias\PanelSubcategorias.jsx
// import './PanelSubcategorias.css'
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router';
// //import useCategorias from './PanelSubcategorias.Hook.js'
// import useCategorias from '../../../../../../customHooks/Categorias.Hook.js'
// import DropDownSubcategorias from './DropDownSubcategorias/DropDownSubcategorias.jsx'
//
//
//
// function PanelSubcategorias({ categoriaPadre, onClose }) {
//     const navigate = useNavigate();
//     
//     //const { categorias, cargando, error } = useCategorias(categoriaPadre?.pathCat)
//     const { categorias:categorias2orden}=useCategorias(categoriaPadre?.pathCat)
//
//     const [subcategoriaAbierta, setSubcategoriaAbierta] = useState(null)
//
//     return (
//         <aside className={`panel-subcategorias ${categoriaPadre ? 'abierto' : ''}`}
//                aria-hidden={!categoriaPadre}>
//             {categoriaPadre && (
//                 <>
//                     <div className="panel-subcategorias-header">
//                         <h5>{categoriaPadre.nombre}</h5>
//                         <button type="button"
//                                 className="btn-close"
//                                 aria-label="Cerrar subcategorias"
//                                 onClick={onClose} />
//                     </div>
//                     <hr />
//                     <div className="panel-subcategorias-body">
//                         {/* {cargando && <p className="text-muted">Cargando subcategorias...</p>}
//                         {error && <p className="text-danger">Error: {error}</p>}
//                         {!cargando && !error && categorias.length === 0 && (
//                             <p className="text-muted">No hay subcategorias</p>
//                         )} */}
//                         { categorias2orden.length === 0 && (
//                             <p className="text-muted">No hay subcategorias</p>
//                         )}
//                         
//                         {/* {!cargando && !error && categorias.length > 0 && ( */}
//                         { categorias2orden.length > 0 && (
//                             <ul className="list-unstyled m-0">
//                                 {categorias2orden.map(subcategoria => (
//                                     <DropDownSubcategorias
//                                         key={subcategoria._id}
//                                         subcategoria={subcategoria}
//                                         abierta={subcategoriaAbierta?._id === subcategoria._id}
//                                         onClick={
//                                             () => {
//                                                     setSubcategoriaAbierta(actual => (actual?._id === subcategoria._id ? null : subcategoria));
//                                                     navigate(`/Productos?pathCat=${subcategoria.pathCat}`);
//                                             }
//                                         }
//                                     />
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 </>
//             )}
//         </aside>
//     )
// }
//
//
//
// export default PanelSubcategorias
//


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Layout\Header\OffCanvasCategorias\PanelSubcategorias\PanelSubcategorias.Hook.js
// import { useEffect, useState } from 'react'
//
// const API_CATEGORIAS = 'http://localhost:3000/api/Tienda/Categorias'
//
// export default function useCategorias(pathCat) {
//     const [categorias, setCategorias] = useState([])
//     const [cargando, setCargando] = useState(false)
//     const [error, setError] = useState(null)
//
//     useEffect(() => {
//         if (!pathCat) {
//             return
//         }
//
//         const controller = new AbortController()
//
//         async function cargarCategorias() {
//             setCargando(true)
//             setError(null)
//
//             try {
//                 const response = await fetch(
//                     `${API_CATEGORIAS}?pathCat=${encodeURIComponent(pathCat)}`,
//                     { signal: controller.signal }
//                 )
//                 const respuesta = await response.json()
//
//                 if (!response.ok || respuesta.codigo !== 0) {
//                     throw new Error(respuesta.mensaje || 'No se pudieron cargar las categorias')
//                 }
//
//                 setCategorias(respuesta.datos?.categorias ?? [])
//             } catch (errorCarga) {
//                 if (errorCarga.name !== 'AbortError') {
//                     console.error('Error al obtener las subcategorias:', errorCarga)
//                     setError(errorCarga.message)
//                     setCategorias([])
//                 }
//             } finally {
//                 if (!controller.signal.aborted) setCargando(false)
//             }
//         }
//
//         cargarCategorias()
//         return () => controller.abort()
//     }, [pathCat])
//
//     return { categorias, cargando, error }
// }
