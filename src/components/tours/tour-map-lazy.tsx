"use client";

import dynamic from "next/dynamic";
import type { Coordinates } from "@/types/database";

// mapbox-gl pesa ~200KB+ gz. Lo cargamos solo en cliente y bajo demanda
// (ssr:false no se permite en Server Components → por eso este wrapper cliente).
const TourMap = dynamic(
  () => import("./tour-map").then((m) => m.TourMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-2xl bg-night/5 animate-pulse" />
    ),
  }
);

export function TourMapLazy(props: { coordinates: Coordinates; title: string }) {
  return <TourMap {...props} />;
}
