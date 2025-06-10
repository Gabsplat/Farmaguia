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

const snapPoints = ["150px", 1];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  // Oculta todos los POIs menos hospitales (siempre muestra hospitales)
  styles: [
    {
      featureType: "poi.business",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.attraction",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.government",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.place_of_worship",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.school",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.sports_complex",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    // Ya no ocultamos parques aquí
    // Oculta todos los POIs excepto hospitales y parques
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    // Muestra hospitales (medical)
    {
      featureType: "poi.medical",
      elementType: "all",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.medical",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.medical",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.medical",
      elementType: "labels.icon",
      stylers: [{ visibility: "on" }],
    },
    // Vuelve a mostrar parques pero oculta sus íconos
    {
      featureType: "poi.park",
      elementType: "all",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

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

  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

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

  useEffect(() => {
    if (selected === null && mapInstance) {
      setDirections(null);

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
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        modal={false}
        autoFocus={false}
        setActiveSnapPoint={setSnap}
        open={!!selected && isMobile}
        onOpenChange={() => backToList()}
      >
        <Drawer.Portal>
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 outline-none z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-2" />
              <PharmacyDetail />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={userPos || { lat: -12.0464, lng: -77.0428 }}
        options={mapOptions}
        onLoad={(map) => setMapInstance(map)}
      >
        {userPos && (
          <Marker
            position={userPos}
            label={{
              text: "Estás aquí",
              className:
                "block bg-white! px-2! py-1! text-xs! rounded-full! border-2! border-[#FF7070]! font-medium! text-[#FF7070]! ",
            }}
            icon={{
              url: "/start.png",
              labelOrigin: new google.maps.Point(11, -20),
            }}
          />
        )}

        {filtered &&
          filtered.map((p, i) => {
            return (
              <Marker
                key={p.id}
                position={{ lat: Number(p.latitud), lng: Number(p.longitud) }}
                onClick={() => selectPharmacy(p.id)}
                label={
                  i === 0
                    ? {
                        text: "Más cercana",
                        className:
                          "block bg-white! px-2! py-1! text-xs! rounded-full! border-2! border-farmaguia! font-bold! text-farmaguia! animate-pulse! duration-1000! ",
                      }
                    : undefined
                }
                icon={{
                  url:
                    selected?.id === p.id
                      ? "/selected-farmacia.png"
                      : "/unselected-farmacia.png",
                  labelOrigin: new google.maps.Point(15, -20),
                }}
              />
            );
          })}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#084639",
                strokeWeight: 5,
                icons: [
                  {
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 5,
                      fillColor: "#084639",
                    },
                  },
                ],
              },
              routeIndex: 0,
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
      {/* Bottom-sheet mobile */}
    </div>
  );
}
