import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreGlobal } from '../../../../_shared_/controllers/services/store-global';

@Component({
  selector: 'app-session-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './session-button.html',
  styleUrl: './session-button.css',
})
export class SessionButton {
  readonly store = inject(StoreGlobal);
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Layout\Header\SessionButton\SessionButton.jsx
// import './SessionButton.css';
//
// function SessionButton( { saltarAUrl, email, icono } ) {
//
//     return (
//         <button className="btn btn-light btn-sm" 
//                 onClick={ ()=> saltarAUrl('/Cliente/LoginRegistro')} 
//                 >
//             {/* mostrar icono y el email del usuario si no son NULL (sesion iniciada) sino mostrar "Mi Cuenta" */}
//             {
//                 (email && icono) ?
//                 <>
//                     <img src={icono} alt="icono usuario" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />   
//                     {email}
//                 </>
//                 :
//                 <>
//                     <i className="fa-regular fa-user"></i> Mi Cuenta
//                 </>
//             }
//         </button>        
//     )
// }
//
// export default SessionButton;
