import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-caja-texto',
  templateUrl: './caja-texto.html',
  styleUrl: './caja-texto.css',
})
export class CajaTexto {
  readonly tipo = input<string>('text');
  readonly placeholder = input<string>('Introduce algo...');
  readonly contenidoEvent = output<string>();

  changeInputText(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.contenidoEvent.emit(inputElement.value);
  }
}
