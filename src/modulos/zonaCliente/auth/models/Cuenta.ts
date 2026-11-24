export default interface ICuenta {
    email:string
    password:string;
    activada: boolean;
    telefono:string;
    fechaCreacion: Number; //<---- ojo con objetos Date, manejar mejor ms para evitar problemas conversion tipos Date
    imagenAvatar: string;   
} 