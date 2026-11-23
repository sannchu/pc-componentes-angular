import { Injectable, computed, signal } from '@angular/core';
import type Cliente from '../../../zonaCliente/_shared_/models/Cliente';

export interface ProductoCarrito {
  _id: string;
  nombre: string;
  precio: number;
  imagenProducto?: string;
  imagenes?: string[];
  descuentoPrecio?: number;
}

export interface ItemCarrito {
  producto: ProductoCarrito;
  cantidad: number;
}

export interface Carrito {
  itemsPedido: ItemCarrito[];
  subtotal: number;
  gastosEnvio: number;
  iva: number;
  total: number;
}

export type AccionCarrito = 'agregar' | 'eliminar' | 'actualizar';

const CARRITO_VACIO: Carrito = {
  itemsPedido: [],
  subtotal: 0,
  gastosEnvio: 0,
  iva: 0,
  total: 0,
};
const PORCENTAJE_IVA = 0.12;

@Injectable({ providedIn: 'root' })
export class StoreGlobal {
  readonly datosCliente = signal<Cliente | null>(null);
  readonly accessToken = signal('');
  readonly refreshToken = signal('');
  readonly sesionIniciada = computed(() => Boolean(this.accessToken()));
  readonly carrito = signal<Carrito>({ ...CARRITO_VACIO });
  readonly cantidadArticulos = computed(() =>
    this.carrito().itemsPedido.reduce((total, item) => total + item.cantidad, 0),
  );

  setDatosCliente(cliente: Cliente | null): void {
    this.datosCliente.set(cliente);
  }

  iniciarSesion(cliente: Cliente, accessToken: string, refreshToken = ''): void {
    this.datosCliente.set(cliente);
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
  }

  cerrarSesion(): void {
    this.datosCliente.set(null);
    this.accessToken.set('');
    this.refreshToken.set('');
  }

  setCarrito(accion: AccionCarrito, itemPedido: ItemCarrito): void {
    const actual = this.carrito();
    const items = actual.itemsPedido.map((item) => ({ ...item }));
    const idProducto = itemPedido.producto?._id;
    const posicion = items.findIndex((item) => item.producto._id === idProducto);

    switch (accion) {
      case 'agregar': {
        if (!itemPedido.producto) return;
        const cantidad = Math.max(1, Number(itemPedido.cantidad) || 1);
        if (posicion >= 0) items[posicion] = { ...items[posicion], cantidad: items[posicion].cantidad + cantidad };
        else items.push({ ...itemPedido, cantidad });
        break;
      }
      case 'eliminar':
        if (posicion < 0) return;
        items.splice(posicion, 1);
        break;
      case 'actualizar':
        if (posicion < 0) return;
        if (itemPedido.cantidad <= 0) items.splice(posicion, 1);
        else items[posicion] = { ...items[posicion], cantidad: Number(itemPedido.cantidad) };
        break;
    }

    const subtotal = items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
    const iva = subtotal * PORCENTAJE_IVA;
    this.carrito.set({
      itemsPedido: items,
      subtotal,
      gastosEnvio: actual.gastosEnvio,
      iva,
      total: subtotal + actual.gastosEnvio + iva,
    });
  }

  resetCarrito(): void {
    this.carrito.set({ ...CARRITO_VACIO });
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: stateGlobal\zustandStateSlices.js
// import { create } from 'zustand';
//
// import { ClienteSlice } from './zustand-slices/ClienteSlice';
// import { CarritoSlice } from './zustand-slices/CarritoSlice';
// import { SesionSlice } from './zustand-slices/SesionSlice';
//
// const useStore=create(
//     (get,set,store)=>{
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 1º paramtero funcion set():_',set.toString());
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 2º paramtero funcion get():_',get.toString());
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 3º paramtero objeto store:_',store);
//         return {
//             ...ClienteSlice(get, set, store),
//             ...CarritoSlice(get, set, store),
//             ...SesionSlice(get, set, store)
//         } //<---- objeto global del store al cual tienen acceso todos los componentes 
//         //usando el hook useStore() q devuelve este objeto global del store
//     }
//
// )
//
// export default useStore;


// Código React original conservado como referencia y totalmente comentado.
// Origen: stateGlobal\zustandStateMonoLitico.js
// /*
//     modulo de codigo para definir el alamacen global de variables para todos los componenetes
// del proyecto, usando la libreria de ZUSTAND
//
// Se crea un STORE (almacen) con la funcion "create" de zustand, la cual te devuelve un HOOK que vas
// a usar en los componentes para acceder a las variables globales del STORE. La funcion create recibe como
// parametro una funcion:
//     - el valor que devuelve la funcion, representa el objeto que contiene todas las variables globales del STORE, y todas las 
//     funciones que modifican esas variables.
//     - esta funcion recibe como parametros 3 valores:
//             - set: <--- 1º parametro de la funcion, q es a su vez una funcion q sirve para modificar los valores del almacen
//                          global dentro de la funcion creadora
//             - get: <--- 2º parametro de la funcion, q es a su vez una funcion q sirve para obtener los valores del almacen
//                          global dentro de la funion creadora
//             - store: <--- 3º parametro es un objeto q representa el almacen global de variables, y q se puede usar dentro de la funcion creadora para acceder a los valores del store
//
// const storeGlobal={
//     datosCliente: { nombre:'', apellidos:'', cuenta:{}, direcciones:[], pedidos:[], opiniones:[] },
//     accessToken: '....jwt de acceso...',
//     refreshToken:'....jwt de refresco....',
//     pedidoActual: { itemsPedido:[], total:0, subtotal:0, iva:0.12 },
//     setPedido: ()=>{ .... },
//     setAccessToken:()=>{....},
//
//     
// */
// import {create} from 'zustand'
//
// //definicion del estado inicial del STORE, q es un objeto q contiene todas las variables globales del STORE
// //util para crear un metodo de inicializacion del STORE, q se puede usar dentro de la funcion creadora para inicializar el STORE
// const initialState={
//     datosCliente: { 
//                     nombre:'', 
//                     apellidos:'', 
//                     cuenta:{
//                         email:'',
//                         password:'',
//                         activada:false,
//                         fechaCreacion: 0,
//                         imagenAvatar:''  
//                     }, 
//                     direcciones:[], 
//                     pedidos:[], 
//                     opiniones:[],
//                     favoritos:[]
//                  },
//     accessToken: '',
//     refreshToken:'',
//     carrito: { 
//                     itemsPedido:[], 
//                     subtotal:0, 
//                     gastosEnvio:0, 
//                     iva:0.12,
//                     total:0 
//                 },
//     setDatosCliente: ()=>{},
//     setAccessToken:()=>{},
//     setRefreshToken:()=>{},
//     setCarrito:()=>{}
// }
//
// const useGlobalStore=create(
//     (set,get, store)=>{
//
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 1º paramtero funcion set():_',set.toString());
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 2º paramtero funcion get():_',get.toString());
//         console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 3º paramtero objeto store:_',store);
//
//         return {
//             ...initialState,
//             setDatosCliente: (nuevosDatos)=> set( stateAnterior => ({ ...stateAnterior, datosCliente: { ...stateAnterior.datosCliente, ...nuevosDatos } }) ),
//             setAccessToken: (nuevoAccessToken)=> set( stateAnterior => ({ ...stateAnterior, accessToken: nuevoAccessToken }) ),
//             setRefreshToken: (nuevoRefreshToken)=> set( stateAnterior => ({ ...stateAnterior, refreshToken: nuevoRefreshToken }) ),
//             //TODO : implementar setCarrito() para actualizar el carrito de la compra, y recalcular subtotal, gastosEnvio, iva y total
//             
//         } //<---- este objeto del return representa el state o almacen global de variables al cual acceden los componentes usando el hook
//         //devuelto por la funcion create() de zustand, en este caso useGlobalStore.
//     }
//
// )
//
// export default useGlobalStore;


// Código React original conservado como referencia y totalmente comentado.
// Origen: stateGlobal\zustand-slices\ClienteSlice.js
// const initialClienteState ={
//     datosCliente: { 
//                     nombre:'', 
//                     apellidos:'', 
//                     cuenta:{
//                         email:'',
//                         password:'',
//                         activada:false,
//                         telefono:'',
//                         fechaCreacion: 0,
//                         imagenAvatar:''  
//                     }, 
//                     direcciones:[], 
//                     pedidos:[], 
//                     opiniones:[],
//                     favoritos:[]
//                  },
//     setDatosCliente: ()=>{},
//     resetDatosCliente: ()=>{}
// }
//
// export const ClienteSlice = (set, get, store) =>{
//
//     return {
//         ...initialClienteState,
//         setDatosCliente: (nuevosDatos)=> set( stateAnterior => ({ ...stateAnterior, datosCliente: { ...stateAnterior.datosCliente, ...nuevosDatos } }) ),
//         resetDatosCliente: ()=> set( stateAnterior => ({ ...stateAnterior, ...initialClienteState }) )
//     } //<--- objeto q devuelve el slice de Cliente  se incruta en store-global
// }


// Código React original conservado como referencia y totalmente comentado.
// Origen: stateGlobal\zustand-slices\CarritoSlice.js
// const initialCarritoState = {
//     carrito: {
//         itemsPedido: [],
//         subtotal: 0,
//         gastosEnvio: 0,
//         iva: 0,
//         total: 0,
//     },
//     setCarrito: () => {},
//     resetCarrito: () => {},
// }
//
// const PORCENTAJE_IVA = 0.12
//
// export const CarritoSlice = (_get, set) => ({
//     ...initialCarritoState,
//     setCarrito: (accion, itemPedido) => set(stateAnterior => {
//         const carritoActual = stateAnterior.carrito || initialCarritoState.carrito
//         let itemsCarrito = Array.isArray(carritoActual.itemsPedido)
//             ? [...carritoActual.itemsPedido]
//             : []
//         const idProducto = itemPedido?.producto?._id
//         const posicionItem = itemsCarrito.findIndex(item => item.producto?._id === idProducto)
//
//         switch (accion) {
//             case 'agregar': {
//                 if (!itemPedido?.producto) return stateAnterior
//
//                 const cantidad = Math.max(1, Number(itemPedido.cantidad) || 1)
//                 if (posicionItem !== -1) {
//                     itemsCarrito[posicionItem] = {
//                         ...itemsCarrito[posicionItem],
//                         cantidad: (Number(itemsCarrito[posicionItem].cantidad) || 0) + cantidad,
//                     }
//                 } else {
//                     itemsCarrito.push({ ...itemPedido, cantidad })
//                 }
//                 break
//             }
//             case 'eliminar':
//                 itemsCarrito = itemsCarrito.filter(item => item.producto?._id !== idProducto)
//                 break
//             case 'actualizar':
//                 if (posicionItem !== -1 && Number(itemPedido?.cantidad) > 0) {
//                     itemsCarrito[posicionItem] = {
//                         ...itemsCarrito[posicionItem],
//                         cantidad: Number(itemPedido.cantidad),
//                     }
//                 }
//                 break
//             default:
//                 console.warn(`Acción desconocida: ${accion}`)
//                 return stateAnterior
//         }
//
//         const subtotal = itemsCarrito.reduce(
//             (total, item) => total + (Number(item.producto?.precio) || 0) * (Number(item.cantidad) || 0),
//             0,
//         )
//         const gastosEnvio = Number(carritoActual.gastosEnvio) || 0
//         const iva = subtotal * PORCENTAJE_IVA
//
//         return {
//             ...stateAnterior,
//             carrito: {
//                 itemsPedido: itemsCarrito,
//                 subtotal,
//                 gastosEnvio,
//                 iva,
//                 total: subtotal + gastosEnvio + iva,
//             },
//         }
//     }),
//     resetCarrito: () => set({ carrito: { ...initialCarritoState.carrito } }),
// })
//


// Código React original conservado como referencia y totalmente comentado.
// Origen: stateGlobal\zustand-slices\SesionSlice.js
// const initialSesionState = {
//     sesionIniciada: false,
//     accessToken: '',
//     refreshToken: '',
//     setSesionIniciada: ()=>{},
//     setAccessToken:()=>{},
//     setRefreshToken:()=>{},
//     resetSesion:()=>{}
// }
//
//
// export const SesionSlice = (set, get, store) =>{
//     return {
//         ...initialSesionState,
//         setSesionIniciada: (nuevoValor)=> set( stateAnterior => ({ ...stateAnterior, sesionIniciada: nuevoValor }) ),
//         setAccessToken: (nuevoAccessToken)=> set( stateAnterior => ({ ...stateAnterior, accessToken: nuevoAccessToken }) ),
//         setRefreshToken: (nuevoRefreshToken)=> set( stateAnterior => ({ ...stateAnterior, refreshToken: nuevoRefreshToken }) ),
//         resetSesion: ()=> set( stateAnterior => ({ ...stateAnterior, ...initialSesionState }) )
//     
//     } //<--- objeto q devuelve el slice de Sesion  se incruta en store-global
// }
