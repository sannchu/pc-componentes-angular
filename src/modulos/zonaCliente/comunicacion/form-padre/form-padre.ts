import { Component, signal } from '@angular/core';
import { CajaTexto } from '../caja-texto/caja-texto';

interface ICaja {
  tipo: string;
  placeholder: string;
}

@Component({
  selector: 'app-form-padre',
  imports: [CajaTexto],
  templateUrl: './form-padre.html',
  styleUrl: './form-padre.css',
})
export class FormPadre {
  readonly caja: ICaja = {
    tipo: 'text',
    placeholder: 'Introduce algo...',
  };

  readonly textoRecibido = signal('');

  capturarTextoDelInputHijo(texto: string): void {
    console.log('Estás tecleando esto...', texto);
    this.textoRecibido.set(texto);
  }
}
