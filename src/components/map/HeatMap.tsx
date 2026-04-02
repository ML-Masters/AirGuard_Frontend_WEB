"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslations } from "next-intl";
import L from "leaflet";
import type { Ville, AQICategory } from "@/lib/types";
import { CAMEROON_CENTER, CAMEROON_ZOOM } from "@/lib/constants";
import { getAQIColor } from "@/lib/utils";
import HeatmapLayer from "./HeatmapLayer";
import "leaflet/dist/leaflet.css";

interface CityAQI {
  ville: Ville;
  indice_aqi: number;
  categorie: AQICategory;
}

interface HeatMapProps {
  cities: CityAQI[];
  height?: string;
}

export default function HeatMap({ cities, height = "400px" }: HeatMapProps) {
  const t = useTranslations("aqi");
  const tMap = useTranslations("map");
  const heatPoints: [number, number, number][] = cities.map((c) => [
    c.ville.latitude,
    c.ville.longitude,
    c.indice_aqi,
  ]);

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden relative" style={{ height }}>
      <MapContainer
        center={CAMEROON_CENTER}
        zoom={CAMEROON_ZOOM}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <HeatmapLayer points={heatPoints} />

        {/* Clickable info icons on top of heatmap */}
        {cities.map((c) => (
          <Marker
            key={c.ville.id}
            position={[c.ville.latitude, c.ville.longitude]}
            icon={L.divIcon({
              className: "",
              html: `<div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0F766E;border:2px solid #0F766E;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.3);">i</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            })}
          >
            <Popup>
              <div className="text-sm min-w-[200px] leading-relaxed">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-gray-500 pr-2 py-0.5">{t("city")}</td>
                      <td className="font-semibold py-0.5">{c.ville.nom}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pr-2 py-0.5">{t("region")}</td>
                      <td className="py-0.5">{c.ville.region_nom}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pr-2 py-0.5">{t("quality")}</td>
                      <td className="font-semibold py-0.5" style={{ color: getAQIColor(c.categorie) }}>
                        {t(c.categorie)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pr-2 py-0.5">{t("aqiIndex")}</td>
                      <td className="font-semibold py-0.5">{c.indice_aqi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/10">
        <p className="text-xs font-semibold text-white mb-2">{tMap("heatmapTitle")}</p>
        <div className="flex items-center gap-0.5">
          <div className="w-7 h-3 rounded-l-sm bg-[#22C55E]" />
          <div className="w-7 h-3 bg-[#EAB308]" />
          <div className="w-7 h-3 bg-[#F97316]" />
          <div className="w-7 h-3 bg-[#EF4444]" />
          <div className="w-7 h-3 rounded-r-sm bg-[#991B1B]" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-300">{t("Bon")}</span>
          <span className="text-[10px] text-gray-300">{t("Dangereux")}</span>
        </div>
      </div>
    </div>
  );
}
