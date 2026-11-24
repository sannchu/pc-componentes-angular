import { Service } from '@angular/core';

//servicio q va a exponer al resto de componentes del proyecto los datos a nivel global:
// - datos del cliente logueado
// - datos de sesion: accessToken, refreshToken, etc
// - datos del carrito de la compra actual
//seran metodos de la clase publicos que manejen señales encapsuladas con los datos del clientes, del carrito actual y de la sesion

@Service()
export class StoreGlobal {

}
