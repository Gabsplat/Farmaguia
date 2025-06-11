import React, { createContext, useContext, useEffect, useState } from "react";
import type { LatLng, Pharmacy } from "../types";
import { haversine } from "../utils/distance";

interface ContextValue {
  filtered: Pharmacy[];
  searchTerm: string;
  selectedChain: string;
  setSearchTerm(v: string): void;
  setSelectedChain(v: string): void;

  selected: Pharmacy | null;
  selectPharmacy(id: number): void;
  backToList(): void;

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
  const [pharmacies, setPharmacies] = useState<Pharmacy[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("Todas");
  const [filtered, setFiltered] = useState<Pharmacy[] | null>(null);

  const [selected, setSelected] = useState<Pharmacy | null>(null);

  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchedPharmacies = async () => {
      const cached = localStorage.getItem("pharmacies");
      const cacheDurationMs = 3 * 60 * 60 * 1000; // 3 horas
      let useCache = false;

      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheDurationMs) {
            setPharmacies(data);
            setFiltered(data);
            useCache = true;
          }
        } catch {
          // Si falla el parseo, ignora el cache
        }
      }

      if (!useCache) {
        const response = await fetch(
          "https://farma-guia-back.vercel.app/api/farmacias/abiertas"
        );
        const data = await response.json();
        setPharmacies(data);
        setFiltered(data);
        localStorage.setItem(
          "pharmacies",
          JSON.stringify({ data, timestamp: Date.now() })
        );
      }
    };
    fetchedPharmacies();
  }, []);

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
    console.log("list", list);
    setFiltered(list);
  }, [searchTerm, selectedChain, userPos, pharmacies]);

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
