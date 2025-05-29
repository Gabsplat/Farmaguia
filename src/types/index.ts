// src/types/index.ts
export interface Pharmacy {
  id: number;
  localidad_id: number;
  franquicia_id: number;
  nombre: string;
  nombre_pdf: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  review: number;
  comentarios: number;
  siempre_abierta: boolean;
  sitio_web: string | null;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
  url: string;
  distance?: number;
}

export type LatLng = { lat: number; lng: number };
