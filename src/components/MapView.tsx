// src/components/MapView.tsx
import React, { useEffect, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
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

  const [directions, setDirections] = useState<
    google.maps.DirectionsResult | null
  >(null);

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
    if (mapInstance && userPos) {
      mapInstance.panTo(userPos);
      mapInstance.setZoom(14);
    }
  }, [mapInstance, userPos]);

  // 2) Calcular ruta cuando seleccionan farmacia
  useEffect(() => {
    if (!selected || !userPos || !mapInstance) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: userPos,
        destination: { lat: selected.lat, lng: selected.lng },
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

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <div className="relative h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        // Ya no necesitas center aquí, lo manejamos por panTo
        zoom={14}
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

        {filtered.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => selectPharmacy(p.id)}
            icon={
              selected?.id === p.id
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : undefined
            }
          />
        ))}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Bottom-sheet mobile */}
      {selected && (
        <div
          className="
            md:hidden
            absolute bottom-0 inset-x-0
            max-h-1/2
            bg-white
            shadow-xl
            rounded-t-xl
            overflow-auto
            z-30
          "
        >
          <PharmacyDetail />
          <div className="p-2 flex justify-end">
            <button
              className="text-sm text-gray-600"
              onClick={backToList}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
