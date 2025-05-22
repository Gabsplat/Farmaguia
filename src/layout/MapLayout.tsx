// src/layouts/MapLayout.tsx
import React from "react";
import MobileHeader from "@/components/MobileHeader";
import MapView from "@/components/MapView";
import PharmacyList from "@/components/PharmacyList";
import PharmacyDetail from "@/components/PharmacyDetail";
import { usePharmacies } from "@/context/PharmacyContext";

export default function MapLayout() {
  const { selected } = usePharmacies();

  return (
    <div className="">
      {/* Mobile: header sobre el mapa */}
      <div className="absolute top-0 left-0 right-0 z-20 md:hidden">
        <MobileHeader />
      </div>

      {/* Mapa full-screen */}     <div className="absolute inset-0 z-10 md:hidden">
        <MapView />
      </div>

      {/* Desktop: sidebar + mapa */}
      <div className="hidden md:flex h-full">
        <div className="w-full overflow-auto border-r">
          {selected ? <PharmacyDetail /> : <PharmacyList />}
        </div>
      </div>
    </div>
  );
}
