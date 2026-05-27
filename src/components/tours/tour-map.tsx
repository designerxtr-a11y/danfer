"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import type { Coordinates } from "@/types/database";

interface Props {
  coordinates: Coordinates;
  title: string;
}

export function TourMap({ coordinates, title }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="rounded-2xl border border-dashed border-night/15 bg-stone p-10 text-center">
        <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
        <p className="text-night/60 text-sm">
          Mapa pendiente — añade{" "}
          <code className="bg-white px-1.5 py-0.5 rounded text-xs">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          en tu .env.local (gratis en mapbox.com)
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-night/8 shadow-soft h-[400px]">
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: coordinates.zoom ?? 13,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <Marker
          longitude={coordinates.lng}
          latitude={coordinates.lat}
          anchor="bottom"
        >
          <div className="relative">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold" />
            <div className="relative bg-gold text-white px-3 py-2 rounded-xl shadow-glow flex items-center gap-1.5">
              <MapPin className="w-4 h-4 fill-white text-white" />
              <span className="text-xs font-medium">{title}</span>
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
