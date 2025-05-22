// src/layouts/TestLayout.tsx
import React from "react";
import MobileHeader from "@/components/MobileHeader";
import MapView from "@/components/MapView";
import { Outlet } from "react-router";

export default function TestLayout() {
  return (
    <div className="relative h-screen">
      {/* Mobile: header sobre el mapa */}
      <div className="absolute top-0 left-0 right-0 z-20 md:hidden">
        <MobileHeader />
      </div>

      {/* Mapa full-screen */}
      <div className="absolute inset-0 z-10 md:hidden">
        <MapView />
      </div>

      {/* Desktop: split 50/50 */}
      <div className="hidden md:flex h-full">
        <div className="w-1/2 overflow-auto">
          <Outlet />
        </div>
        <div className="w-1/2 overflow-hidden">
          <MapView />
        </div>
      </div>
    </div>
  );
}
