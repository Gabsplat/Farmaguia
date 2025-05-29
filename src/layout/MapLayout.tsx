// src/layouts/TestLayout.tsx
import MapView from "@/components/MapView";
import MobileHeader from "@/components/MobileHeader";
import useMobile from "@/hooks/useMobile";
import { Outlet } from "react-router";

export default function TestLayout() {
  const isMobile = useMobile();
  return (
    <div className="relative h-screen">
      {isMobile && (
        <>
          <div className="absolute top-0 left-0 right-0 z-20">
            <MobileHeader />
          </div>
          <div className="absolute inset-0 z-10">
            <MapView />
          </div>
        </>
      )}

      {/* Desktop: split 50/50 */}
      {!isMobile && (
        <div className="hidden md:flex h-full">
          <div className="absolute h-screen left-4 top-4 rounded-xl min-h-screen w-1/3 z-50 overflow-y-scroll no-scrollbar">
            <Outlet />
          </div>
          <div className="w-full overflow-hidden">
            <MapView />
          </div>
        </div>
      )}
    </div>
  );
}
