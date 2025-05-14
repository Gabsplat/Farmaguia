// src/components/PharmacyCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pharmacy } from "../types/index";

interface Props {
  pharmacy: Pharmacy;
  isSelected: boolean;
  onSelect: (id: number) => void;
  distance?: number;
}

export default function PharmacyCard({ pharmacy, isSelected, onSelect, distance }: Props) {
  return (
    <Card
      onClick={() => onSelect(pharmacy.id)}
      className={cn(
        "cursor-pointer hover:shadow-lg transition-shadow",
        isSelected && "ring-2 ring-teal-500"
      )}
    >
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
        <span className="text-sm text-gray-500">{pharmacy.hours}</span>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="mr-2 h-4 w-4" />
          {pharmacy.address}
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="mr-2 h-4 w-4" />
          {pharmacy.phone}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <Badge variant={pharmacy.isOpen ? "default" : "destructive"}>
          {pharmacy.isOpen ? "Abierto" : "Cerrado"}
        </Badge>

        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 text-yellow-400" />
          {pharmacy.rating} <span className="text-xs text-gray-500 ml-1">({pharmacy.reviews})</span>
        </div>

        {distance != null && (
          <span className="text-sm text-gray-700">~{distance.toFixed(1)} km</span>
        )}
      </CardFooter>
    </Card>
  );
}
