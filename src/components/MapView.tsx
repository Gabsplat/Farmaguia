// src/components/MapView.tsx
import useMobile from "@/hooks/useMobile";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { usePharmacies } from "../context/PharmacyContext";
import PharmacyDetail from "./PharmacyDetail";

const containerStyle = { width: "100%", height: "100%" };

export default function MapView() {
  const {
    userPos,
    setUserPos,
    mapInstance,
    setMapInstance,
    filtered,
    selected,
    selectPharmacy,
    backToList,
  } = usePharmacies();

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

  // 1) Geolocalización inicial con alta precisión
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.warn("Geolocation error:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setUserPos]);

  // 1.b) Una vez que tenemos mapa y userPos, centramos allí
  useEffect(() => {
    if (!mapInstance || !userPos) return;

    if (filtered.length > 0) {
      const first = filtered[0];
      console.log("first", first);
      mapInstance.panTo({
        lat: Number(first.latitud),
        lng: Number(first.longitud),
      });
      mapInstance.setZoom(14);
    } else {
      mapInstance.panTo(userPos);
      mapInstance.setZoom(14);
    }
  }, [mapInstance, userPos, filtered]);

  // 2) Calcular ruta cuando seleccionan farmacia
  useEffect(() => {
    if (!selected || !userPos || !mapInstance) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: userPos,
        destination: {
          lat: Number(selected.latitud),
          lng: Number(selected.longitud),
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) setDirections(result);
        else console.error("Error fetching directions", status);
      }
    );
  }, [selected, userPos, mapInstance]);

  // 3) Reset cuando des-seleccionan farmacia
  useEffect(() => {
    if (selected === null && mapInstance) {
      setDirections(null);
      // opcional: re-centrar en userPos
      if (userPos) {
        mapInstance.panTo(userPos);
        mapInstance.setZoom(14);
      }
    }
  }, [selected, mapInstance, userPos]);

  const isMobile = useMobile();

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <div className="relative h-full">
      {/* Mobile Drawer */}{" "}
      <Drawer.Root
        open={!!selected && isMobile}
        onOpenChange={() => backToList()}
      >
        <Drawer.Portal>
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 outline-none z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
              <PharmacyDetail />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={userPos || { lat: -12.0464, lng: -77.0428 }}
        options={{ disableDefaultUI: true, zoomControl: true }}
        onLoad={(map) => setMapInstance(map)}
      >
        {userPos && (
          <Marker
            position={userPos}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {filtered &&
          filtered.map((p) => {
            return (
              <Marker
                key={p.id}
                position={{ lat: Number(p.latitud), lng: Number(p.longitud) }}
                onClick={() => selectPharmacy(p.id)}
                icon={
                  selected?.id === p.id
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : undefined
                }
              />
            );
          })}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {/* Bottom-sheet mobile */}
    </div>
  );
}
