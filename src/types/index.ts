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
}
