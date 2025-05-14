import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import React from "react";
import { usePharmacies } from "../context/PharmacyContext";

const PharmacyDetail = () => {
  const { selected, backToList, filtered, selectPharmacy } = usePharmacies();
  if (!selected) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 p-4 md:p-6">
      <div className="flex items-center mb-4 md:mb-6">
        <Button variant="ghost" size="sm" onClick={backToList} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-teal-600 flex-1 truncate">
          {selected.name}
        </h1>
      </div>
      {/* rest of detail UI unchanged, just swap selectedPharmacyData for selected */}
    </div>
  );
};

export default PharmacyDetail;
