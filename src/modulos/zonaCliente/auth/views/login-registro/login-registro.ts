import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, Injector, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteAuthService } from '../../controllers/cliente-auth.service';
import { StoreGlobal } from '../../../../_shared_/controllers/services/store-global';
import { ICajaTexto } from '../../models/ICajaTexto';
import { environment } from '../../../../../environments/environment';
import type Cliente from '../../../_shared_/models/Cliente';

type FormData = Record<string, string>;

interface GoogleLoginMessage {
  codigo: number;
  mensaje?: string;
  datos?: {
    cliente?: Cliente;
    accessToken?: string;
    token?: string;
    refreshToken?: string;
  };
}

@Component({
  selector: 'app-login-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-registro.html',
  styleUrl: './login-registro.css',
})
export class LoginRegistro implements OnInit {
  enLogin: WritableSignal<boolean> = signal<boolean>(true);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly recaptchaToken = signal('');
  idWidgetRecaptcha: number = 0;
  readonly formData: FormData = { nombre: '', email: '', password: '', repassword: '' };

  //señal para referenciar el contenedor del reCaptcha en el DOM: viewChild<tipo de elemento del dom>('selector_variable_template')
  recaptchaContainer: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('recaptchaContainer');

  readonly titulo = computed(() => (this.enLogin() ? 'Iniciar sesión' : 'Crear cuenta'));
  readonly textoPregunta = computed(() => (this.enLogin() ? '¿Eres nuevo cliente?' : 'Ya tengo una cuenta'));
  readonly textoBotonCambio = computed(() => (this.enLogin() ? 'Crear cuenta' : 'Iniciar sesión'));
  readonly textoBotonEnvio = computed(() => (this.enviando() ? 'Un momento…' : this.titulo()));
  readonly cajasVisibles = computed(() => this.cajasTexto.filter((caja) => (this.enLogin() ? caja.enLogin : caja.enRegistro)));

  cajasTexto: Array<ICajaTexto> = [
    { placeholder: 'Nombre', type: 'text', id: 'nombre', enLogin: false, enRegistro: true },
    { placeholder: 'E-mail*', type: 'email', id: 'email', enLogin: true, enRegistro: true },
    { placeholder: 'Contraseña*', type: 'password', id: 'password', enLogin: true, enRegistro: true },
    { placeholder: 'Repetir Contraseña*', type: 'password', id: 'repassword', enLogin: false, enRegistro: true },
  ];

  private readonly auth = inject(ClienteAuthService);
  private storeGlobal: StoreGlobal = inject(StoreGlobal);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly googleMessageHandler = (event: MessageEvent<GoogleLoginMessage>): void => {
    if (event.origin !== 'http://localhost:3000' || !event.data) return;
    if (event.data.codigo !== 0 || !event.data.datos?.cliente) {
      this.error.set(event.data.mensaje || 'No se pudo iniciar sesión con Google.');
      return;
    }

    const { cliente } = event.data.datos;
    this.storeGlobal.iniciarSesion(
      cliente,
      event.data.datos.accessToken || event.data.datos.token || '',
      event.data.datos.refreshToken || '',
    );
    (event.source as Window | null)?.close();
    void this.router.navigate(['/']);
  };

  // constructor(private _storeGlobal:StoreGlobal){
  //   this.storeGlobal=this._storeGlobal;
  // }

  ngOnInit(): void {
    // Aquí puedes inicializar el reCaptcha o cualquier otra lógica al cargar el componente
    // El <div #recaptchaContainer> aún no existe en el DOM dentro de ngOnInit, así que esperamos a que se pinte la vista
    afterNextRender(
      () => {
        const contenedor = this.recaptchaContainer()?.nativeElement;
        //1º vemos si está cargada la libreria de reCaptcha y existe el objeto window.grecaptcha
        const grecaptcha = (window as any).grecaptcha;
        if (!contenedor || !grecaptcha?.enterprise?.ready) {
          console.error('La librería de reCaptcha no está cargada....no puedo renderizar el widget');
          return;
        }
        // 2º el script carga de forma asíncrona: esperamos a que la librería esté lista
        grecaptcha.enterprise.ready(() => {
          // Inicializar el widget de reCaptcha dentro del <div...> al que hace referencia la señal recaptchaContainer
          this.idWidgetRecaptcha = grecaptcha.enterprise.render(contenedor, {
            sitekey: environment.recaptchaSiteKey, //<---- id clave publica de reCaptcha (se lee de src/environments)
            action: 'LOGIN',
            callback: (token: string) => this.recaptchaToken.set(token),
            'expired-callback': () => this.recaptchaToken.set(''),
          });
        });
      },
      { injector: this.injector },
    );
  }

  constructor() {
    window.addEventListener('message', this.googleMessageHandler);
    this.destroyRef.onDestroy(() => window.removeEventListener('message', this.googleMessageHandler));
  }

  cambiarModo(): void {
    this.enLogin.update((login) => !login);
    this.error.set('');
    this.mensaje.set('');
  }

  async enviar(): Promise<void> {
    this.error.set('');
    this.mensaje.set('');
    const { nombre, email, password, repassword } = this.formData;
    if (!email.trim() || !password) {
      this.error.set('Introduce el correo electrónico y la contraseña.');
      return;
    }
    if (!this.enLogin() && !nombre.trim()) {
      this.error.set('Introduce tu nombre.');
      return;
    }
    if (!this.enLogin() && password !== repassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.enviando.set(true);
    this.isLoading.set(true);
    try {
      const respuesta = this.enLogin()
        ? await this.auth.login(email.trim(), password)
        : await this.auth.registro(nombre.trim(), email.trim(), password);

      if (respuesta.codigo !== 0) throw new Error(respuesta.mensaje || 'No se pudo completar la operación.');

      if (this.enLogin()) {
        const datos = respuesta.datos;
        if (!datos?.cliente || !datos.accessToken) throw new Error('El servidor no devolvió los datos de la sesión.');
        this.storeGlobal.iniciarSesion(datos.cliente, datos.accessToken, datos.refreshToken || '');
        await this.router.navigate(['/']);
      } else {
        this.mensaje.set(respuesta.mensaje || 'Cuenta creada. Revisa tu correo para activar el acceso.');
        this.formData['password'] = '';
        this.formData['repassword'] = '';
      }
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Ha ocurrido un error al conectar con el servidor.');
    } finally {
      this.enviando.set(false);
      this.isLoading.set(false);
    }
  }

  async iniciarSesionGoogle(): Promise<void> {
    this.error.set('');
    try {
      const respuesta = await this.auth.getGoogleUrlCallBack();
      if (respuesta.codigo !== 0 || !respuesta.datos?.url) {
        throw new Error(respuesta.mensaje || 'No se pudo abrir el acceso de Google.');
      }
      const popup = window.open(respuesta.datos.url, 'popupGoogle', 'width=600,height=650');
      if (!popup) this.error.set('El navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes para continuar.');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo iniciar sesión con Google.');
    }
  }
}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaCliente\registro\LoginRegistro.jsx
// import './LoginRegistro.css';
// import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router';
// import useStore  from '../../../stateGlobal/zustandStateSlices';
//
// function LoginRegistro(){
//     const navigate = useNavigate();
//     const { setDatosCliente, setAccessToken, setRefreshToken, setSesionIniciada }=useStore();
//     const [ enLogin, setEnLogin ] = useState(false); // valor inicial es false, es decir, estamos en modo registro
//     const [ formData, setFormData ] = useState(
//         {
//             nombre:'',
//             email:'',
//             password:'',
//             repassword:''
//         }
//     )
//     const divErrores=useRef(null); //referencia al div donde se muestran los mensajes de error del formulario de login/registro
//
//     //efecto que se ejecuta cuando se carga el componente, añade manejador de eventos "message" para recibir mensajes del popup
//     //de login con google
//
//     useEffect(
//         ()=>{
//             window.addEventListener('message', (evento)=>{
//                 console.log('evento message recibido del popup de login con google, datos mandados por popup: ', evento.data);
//                 
//                 if(evento.data.codigo !== 0) {
//                     console.log('error al hacer login con google: ', evento.data.mensaje);
//                     //muestro mensaje de error en el div de mensajes de error del formulario de login/registro
//                     //en divErrores esta la referencia al <div...> del DOM de react donde quiero mostrarlos
//                     //es un objeto: { current: ...... }
//                     if(divErrores.current){
//                         divErrores.current.innerHTML=`
//                             <div class="alert alert-danger" role="alert">
//                                 ${evento.data.mensaje}
//                             </div>
//                         `;
//                     }
//
//                 } else {
//                     //1º cerrar el popup de login con google
//                     evento.source.close();
//
//                     //2º guardar en el store global de zustand los datos del cliente y los tokens JWT....
//                     setDatosCliente(evento.data.datos.cliente);
//                     setAccessToken(evento.data.datos.accessToken||'');
//                     setRefreshToken(evento.data.datos.refreshToken||'');
//                     setSesionIniciada(true);
//                     
//                     //3º redireccionar a la pagina principal de la tienda
//                     navigate('/');
//
//                 }
//             });
//         },[navigate, setDatosCliente, setAccessToken, setRefreshToken, setSesionIniciada]
//     )
//
//
//     // const [ nombreUsuario, setNombreUsuario ] = useState(''); // valor inicial del nombre de usuario es cadena vacia
//     // const [ email, setEmail ] = useState(''); // valor inicial del email es cadena vacia
//     // const [ password, setPassword ] = useState(''); // valor inicial del password es cadena vacia
//     // const [ repassword, setRepassword ] = useState(''); // valor inicial del repassword es cadena vacia
//
//     const camposFormulario = [
//       { id: "nombre", label: "Nombre", type:"text", apareceEnLogin: false }, 
//       { id: "email", label:"Email", type:"email", apareceEnLogin: true }, 
//       { id: "password", label:"Password", type:"password", apareceEnLogin: true }, 
//       { id: "repassword", label:"Repassword", type:"password", apareceEnLogin: false }
//     ];
//
//
//  function changeInputs(ev){
//     console.log('evento change del input: ',ev);
//     console.log( '...el valor actual de la caja de texto es....', ev.target.value);
//     console.log('el id del input es: ', ev.target.id);
//
//     //Solo tengo la funcion modificadora setFormData para cambiar el objeto del state ¿como la uso
//     //para cambiar el valor de la propiedad del objeto que corresponde al input que ha cambiado?
//
//     setFormData(
//         { ...formData, [ev.target.id]: ev.target.value }
//    );
//
//    console.log('el objeto formData actualizado es: ', formData);
//
//     // switch (ev.target.id) {
//     //   case 'inputNombre': setNombreUsuario(ev.target.value);break;
//     //   case 'inputEmail': setEmail(ev.target.value);break;
//     //   case 'inputPassword': setPassword(ev.target.value);break;
//     //   case 'inputRepassword': setRepassword(ev.target.value);break;
//     // }
//
//   }
//
//   async function clickSendDataToServer(){
//     try{
//         //console.log('datos a mandar al server....', { nombreUsuario, email, password, repassword });
//         console.log('datos a mandar al server....', formData );
//
//         const urlEndPoint = `http://localhost:3000/api/Cliente/${ enLogin ? 'Login' : 'Registro' }`;
//         const petServer=await fetch(urlEndPoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         });
//        
//         const datosRespuesta=await petServer.json();
//         console.log('datosRespuesta del server: ', datosRespuesta);
//         if(datosRespuesta.codigo !==0 ) throw new Error(datosRespuesta.mensaje);
//
//         //si llegamos aqui es que el login o registro ha sido correcto, guardamos en el store global los datos del cliente y los
//         //tokens SI ESTAMOS EN EL LOGIN, en registro no se manda nada, solo mensaje de activar cuenta...
//         if(enLogin){
//             setDatosCliente(datosRespuesta.datos.cliente);
//             setAccessToken(datosRespuesta.datos.accessToken||'');
//             setRefreshToken(datosRespuesta.datos.refreshToken||'');
//             setSesionIniciada(true);
//         }
//         navigate('/'); //redireccionamos a la pagina principal de la tienda
//
//     } catch(error){
//         console.log('error al crear cuenta: ', error);
//     }
//   }
//
//   async function handlerGoogleLoginClick(){
//         try{
//             const urlPopupGoogle=await fetch('http://localhost:3000/api/Cliente/LoginGoogle');
//             const datosPopupGoogle=await urlPopupGoogle.json();
//             console.log('urlPopupGoogle: ', datosPopupGoogle.datos.url);
//             
//             window.open(datosPopupGoogle.datos.url, 'popupGoogle', 'width=600,height=600');
//
//         } catch(error){
//             console.log('error al hacer login con google: ', error);
//         }
//     }
//  
//
//     return <div className="container">
//         
//         <div className="row">
//             <div className="col-12 d-flex flex-row align-items-center justify-content-center">
//                 <img  src="/imagenes/logo_pccomponentes.png" alt="logo" className="logo"/>
//             </div>
//         </div>
//
//         <div className="row">
//             
//             <div className="col-6">
//                 <img src="/imagenes/loginRegistro_info.png" alt="loginRegistro_info" style={ { width: "500px", height: "500px"} }/>
//             </div>
//             
//             <div className="col-6">
//                 {/* Formulario de Login o Registro en funcion de url o accion evento boton crearCuenta/iniciar Sesion */}
//                 <div className="container">
//                     
//                     <div className="row"><div className="col"><h4><strong>{ enLogin ? "Iniciar sesión" : "Crear cuenta" }</strong></h4></div></div>
//                     <div className="row m-3">
//                         <div className="col d-grid gap-1">
//                             <button type="button" 
//                                     id="btnlogingmail"
//                                     className="btn btn-light btn-sm"
//                                     onClick={ handlerGoogleLoginClick } >
//                                 <img  src="/imagenes/boton_login_GMAIL.png"/>
//                             </button>
//                         </div>
//                     </div>
//
//                     {/* div para MOSTRAR MENSAJES DE ERROR durante el LOGIN/REGISTRO */}
//                     <div className="row m-3" ref={divErrores}></div>
//
//
//                     <div className="row"><div className="col m-4"><h6><span> O bien </span></h6></div></div>
//
//                     <div className="row">
//                         <div className="col-12">
//                         {
//                             camposFormulario.filter( campo => enLogin ? campo.apareceEnLogin : true )
//                                             .map( campo => (
//                                                             <div className="form-floating m-4" key={campo.label}>
//                                                                 <input type={campo.type} 
//                                                                         id={`${campo.id}`} 
//                                                                         className="form-control" 
//                                                                         placeholder={campo.label + "*"} 
//                                                                         onChange={ changeInputs }/>
//                                                                 <label className="form-label" htmlFor={`input${campo.id}`}>{campo.label}:</label>
//                                                             </div>
//                                                         )
//                             )
//                         }
//                         {       
//                             ! enLogin &&
//                             <>                           
//                                 <div className="form-check">
//                                     <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
//                                     <label className="form-check-label" for="flexCheckDefault">
//                                         He leido y acepto la <a href="">politica de privacidad</a>
//                                     </label>
//                                 </div>
//
//                                 <div className="form-check">
//                                     <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
//                                     <label className="form-check-label" for="flexCheckChecked">
//                                         Recibir <strong>descuentos exclusivos</strong>, novedades y tendencias por e-mail. Me puedo dar de baja desde mi panel.
//                                     </label>
//                                 </div>                                
//                             </>
//                         }
//                         </div>
//                     </div>
//
//                     <div className="row">
//                         <div className="col-12 d-grid gap-1 mt-4 mb-4">
//                             <button type="button" className="btn  pccomponentes-primary" onClick={ clickSendDataToServer }>
//                             {
//                                 enLogin ?
//                                 <span>Iniciar sesion</span> 
//                                 :
//                                 <span>Crear cuenta</span>
//                             }
//                             </button>
//                         </div>
//                     </div>
//
//                     <hr></hr>
//                         <div className="row">
//                             <div className="col m-4">
//                                 <h6><span> { enLogin ? '¿Eres nuevo cliente?':'Ya tengo una cuenta'} </span></h6>
//                             </div>
//                         </div>
//
//                         <div className="row">
//                             <div className="col d-grid gap-1">
//                                 <button type="button"  className="btn btn-outline-secondary" onClick={() => setEnLogin(!enLogin)}>
//                                     <span> { enLogin ? 'Crear cuenta' : 'Iniciar Sesion' }</span>
//                                 </button>
//                             </div>
//                         </div>
//
//
//
//                 </div>
//             </div>
//         </div>
//
//
//
//     </div>
//
// }
//
// export default LoginRegistro;
