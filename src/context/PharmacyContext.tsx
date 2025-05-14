// src/context/PharmacyContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { pharmacies as defaultPharmacies } from "../data/pharmacies";
import type { Pharmacy, LatLng } from "../types";
import { haversine } from "../utils/distance";

interface ContextValue {
  // List & filter
  filtered: Pharmacy[];          // siempre ordenado por distancia
  searchTerm: string;
  selectedChain: string;
  setSearchTerm(v: string): void;
  setSelectedChain(v: string): void;

  // Selección de detalle
  selected: Pharmacy | null;
  selectPharmacy(id: number): void;
  backToList(): void;

  // Mapa & geolocalización
  userPos: LatLng | null;
  mapInstance: google.maps.Map | null;
  setMapInstance(map: google.maps.Map): void;
}

const PharmacyContext = createContext<ContextValue | undefined>(undefined);

export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
  // Filtrado básico
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("Todas");
  const [filtered, setFiltered] = useState<Pharmacy[]>(defaultPharmacies);

  // Selección
  const [selected, setSelected] = useState<Pharmacy | null>(null);

  // Geolocalización & mapa
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // 1) Filtrar + añadir distancia + ordenar
  useEffect(() => {
    let list = defaultPharmacies.filter((p) => {
      const st = searchTerm.toLowerCase();
      const matchesText =
        !st || p.name.toLowerCase().includes(st) || p.address.toLowerCase().includes(st);
      const matchesChain = selectedChain === "Todas" || p.name.includes(selectedChain);
      return matchesText && matchesChain;
    });

    if (userPos) {
      list = list.map((p) => ({
        ...p,
        distance: haversine(userPos, { lat: p.lat, lng: p.lng }),
      }));
      list.sort((a, b) => (a.distance! - b.distance!));
    }

    setFiltered(list);
  }, [searchTerm, selectedChain, userPos]);

  // 2) Seleccionar farmacia + panTo en el mapa
  const selectPharmacy = (id: number) => {
    const ph = filtered.find((p) => p.id === id) || null;
    setSelected(ph);
    if (ph && mapInstance) {
      mapInstance.panTo({ lat: ph.lat, lng: ph.lng });
      mapInstance.setZoom(16);
    }
  };

  const backToList = () => setSelected(null);

  return (
    <PharmacyContext.Provider
      value={{
        filtered,
        searchTerm,
        selectedChain,
        setSearchTerm,
        setSelectedChain,
        selected,
        selectPharmacy,
        backToList,
        userPos,
        mapInstance,
        setMapInstance,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacies = () => {
  const ctx = useContext(PharmacyContext);
  if (!ctx) throw new Error("usePharmacies must be used within PharmacyProvider");
  return ctx;
};
