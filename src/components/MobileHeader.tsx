// src/components/MobileHeader.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { usePharmacies } from "../context/PharmacyContext";
import { chains } from "../data/pharmacies";

export default function MobileHeader() {
  const { searchTerm, setSearchTerm, selectedChain, setSelectedChain } =
    usePharmacies();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div className="w-full bg-white p-3 shadow-md">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Ingresar localidad"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          Ir
        </Button>
        <Select
          value={selectedChain}
          onValueChange={setSelectedChain}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cadena" />
          </SelectTrigger>
          <SelectContent>
            {chains.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </div>
  );
}
