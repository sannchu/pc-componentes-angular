import IFormLoginRegistro from './formModels/IFormLoginRegistro';

export interface ICajaTexto {
    id: keyof IFormLoginRegistro; // solo ids que existen en el modelo del signal-form
    type: string;
    placeholder: string;
    enLogin: boolean;
    enRegistro: boolean;
}