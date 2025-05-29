// src/context/PharmacyContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { pharmacies as defaultPharmacies } from "../data/pharmacies";
import type { LatLng, Pharmacy } from "../types";
import { haversine } from "../utils/distance";

interface ContextValue {
  // List & filter
  filtered: Pharmacy[]; // siempre ordenado por distancia
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
  setUserPos(pos: LatLng | null): void;
  mapInstance: google.maps.Map | null;
  setMapInstance(map: google.maps.Map): void;
}

const PharmacyContext = createContext<ContextValue | undefined>(undefined);

export const PharmacyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Filtrado básico
  const [pharmacies, setPharmacies] = useState<Pharmacy[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("Todas");
  const [filtered, setFiltered] = useState<Pharmacy[] | null>(null);

  // Selección
  const [selected, setSelected] = useState<Pharmacy | null>(null);

  // Geolocalización & mapa
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchedPharmacies = async () => {
      const response = await fetch(
        "https://farma-guia-back.vercel.app/api/farmacias/abiertas"
      );
      const data = await response.json();
      setPharmacies(data);
      setFiltered(data);
    };
    fetchedPharmacies();
  }, []);

  // 1) Filtrar + añadir distancia + ordenar
  useEffect(() => {
    if (!pharmacies) return;
    let list = pharmacies?.filter((p) => {
      const st = searchTerm.toLowerCase();
      const matchesText =
        !st ||
        p.nombre.toLowerCase().includes(st) ||
        p.direccion.toLowerCase().includes(st);
      const matchesChain =
        selectedChain === "Todas" || p.nombre.includes(selectedChain);
      return matchesText && matchesChain;
    });

    if (userPos) {
      list = list.map((p) => ({
        ...p,
        distance: haversine(userPos, { lat: p.latitud, lng: p.longitud }),
      }));
      list.sort((a, b) => a.distance! - b.distance!);
    }

    setFiltered(list);
  }, [searchTerm, selectedChain, userPos]);

  // 2) Seleccionar farmacia + panTo en el mapa
  const selectPharmacy = (id: number) => {
    if (!filtered) return;
    const ph = filtered.find((p) => p.id === id) || null;
    setSelected(ph);
    if (ph && mapInstance) {
      mapInstance.panTo({ lat: ph.latitud, lng: ph.longitud });
      mapInstance.setZoom(16);
    }
  };

  const backToList = () => setSelected(null);

  return (
    <PharmacyContext.Provider
      value={{
        filtered: filtered || [],
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
        setUserPos,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacies = () => {
  const ctx = useContext(PharmacyContext);
  if (!ctx)
    throw new Error("usePharmacies must be used within PharmacyProvider");
  return ctx;
};
