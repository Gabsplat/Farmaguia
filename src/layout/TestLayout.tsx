import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { Outlet } from "react-router";
import MapView from "../components/MapView";

export default function TestLayout() {
  useEffect(() => {
    console.log("MAPS_API_KEY", import.meta.env.VITE_MAPS_API_KEY);
  }, []);

  return (
    <div className="flex min-h-screen gap-10">
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <div className="flex-1">
        <MapView />
      </div>
    </div>
  );
}
