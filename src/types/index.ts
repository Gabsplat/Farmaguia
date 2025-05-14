// src/types/index.ts
export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  services: string[];
  paymentMethods: string[];
  description: string;
  website: string;
  weeklyHours: string[];

  /** Distancia al usuario en km (opcional) */
  distance?: number;
}

export type LatLng = { lat: number; lng: number };
