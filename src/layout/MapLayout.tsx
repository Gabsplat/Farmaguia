import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import PharmacyDetail from "../components/PharmacyDetail";
import PharmacyList from "../components/PharmacyList";
import { usePharmacies } from "../context/PharmacyContext";

const MapLayout = () => {
  const { selected, backToList, filtered, selectPharmacy } = usePharmacies();
  

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex flex-col h-screen lg:flex-row">
        <div
          className={cn(
            "w-full overflow-auto bg-white transition-all duration-300",
            selected ? "h-full" : "h-[60vh] lg:h-full"
          )}
        >
          {selected ? <PharmacyDetail /> : <PharmacyList />}
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
