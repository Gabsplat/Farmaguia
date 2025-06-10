import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { capitalizeWords, cn, formatPhoneNumber } from "@/lib/utils";
import {
  Clock,
  CornerUpLeft,
  ExternalLink,
  MessageCircle,
  Navigation,
  Phone,
  PhoneCall,
  Star,
  Globe,
  Map,
  Cross,
} from "lucide-react";
import { usePharmacies } from "../context/PharmacyContext";
import useMobile from "@/hooks/useMobile";

export default function PharmacyDetail() {
  const { selected, backToList, userPos } = usePharmacies();
  const isMobile = useMobile();

  if (!selected) return null;

  const gmUrl = userPos
    ? `https://www.google.com/maps/dir/?api=1` +
      `&origin=${userPos.lat},${userPos.lng}` +
      `&destination=${selected.latitud},${selected.longitud}` +
      `&travelmode=driving`
    : null;

  const scheduleItems = [
    { day: "Lunes", hours: selected.lunes },
    { day: "Martes", hours: selected.martes },
    { day: "Miércoles", hours: selected.miercoles },
    { day: "Jueves", hours: selected.jueves },
    { day: "Viernes", hours: selected.viernes },
    { day: "Sábado", hours: selected.sabado },
    { day: "Domingo", hours: selected.domingo },
  ];

  return (
    <div className={cn("space-y-4", isMobile ? "pb-6" : "p-6")}>
      {/* Header Card */}
      <Card className="border-0 shadow-sm gap-0">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-farmaguia/10 rounded-full flex items-center justify-center mr-3">
                  <Cross className="w-5 h-5 text-farmaguia" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {capitalizeWords(selected.nombre)}
                  </h1>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-700">
                      {selected.review}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({selected.comentarios} reseñas)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={backToList}
              className="rounded-full w-10 h-10 p-0"
            >
              <CornerUpLeft className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              <span className="font-medium">{selected.telefono}</span>
            </div>

            {selected.sitio_web && (
              <div className="flex items-center text-gray-700">
                <Globe className="w-5 h-5 mr-3 text-gray-400" />
                <a
                  href={selected.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-farmaguia hover:underline flex items-center"
                >
                  Sitio web
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              asChild
              className="bg-farmaguia hover:bg-farmaguia-foreground text-white"
            >
              <a
                href={`tel:${selected.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Llamar ahora
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-farmaguia text-farmaguia hover:bg-farmaguia/5"
            >
              <a
                href={`https://wa.me/${formatPhoneNumber(
                  selected.telefono
                )}?text=¡Hola! Tengo una urgencia.`}
                target="_blank"
                className="hover:text-farmaguia-foreground"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2 " />
                WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Card */}
      {gmUrl && (
        <Card className="border-0 shadow-sm gap-2">
          <CardHeader className="pb-3">
            <div className="flex items-center pb-0">
              <Map className="w-5 h-5 mr-2 text-farmaguia" />
              <h2 className="text-lg font-semibold text-gray-900">
                Como llegar
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full border-gray-200 hover:border-farmaguia hover:bg-farmaguia hover:text-white"
            >
              <a href={gmUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-2" />
                Abrir en Google Maps
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Schedule Card */}
      <Card className="border-0 shadow-sm gap-0">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-farmaguia" />
            <h2 className="text-lg font-semibold text-gray-900">Horarios</h2>
          </div>
        </CardHeader>

        {scheduleItems.every((item) => !item.hours) ? (
          <CardContent className="text-center text-gray-500">
            Horario no disponible
          </CardContent>
        ) : (
          <CardContent>
            <div className="space-y-3">
              {scheduleItems.map((item, index) => (
                <div key={item.day}>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-700 text-sm">
                      {item.day}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {item.hours || "Cerrado"}
                    </span>
                  </div>
                  {index < scheduleItems.length - 1 && (
                    <Separator className="bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
