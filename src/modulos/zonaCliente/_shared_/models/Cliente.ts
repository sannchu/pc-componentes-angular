import type ICuenta from '../../auth/models/Cuenta';

export default interface ICliente {
  _id?: string;
  nombre: string;
  apellidos: string;
  cuenta: ICuenta;
  direcciones?: unknown[];
  pedidos?: unknown[];
  favoritos?: unknown[];
  listaFavoritos?: unknown[];
  opiniones?: unknown[];
}
