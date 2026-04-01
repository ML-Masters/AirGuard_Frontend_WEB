export interface Region {
  id: number;
  nom: string;
}

export interface Ville {
  id: number;
  nom: string;
  region: number;
  region_nom: string;
  latitude: number;
  longitude: number;
}

export interface AirQuality {
  id: number;
  ville: number;
  date_cible: string;
  valeur_pm25: number;
  indice_aqi: number;
  categorie: AQICategory;
  est_prediction: boolean;
  facteurs_aggravants: Record<string, unknown> | null;
}

export type AQICategory =
  | "Bon"
  | "Modere"
  | "Sensible"
  | "Malsain"
  | "Tres_malsain"
  | "Dangereux";

export interface NationalKPIs {
  date: string;
  aqi_moyen_national: number;
  nombre_villes_critiques: number;
  total_villes_scannees: number;
  message?: string;
}

export interface Alert {
  id: number;
  ville: number;
  date_creation: string;
  niveau_severite: "modere" | "grave" | "critique";
  message_fr: string;
  message_en: string;
  est_active: boolean;
}

export interface Meteo {
  id: number;
  ville: number;
  date: string;
  temperature_2m_max: number | null;
  temperature_2m_min: number | null;
  temperature_2m_mean: number | null;
  apparent_temperature_max: number | null;
  apparent_temperature_min: number | null;
  apparent_temperature_mean: number | null;
  weather_code: number | null;
  precipitation_sum: number | null;
  rain_sum: number | null;
  snowfall_sum: number | null;
  precipitation_hours: number | null;
  wind_speed_10m_max: number | null;
  wind_gusts_10m_max: number | null;
  wind_direction_10m_dominant: number | null;
  daylight_duration: number | null;
  sunshine_duration: number | null;
  shortwave_radiation_sum: number | null;
  et0_fao_evapotranspiration: number | null;
}

export interface PredictionResult {
  ville: string;
  predictions: {
    qualite_air: {
      pm25_proxy_ugm3: number;
      aqi_estime: number;
      categorie: string;
      alerte_couleur: string;
    };
    chaleur_sante: {
      heat_index_ressenti: number;
      chaleur_extreme_0_10: number;
      avertissement: "Danger" | "Normal";
    };
    risques_naturels: {
      stress_hydrique_agricole: number;
      risque_inondation_0_10: number;
      categorie_inondation: string;
    };
  };
}

export interface ChatResponse {
  response: string;
  source: string;
}
