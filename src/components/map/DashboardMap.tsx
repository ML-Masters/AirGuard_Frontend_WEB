"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useTranslations } from "next-intl";
import type { Ville, AQICategory } from "@/lib/types";
import { CAMEROON_CENTER, CAMEROON_ZOOM } from "@/lib/constants";
import { getAQIColor } from "@/lib/utils";
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

const AQI_ADVICE_KEYS: Record<string, string> = {
  Bon: "adviceBon",
  Modere: "adviceModere",
  Sensible: "adviceSensible",
  Malsain: "adviceMalsain",
  Tres_malsain: "adviceTresMalsain",
  Dangereux: "adviceDangereux",
};

export default function DashboardMap({ cities, height = "400px" }: DashboardMapProps) {
  const t = useTranslations("aqi");
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
                <p className="text-xs mt-2 text-gray-600 italic border-t border-gray-100 pt-2">
                  {AQI_ADVICE_KEYS[c.categorie] ? t(AQI_ADVICE_KEYS[c.categorie]) : ""}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-800 mb-2">{t("airQuality")}</p>
        <div className="space-y-1">
          {[
            { color: "#22C55E", key: "legendBon" },
            { color: "#EAB308", key: "legendModere" },
            { color: "#F97316", key: "legendSensible" },
            { color: "#EF4444", key: "legendMalsain" },
            { color: "#7C3AED", key: "legendTresMalsain" },
            { color: "#991B1B", key: "legendDangereux" },
          ].map((item) => (
            <div key={item.color} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-gray-700">{t(item.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
