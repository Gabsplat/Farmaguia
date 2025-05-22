// src/components/PharmacyDetail.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import React from "react";
import { usePharmacies } from "../context/PharmacyContext";

export default function PharmacyDetail() {
  const { selected, backToList, userPos } = usePharmacies();
  if (!selected) return null;

  const gmUrl = userPos
    ? `https://www.google.com/maps/dir/?api=1` +
      `&origin=${userPos.lat},${userPos.lng}` +
      `&destination=${selected.lat},${selected.lng}` +
      `&travelmode=driving`
    : null;

  return (
    <div className="md:p-6">
      <Button variant="ghost" size="sm" onClick={backToList} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-teal-600 flex items-center">
            <MapPin className="mr-2 h-6 w-6" /> {selected.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center text-yellow-500">
            <Star className="h-5 w-5 mr-1" />
            <span className="font-medium">{selected.rating}</span>
            <span className="text-gray-500 ml-1">
              ({selected.reviews} reseñas)
            </span>
          </div>

          {selected.website && (
            <div className="flex items-center text-gray-700">
              <ExternalLink className="h-5 w-5 mr-2" />
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {selected.website}
              </a>
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row">
            {/* <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" /> {selected.hours}
            </div> */}
            <div className="flex items-center text-gray-700 mt-2 sm:mt-0">
              <Phone className="h-5 w-5 mr-2" /> {selected.phone}
            </div>
            <Button
              asChild
              variant="outline"
              className="border-teal-600 hover:bg-teal-600 hover:text-white text-teal-600 mt-2 sm:mt-0"
            >
              <a
                href={`https://wa.me/${selected.phone}?text=¡Hola! Tengo una urgencia.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Escribir al Whatsapp
              </a>
            </Button>
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            {selected.services.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>

          {/* <div className="flex items-center space-x-2 flex-wrap">
            {selected.paymentMethods.map((pm) => (
              <Badge key={pm} variant="secondary">
                {pm}
              </Badge>
            ))}
          </div> */}

          <div className="my-8">
            {selected.weeklyHours.map((line) => (
              <div key={line} className="flex items-center text-gray-700">
                <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
                <b className="mr-1">{line.split(" ")[0]}</b>
                {line.split(" ").slice(1).join(" ")}
              </div>
            ))}
          </div>
          {/* <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">
                <Info className="mr-1 h-4 w-4" /> Info
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Calendar className="mr-1 h-4 w-4" /> Horarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <p className="text-gray-700">{selected.description}</p>
            </TabsContent>

            <TabsContent
              value="schedule"
              className="mt-4 space-y-2"
            ></TabsContent>
          </Tabs> */}

          {gmUrl && (
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href={gmUrl} target="_blank" rel="noopener noreferrer">
                  Abrir en Google Maps
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
