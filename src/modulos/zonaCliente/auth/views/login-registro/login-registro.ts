import { Component, ElementRef, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { StoreGlobal } from '../../../../_shared_/controllers/services/store-global';
import { ICajaTexto } from '../../models/ICajaTexto';
import IFormLoginRegistro from '../../models/formModels/IFormLoginRegistro';
import { form, FormField, SchemaPathTree, email, minLength, required } from '@angular/forms/signals';
import { environment } from '../../../../../environments/environment.development';

@Component({
  imports: [FormField],
  selector: 'app-login-registro',
  standalone: true,
  styleUrl: './login-registro.css',
  templateUrl: './login-registro.html'
})
export class LoginRegistro {
  enLogin:WritableSignal<boolean>=signal<boolean>(true);
  isLoading:WritableSignal<boolean>=signal<boolean>(false);
  //señal para referenciar el contenedor del reCaptcha en el DOM: viewChild<tipo de elemento del dom>('selector_variable_template')
  recaptchaContainer:Signal<ElementRef<HTMLElement>|undefined>=viewChild<ElementRef<HTMLElement>>('recaptchaContainer');
  idWidgetRecaptcha:number=0;

  cajasTexto:Array<ICajaTexto>= [
        { placeholder: "Nombre", type: "text", id: "nombre", enLogin: false, enRegistro: true },
        { placeholder: "E-mail*", type: "email", id: "email", enLogin: true, enRegistro: true },
        { placeholder: "Contraseña*", type: "password", id: "password", enLogin: true, enRegistro: true },
        { placeholder: "Repetir Contraseña*", type: "password", id: "repassword", enLogin: false, enRegistro: true }
  ];
  //#region --------- signal form para loginRegistro ---------------------------------------
  //1º paso) modelo para el signal-form con los campos que queremos mapear del formulario de login/registro:
  formLoginRegistroModel: WritableSignal<IFormLoginRegistro> = signal<IFormLoginRegistro>(
    {
      nombre: '',
      email: '',
      password: '',
      repassword: ''
    }
  );
  //2º paso) mapeamos con funcion "form" de @angular/signals  cada una de las props.del modelo con un campo del
  //formulario.
  formLoginRegistro=form(
    this.formLoginRegistroModel, //<---- 1º parametro: el signal que contiene el modelo del formulario
    ( schema: SchemaPathTree<IFormLoginRegistro> )=>{ //<--------------------------- 2º parametro: funcion que define validaciones sobre campos del modelo del formulario
      //dentro del cuerpo de la funcion empiezo a definir reglas de validacion mediante funciones señal predefinidas de validacion
      //o funciones-señal para hacer validaciones personalizadas
      required(schema.nombre,{ message: "* El nombre es obligatorio"});
      required(schema.email,{ message: "* El email es obligatorio"});
      required(schema.password,{ message: "* La contraseña es obligatoria"});
      required(schema.repassword,{ message: "* La confirmación de la contraseña es obligatoria"});
      email(schema.email,{ message: "* El email no es válido"});
      minLength(schema.password, 6, { message: "* La contraseña debe tener al menos 6 caracteres" });
      minLength(schema.repassword, 6, { message: "* La confirmación de la contraseña debe tener al menos 6 caracteres" });
    }
  );
  //3º paso) mapear los campos del formulario  <input...> con cada prop. del modelo del formLoginRegistro
  // mediante directivas [formField]="propiedad"
  //#endregion ------------------------------------------------------------------------------

  private storeGlobal:StoreGlobal=inject(StoreGlobal);
  
  // constructor(private _storeGlobal:StoreGlobal){
  //   this.storeGlobal=this.storeGlobal;
  // }
 
  ngOnInit(): void {
    // Aquí puedes inicializar el reCaptcha o cualquier otra lógica al cargar el componente
    //1º vemos si esta cargada la libreria de reCaptcha y existe el  objeto window.grecaptcha
    if ( (window as any).grecaptcha ) {
      // Inicializar el widget de reCaptcha dentro del <div...> al que hace referencia la señal recaptchaContainer 
      // almacenamos en prop.del componente el id del widget generado por reCaptcha para despues poder recuperar el token generado
      // por google para ese widget específico.
      this.idWidgetRecaptcha=(window as any).grecaptcha.enterprise.render(
                                          this.recaptchaContainer()?.nativeElement,
                                          {
                                            sitekey: environment.recaptchaPublicIDSiteKey, //<---- id clave publica de reCaptcha generada en console.cloud
                                            action: 'LOGIN'
                                          }
                                        );
    } else {
      console.error('La librería de reCaptcha no está cargada....no puedo renderizar el widget');
    }

  }
 
 
 
 
  HandleLoginWithGoogle():void{
  
 }

  SwitchLoginRegistro():void{
    this.enLogin.set(!this.enLogin());
  }

  ChangeFormData(id:string, valorCaja:string):void{
    console.log(`cambio en la caja de texto con id: ${id} y valor: ${valorCaja}`);
  }
  SubmitForm():void{
    console.log(`submit del formulario`);
    // Aquí podrías obtener el token del reCaptcha usando el id del widget almacenado en this.idWidgetRecaptcha
    //se lo  paso a mi servicio de NodeJS para q lo valide...junto con los otros datos: email, password, ....
    const tokenReCaptcha=(window as any).grecaptcha.enterprise.getResponse(this.idWidgetRecaptcha);
    console.log(`Token reCaptcha q angular no sabe interpretar: ${tokenReCaptcha}`);
  }
}
