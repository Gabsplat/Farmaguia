// src/layouts/MapLayout.tsx
import PharmacyDetail from "@/components/PharmacyDetail";
import PharmacyList from "@/components/PharmacyList";
import { usePharmacies } from "@/context/PharmacyContext";

export default function MapLayout() {
  const { selected } = usePharmacies();

  return (
    <div className="hidden md:flex *:w-full h-fit min-h-screen">
      {selected ? <PharmacyDetail /> : <PharmacyList />}
    </div>
  );
}
