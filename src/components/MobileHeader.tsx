import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePharmacies } from "../context/PharmacyContext";
import { Card } from "./ui/card";

export default function MobileHeader() {
  const { searchTerm, setSearchTerm } = usePharmacies();

  return (
    <div className="flex flex-col p-2 ">
      <Card className="p-4 flex flex-row justify-center bg-white border-b rounded-xl border-gray-100">
        <img src="/logo.svg" alt="Farmaguía" className="w-[60%]" />
      </Card>

      <div className="py-2">
        <Card className="p-3 shadow-sm border-gray-200">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input
              type="text"
              placeholder="Buscá por farmacia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-farmaguia/10 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-farmaguia rotate-0" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
