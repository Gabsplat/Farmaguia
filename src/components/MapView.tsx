// src/components/MapView.tsx
import  { useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { usePharmacies } from "../context/PharmacyContext";

// Define container style
const containerStyle = { width: "100%", height: "100%" };

export default function MapView() {
  const {
    userPos,
    setUserPos,
    mapInstance,
    setMapInstance,
    filtered,
    selected,
  } = usePharmacies();

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
      },
      (err) => console.warn("Geolocation error:", err.message)
    );
  }, [setUserPos]);

  // Center map on selected pharmacy
  useEffect(() => {
    if (selected && mapInstance) {
      mapInstance.panTo({ lat: selected.lat, lng: selected.lng });
      mapInstance.setZoom(16);
    }
  }, [selected, mapInstance]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userPos ?? { lat: -32.889, lng: -68.844 }}
      zoom={14}
      options={{ disableDefaultUI: true, zoomControl: true }}
      onLoad={(map) => setMapInstance(map)}
    >
      {/* User marker */}
      {userPos && (
        <Marker
          position={userPos}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        />
      )}
      {/* Pharmacy markers */}
      {filtered.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => {
            // Delegated to context selectPharmacy if needed
          }}
          icon={
            selected?.id === p.id
              ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : undefined
          }
        />
      ))}
    </GoogleMap>
  );
}
