"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = (L as unknown as { heatLayer: (points: [number, number, number][], opts: Record<string, unknown>) => L.Layer }).heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 300,
      gradient: {
        0.0: "#22C55E",
        0.25: "#EAB308",
        0.5: "#F97316",
        0.75: "#EF4444",
        1.0: "#991B1B",
      },
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}
