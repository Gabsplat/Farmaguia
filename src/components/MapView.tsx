// src/components/MapView.tsx
import React, { useEffect, useState } from "react";
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { usePharmacies } from "../context/PharmacyContext";

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

const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);


  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

  // 1) Geolocalización inicial
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("Geolocation error:", err.message)
    );
  }, [setUserPos]);

  // 2) Cuando cambia `selected`, calculamos la ruta
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
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", status);
        }
      }
    );
  }, [selected, userPos, mapInstance]);
    useEffect(() => {
    if (selected === null && mapInstance) {
      // 1) Quita la ruta del renderer
      setDirections(null);

      // 2) Centra de nuevo en la posición inicial (o en el userPos)
      const center = userPos ?? { lat: -32.889, lng: -68.844 };
      mapInstance.panTo(center);

      // 3) Restaura el zoom original
      mapInstance.setZoom(14);
    }
  }, [selected, mapInstance, userPos]);


  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userPos ?? { lat: -32.889, lng: -68.844 }}
      zoom={14}
      options={{ disableDefaultUI: true, zoomControl: true }}
      onLoad={(map) => setMapInstance(map)}
    >
      {/* Marcador de usuario */}
      {userPos && (
        <Marker
          position={userPos}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        />
      )}

      {/* Marcadores de farmacias */}
      {filtered.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => {
            // si quieres, puedes mover aquí selectPharmacy(p.id)
          }}
          icon={
            selected?.id === p.id
              ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : undefined
          }
        />
      ))}

      {/* 3) Si tenemos directions, dibujamos la ruta */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
