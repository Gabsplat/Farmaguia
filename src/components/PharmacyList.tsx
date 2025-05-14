import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Phone, Search, Star } from "lucide-react";
import React from "react";
import { usePharmacies } from "../context/PharmacyContext";
import { chains } from "../data/pharmacies";

const PharmacyList = () => {
  const {
    filtered,
    selected,
    selectPharmacy,
    searchTerm,
    setSearchTerm,
    selectedChain,
    setSelectedChain,
  } = usePharmacies();

  const handleSubmit = (e: React.FormEvent) => e.preventDefault();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4 md:mb-6">
              Farma guía
            </h1>

            <form onSubmit={handleSearch} className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Ingresar una localidad"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 sm:w-auto w-full"
                >
                  Buscar
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 uppercase font-medium">
                  Filtrar por
                </span>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cadena" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
        </div>
        {filtered.map((pharmacy) => (
          <div
            id={`pharmacy-${pharmacy.id}`}
            key={pharmacy.id}
            className={cn(
              "border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
              selected?.id === pharmacy.id ? "ring-2 ring-teal-500" : "",
              pharmacy.isOpen
                ? "border-l-4 border-l-green-500"
                : "border-l-4 border-l-red-500"
            )}
            onClick={() => selectPharmacy(pharmacy.id)}
          >
            <div className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <h3 className="text-base md:text-lg font-semibold">
                  {pharmacy.name}
                </h3>
                <div className="flex items-center text-gray-600 mt-1 sm:mt-0">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{pharmacy.hours}</span>
                </div>
              </div>

              <div className="space-y-1 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    {pharmacy.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm md:text-base">{pharmacy.phone}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    pharmacy.isOpen
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {pharmacy.isOpen ? "Abierto" : "Cerrado"}
                </span>

                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{pharmacy.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({pharmacy.reviews})
                  </span>
                </div>
              </div>
                {typeof pharmacy.distance === "number" && (
              <div className="mt-2 text-sm text-gray-700">
                ~{pharmacy.distance.toFixed(1)} km
              </div>
            )}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default PharmacyList;
