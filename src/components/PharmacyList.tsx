import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Search, Cross } from "lucide-react";
import { usePharmacies } from "../context/PharmacyContext";

const ITEMS_PER_PAGE = 6;

const PharmacyList = () => {
  const { filtered, selected, selectPharmacy, searchTerm, setSearchTerm } =
    usePharmacies();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visiblePharmacies = filtered?.slice(0, visibleCount) || [];
  const hasMore = filtered && filtered.length > visibleCount;

  return (
    <div className="flex flex-col h-full mt-6 ml-6 rounded-xl">
      <Card className="p-4 mb-4 flex flex-row justify-center bg-white border-b rounded-xl border-gray-100">
        <img src="/logo.svg" alt="Farmaguía" className="w-[60%]" />
        <div className="py-2 flex justify-center w-full">
          <div className="flex w-full justify-center max-w-sm items-center gap-2">
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
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto">
        {filtered === null && (
          <div className="text-center text-gray-500 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No se encontraron farmacias</p>
          </div>
        )}

        {filtered !== null && filtered.length === 0 && (
          <div className="text-center text-gray-500 animate-pulse py-8">
            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
            <p>Cargando farmacias...</p>
          </div>
        )}

        {visiblePharmacies.length > 0 && (
          <div className="space-y-3">
            {visiblePharmacies.map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-farmaguia",
                  selected?.id === pharmacy.id
                    ? "ring-2 ring-farmaguia shadow-md"
                    : "shadow-sm"
                )}
                onClick={() => selectPharmacy(pharmacy.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-farmaguia rounded-full flex items-center justify-center">
                      <Cross className="w-6 h-6 text-white rotate-0" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate pr-2">
                        {pharmacy.nombre}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Abierto
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-gray-400" />
                      {typeof pharmacy.distance === "number" && (
                        <span className="text-xs text-gray-500 mr-3">
                          {(pharmacy.distance / 0.6).toFixed(0)} min
                        </span>
                      )}
                      <span className="text-xs truncate">
                        {pharmacy.direccion}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {hasMore && (
              <div className="pt-4 pb-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50 text-gray-700"
                  onClick={handleLoadMore}
                >
                  Cargar más farmacias ({filtered.length - visibleCount}{" "}
                  restantes)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyList;
