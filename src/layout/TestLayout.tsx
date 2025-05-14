import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function TestLayout() {
  useEffect(() => {
    console.log("MAPS_API_KEY", import.meta.env.VITE_MAPS_API_KEY);
  }, []);

  return (
    <div className="flex min-h-screen gap-10">
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="flex-1 flex items-center justify-center bg-blue-500">
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
          <Map
            style={{ width: "50vw", height: "100vh" }}
            defaultCenter={{ lat: -32.89084, lng: -68.82717 }}
            defaultZoom={16}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          />
        </APIProvider>
      </div>
    </div>
  );
}
