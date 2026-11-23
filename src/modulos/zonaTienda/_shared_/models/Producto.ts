export interface DescuentoProducto {
  tieneDescuento?: boolean;
  porcentaje?: number;
  precioOriginal?: number;
  etiqueta?: string;
}

export interface OpinionProducto {
  _id?: string;
  avatarUsuario?: string;
  nombreUsuario?: string;
  fecha?: string | number | Date;
  valoracion?: number;
  texto?: string;
  pros?: string[];
  contras?: string[];
}

export interface RespuestaPregunta {
  nombreUsuario?: string;
  fecha?: string | number | Date;
  texto?: string;
}

export interface PreguntaProducto {
  _id?: string;
  avatarUsuario?: string;
  nombreUsuario?: string;
  fecha?: string | number | Date;
  texto?: string;
  respuestas?: RespuestaPregunta[];
}

export interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  imagenes?: string[];
  imagenProducto?: string;
  descuento?: DescuentoProducto;
  valoracionMedia?: number;
  numeroOpiniones?: number;
  opiniones?: OpinionProducto[];
  preguntas?: PreguntaProducto[];
  vendedor?: string;
  marca?: string;
  sku?: string;
  partNumber?: string;
  caracteristicas?: string[];
  descripcion?: string;
  especificaciones?: Record<string, unknown>;
  disponible?: boolean;
}
