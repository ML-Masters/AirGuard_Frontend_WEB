"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { Ville, AQICategory } from "@/lib/types";
import { CAMEROON_CENTER, CAMEROON_ZOOM } from "@/lib/constants";
import { getAQIColor, getAQILabel } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

interface CityAQI {
  ville: Ville;
  indice_aqi: number;
  categorie: AQICategory;
}

interface DashboardMapProps {
  cities: CityAQI[];
  height?: string;
}

export default function DashboardMap({ cities, height = "400px" }: DashboardMapProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden" style={{ height }}>
      <MapContainer
        center={CAMEROON_CENTER}
        zoom={CAMEROON_ZOOM}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {cities.map((c) => (
          <CircleMarker
            key={c.ville.id}
            center={[c.ville.latitude, c.ville.longitude]}
            radius={Math.max(6, Math.min(c.indice_aqi / 10, 20))}
            pathOptions={{
              color: getAQIColor(c.categorie),
              fillColor: getAQIColor(c.categorie),
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{c.ville.nom}</p>
                <p className="text-xs text-gray-500">{c.ville.region_nom}</p>
                <p className="mt-1">
                  AQI: <strong>{c.indice_aqi}</strong>
                </p>
                <p style={{ color: getAQIColor(c.categorie) }}>
                  {getAQILabel(c.categorie)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
