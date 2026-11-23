import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { TiendaApiService } from '../../../../_shared_/controllers/services/tienda-api.service';
import type { Categoria } from '../../../../_shared_/models/Categoria';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  templateUrl: './lista-categorias.html',
  styleUrl: './lista-categorias.css',
})
export class ListaCategorias implements OnChanges {
  @Input() pathCat = 'principales';
  @Input() categoriaActiva: Categoria | null = null;
  @Output() readonly categoriaElegida = new EventEmitter<Categoria>();

  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  private readonly tiendaApi = inject(TiendaApiService);

  ngOnChanges(): void {
    void this.cargarCategorias();
  }

  private async cargarCategorias(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.categorias.set(await this.tiendaApi.getCategorias(this.pathCat));
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudieron cargar las categorías.');
      this.categorias.set([]);
    } finally {
      this.cargando.set(false);
    }
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: customHooks\Categorias.Hook.js
// import { useState, useEffect } from 'react';
//
// export default function useCategorias(pathCat='principales'){
//
//     const [ categorias, setCategorias ] = useState([]);
//
//     useEffect(
//         ()=>{
//             async function fetchCategorias(){
//                 try{
//                     const petCats=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${pathCat}`);
//                     const {codigo, mensaje, datos}=await petCats.json();
//
//                     if (codigo !==0) throw new Error(mensaje);
//
//                     setCategorias( datos.categorias );
//                 }
//                 catch(error){
//                     console.log(`error al recuperar categorias: ${error}`);
//                     setCategorias([]);
//                 }
//             }
//             fetchCategorias();
//         },
//         [pathCat]
//     )
//     return { categorias }; //<---- igual que poner: return { categorias: categorias };
//
// }


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Layout\Header\OffCanvasCategorias\ListaCategorias\ListaCategorias.jsx
// import './ListaCategorias.css';
// import { useState, useEffect } from 'react';
// import useCategorias from '../../../../../../customHooks/Categorias.Hook.js';
//
// function ListaCategorias({ pathCat='principales', onCategoriaSeleccionada, categoriaActiva }) {
//
//     const {categorias} = useCategorias(pathCat);
//     console.log('ListaCategorias.jsx: categorias recuperadas del hook useCategorias: ', categorias);
//
//     // const [categorias, setCategorias] = useState([]);
//
//     // useEffect(
//     //     ()=>{
//     //         async function fetchCategorias(){
//     //             try{
//     //                 const response=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${pathCat}`);
//     //                 const bodyRespone=await response.json();
//     //                 const { codigo, mensaje, datos }=bodyRespone;
//
//     //                 if (codigo !==0) throw new Error(mensaje);
//
//     //                 setCategorias(datos.categorias);
//
//     //             }catch(error){
//     //                 console.error('Error al obtener las categorias: ', error)
//     //                 setCategorias([]);
//     //             }
//     //         }
//     //         fetchCategorias();
//     //     }
//     //     ,[pathCat]
//     // )
//
//     return (
//         <ul className="list-group list-group-flush">
//             {categorias.map((categoria) => (
//                 <li key={categoria._id}
//                     className={`list-group-item ${categoriaActiva && categoriaActiva._id === categoria._id ? 'active' : ''}`}
//                     onClick={() => onCategoriaSeleccionada(categoria)}
//                     style={{ cursor: 'pointer' }}
//                 >
//                     <div className="d-flex flex-row justify-content-between align-items-center">
//                         <div>
//                             {categoria.icon && <img src={categoria.icon}
//                                                     alt={categoria.nombre}
//                                                     className="me-2"
//                                                     style={{ width: '20px', height: '20px' }} />}
//                             {categoria.nombre}
//                         </div>
//                         <i className="fa-solid fa-chevron-right"></i>
//                     </div>
//
//                 </li>
//             ))}
//         </ul>
//     );
// }
//
// export default ListaCategorias;
