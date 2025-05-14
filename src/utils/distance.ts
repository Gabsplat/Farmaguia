// src/utils/distance.ts

import type { LatLng } from "../types/index";

/**
 * Calcula la distancia en kilómetros entre dos coordenadas
 * usando la fórmula de Haversine.
 */
export function haversine(a: LatLng, b: LatLng): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}
