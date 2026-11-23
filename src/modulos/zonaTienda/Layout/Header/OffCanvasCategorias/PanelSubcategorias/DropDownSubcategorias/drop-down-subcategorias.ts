import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { TiendaApiService } from '../../../../../_shared_/controllers/services/tienda-api.service';
import type { Categoria } from '../../../../../_shared_/models/Categoria';

@Component({
  selector: 'app-dropdown-subcategorias',
  standalone: true,
  templateUrl: './drop-down-subcategorias.html',
  styleUrl: './drop-down-subcategorias.css',
})
export class DropDownSubcategorias implements OnChanges {
  @Input({ required: true }) subcategoria!: Categoria;
  @Input() abierta = false;
  @Output() readonly alternar = new EventEmitter<void>();
  @Output() readonly seleccionar = new EventEmitter<string>();

  readonly subcategorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  private readonly tiendaApi = inject(TiendaApiService);
  private solicitud = 0;

  ngOnChanges(): void {
    if (!this.abierta) {
      this.solicitud++;
      this.subcategorias.set([]);
      this.cargando.set(false);
      return;
    }
    void this.cargarSubcategorias();
  }

  private async cargarSubcategorias(): Promise<void> {
    const solicitudActual = ++this.solicitud;
    this.cargando.set(true);
    try {
      const categorias = await this.tiendaApi.getCategorias(this.subcategoria.pathCat);
      if (solicitudActual === this.solicitud) this.subcategorias.set(categorias);
    } catch {
      if (solicitudActual === this.solicitud) this.subcategorias.set([]);
    } finally {
      if (solicitudActual === this.solicitud) this.cargando.set(false);
    }
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Layout\Header\OffCanvasCategorias\PanelSubcategorias\DropDownSubcategorias\DropDownSubcategorias.jsx
// //import useCategorias from '../PanelSubcategorias.Hook.js'
// import useCategorias from '../../../../../../../customHooks/Categorias.Hook.js'
//
// export default function DropDownSubcategorias({ subcategoria, abierta, onClick }) {
// //    const { categorias:hijas, cargando, error } = useCategorias( abierta ? subcategoria.pathCat : null);
//     const { categorias:categorias3nivel } = useCategorias( abierta ? subcategoria.pathCat : null);
//
//     return (
//         <li className="panel-subcategorias-grupo">
//             <div className={`panel-subcategorias-item ${abierta ? 'abierto' : ''}`}
//                  role="button"
//                  aria-expanded={abierta}
//                  onClick={onClick}>
//                 <span>{subcategoria.nombre}</span>
//                 <i className="fa-solid fa-chevron-down panel-subcategorias-chevron"></i>
//             </div>
//
//             {/* contenedor que anima su altura de 0 a auto con css grid (ver .css) */}
//             <div className={`panel-tercer-nivel ${abierta ? 'abierto' : ''}`}>
//                 <div className="panel-tercer-nivel-contenido">
//                     <ul className="dropdown-menu show position-static w-100 shadow-sm">
//                         {/* {cargando && <li><span className="dropdown-item-text">Cargando...</span></li>}
//                         {error && <li><span className="dropdown-item-text text-danger">Error: {error}</span></li>}
//                         {!cargando && !error && hijas.length === 0 && <li><span className="dropdown-item-text text-muted">No hay subcategorías</span></li>} */}
//
//                         { categorias3nivel.length === 0 &&
//                                 <li>
//                                     <span className="dropdown-item-text text-muted">
//                                         No hay subcategorías
//                                     </span>
//                                 </li>
//                         }
//
//                         {/* {!cargando && !error && hijas.map(hija => ( */}
//                         {
//                             categorias3nivel.map(
//                                     cat3nivel => (
//                                                     <li key={cat3nivel._id}>
//                                                         <button type="button"
//                                                                 className="dropdown-item"
//                                                                 onClick={() => console.log(`Subcategoria de tercer nivel seleccionada: ${cat3nivel.nombre} (${cat3nivel.pathCat})`)}>
//                                                             {cat3nivel.nombre}
//                                                         </button>
//                                                     </li>
//                                                 )
//                             ) // fin map
//                         }
//                     </ul>
//                 </div>
//             </div>
//         </li>
//     )
// }
