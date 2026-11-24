//modulo de codigo donde defino el tipo de dato para recoger caracteristicas de un cliente
//q viene de mongodb y nos manda nodejs en el login del cliente....
import ICuenta from '../../auth/models/Cuenta';

export default interface ICliente {
    id: string;
    nombre: string;
    apellidos: string;
    cuenta: ICuenta;
    direcciones: Array<any>;
    pedidos: Array<any>;
    favoritos: Array<any>;
    opiniones: Array<any>;
}



//import ICliente,{ICuenta} from '.../Cliente';