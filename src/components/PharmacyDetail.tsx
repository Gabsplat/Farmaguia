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
import { capitalizeWords, cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CornerUpLeft,
  ExternalLink,
  Info,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  PhoneCall,
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
      `&destination=${selected.latitud},${selected.longitud}` +
      `&travelmode=driving`
    : null;

  return (
    <div className="md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-teal-600 flex justify-between items-center">
            <span className="flex items-center">
              <MapPin className="mr-2 h-6 w-6" />{" "}
              {capitalizeWords(selected.nombre)}
            </span>
            <button
              className="cursor-pointer rounded-full h-10 w-10 flex items-center justify-center"
              onClick={backToList}
            >
              <CornerUpLeft className="h-8 w-8" />
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 -mt-2">
          <div className="flex items-center text-yellow-500">
            <Star className="h-5 w-5 mr-1" />
            <span className="font-medium">{selected.review}</span>
            <span className="text-gray-500 ml-1">
              ({selected.comentarios} reseñas)
            </span>
          </div>

          {selected.sitio_web && (
            <div className="flex items-center text-gray-700">
              <ExternalLink className="h-5 w-5 mr-2" />
              <a
                href={selected.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {selected.sitio_web}
              </a>
            </div>
          )}

          <div className="flex flex-wrap flex-col gap-4 md:flex-row">
            {/* <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" /> {selected.hours}
            </div> */}
            <div className="flex items-center text-gray-700 mt-2 sm:mt-0">
              <Phone className="h-5 w-5 mr-2" /> {selected.telefono}
            </div>
            <Button
              asChild
              variant="outline"
              className="border-teal-600 hover:bg-teal-600 hover:text-white text-teal-600 mt-2 sm:mt-0"
            >
              <a
                href={`https://wa.me/${selected.telefono}?text=¡Hola! Tengo una urgencia.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PhoneCall className="h-4 w-4" /> ¡Llamar ahora!
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-teal-600 hover:bg-teal-600 hover:text-white text-teal-600 mt-2 sm:mt-0"
            >
              <a
                href={`https://wa.me/${selected.telefono}?text=¡Hola! Tengo una urgencia.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Escribir al Whatsapp
              </a>
            </Button>
          </div>

          {/* <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="outline">
                {selected.lunes}
              </Badge>
          </div> */}

          {/* <div className="flex items-center space-x-2 flex-wrap">
            {selected.paymentMethods.map((pm) => (
              <Badge key={pm} variant="secondary">
                {pm}
              </Badge>
            ))}
          </div> */}

          <div className="my-8 text-gray-700">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              HORARIOS
            </h2>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Lunes</b>
              {selected.lunes}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Martes</b>
              {selected.martes}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Miercoles</b>
              {selected.miercoles}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Jueves</b>
              {selected.jueves}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Viernes</b>
              {selected.viernes}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Sabado</b>
              {selected.sabado}
            </div>
            <div className="flex items-center ">
              <Navigation className="h-4 w-4 mr-2 rotate-45" />{" "}
              <b className="mr-1">Domingo</b>
              {selected.domingo}
            </div>
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
            <div className="flex justify-end mt-4">
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
