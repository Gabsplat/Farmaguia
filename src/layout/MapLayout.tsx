import { cn } from "@/lib/utils";
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

    </main>
  );
};

export default MapLayout;
