import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import PharmacyDetail from "../components/PharmacyDetail";
import PharmacyList from "../components/PharmacyList";
import { usePharmacies } from "../context/PharmacyContext";

const MapLayout = () => {
  const { selected, backToList, filtered, selectPharmacy } = usePharmacies();
  //   const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  /* init map */
  //   useEffect(() => {
  //     if (typeof window === "undefined") return;

  //     const init = () => {
  //       if (!window.google || map) return;
  //       const instance = new window.google.maps.Map(
  //         document.getElementById("map") as HTMLElement,
  //         {
  //           center: { lat: -32.889, lng: -68.844 },
  //           zoom: 14,
  //           mapId: "pharmacy-map",
  //           disableDefaultUI: true,
  //           zoomControl: true,
  //         }
  //       );
  //       setMap(instance);
  //     };

  //     if (!window.google) {
  //       const script = document.createElement("script");
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
  //       script.async = true;
  //       script.defer = true;
  //       window.initMap = init;
  //       document.head.appendChild(script);
  //     } else init();
  //   }, [map, setMap]);

  /* update markers when filtered list changes */
  //   useEffect(() => {
  //     if (!map) return;
  //     markers.forEach((m) => m.setMap(null));

  //     const newM = filtered.map((p) => {
  //       const m = new window.google.maps.Marker({
  //         position: { lat: p.lat, lng: p.lng },
  //         map,
  //         title: p.name,
  //       });
  //       m.addListener("click", () => selectPharmacy(p.id));
  //       return m;
  //     });
  //     setMarkers(newM);
  //   }, [filtered, map]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex flex-col h-screen lg:flex-row">
        <div
          className={cn(
            "w-full lg:w-1/2 overflow-auto bg-white transition-all duration-300",
            selected ? "h-full" : "h-[60vh] lg:h-full"
          )}
        >
          {selected ? <PharmacyDetail /> : <PharmacyList />}
        </div>

        {/* Map panel */}
        <div
          className={cn(
            "w-full lg:w-1/2 transition-all duration-300",
            selected ? "h-0 lg:h-full" : "h-[40vh] lg:h-full"
          )}
        >
          <div id="map" className="w-full h-full" />
        </div>
      </div>

      {/* Mobile FAB */}
      {selected && (
        <Button
          className="lg:hidden fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg bg-teal-600 hover:bg-teal-700 flex items-center justify-center"
          onClick={() => {
            const mapContainer = document.getElementById("map")?.parentElement;
            if (mapContainer) mapContainer.classList.toggle("h-[100vh]");
          }}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      )}
    </main>
  );
};

export default MapLayout;
