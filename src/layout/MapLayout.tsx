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

      {!isMobile && (
        <div className="hidden md:flex h-full">
          <div className="absolute h-screen rounded-r-xl min-h-screen w-1/2 xl:w-1/3 2xl:w-[28%] z-50 overflow-y-scroll no-scrollbar">
            <div
              className="pointer-events-none absolute inset-0 rounded-r-xl"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.60) 70%, transparent 100%)",
                zIndex: 10,
              }}
            />
            <div className="relative z-20">
              <Outlet />
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <MapView />
          </div>
        </div>
      )}
    </div>
  );
}
