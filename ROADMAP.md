# AirGuard Dashboard Next.js — Roadmap d'implémentation

## Contexte
Le backend Django est live sur https://api.airguard-cm.duckdns.org.
Le dashboard admin Next.js sera hébergé sur `airguard-cm.duckdns.org`.

## Stack technique
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design system custom)
- React-Leaflet (cartes interactives)
- Recharts (graphiques)
- next-intl (i18n FR/EN)
- SWR (data fetching)
- Lucide React (icônes)

## Design System

### Couleurs principales
| Rôle | Hex |
|------|-----|
| Primary | `#0F766E` |
| Primary Light | `#14B8A6` |
| Primary Dark | `#134E4A` |
| Background | `#F0FDFA` |
| Surface | `#FFFFFF` |
| Texte | `#1E293B` |
| Texte secondaire | `#64748B` |
| Bordures | `#E2E8F0` |

### Couleurs AQI
| Niveau | Hex |
|--------|-----|
| Bon (0-50) | `#22C55E` |
| Modéré (51-100) | `#EAB308` |
| Sensible (101-150) | `#F97316` |
| Malsain (151-200) | `#EF4444` |
| Très malsain (201-300) | `#8B5CF6` |
| Dangereux (300+) | `#881337` |

### Typographie
- Police : Inter (Google Fonts)
- Border-radius : 16px

## Structure du projet

```
airguard-dashboard/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Sidebar + IntlProvider
│   │   │   ├── page.tsx            # Redirect → /admin
│   │   │   └── admin/
│   │   │       ├── page.tsx        # Dashboard home
│   │   │       ├── map/page.tsx
│   │   │       ├── analytics/page.tsx
│   │   │       ├── predictions/page.tsx
│   │   │       ├── alerts/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       └── api-docs/page.tsx
│   │   ├── layout.tsx              # Root HTML
│   │   └── page.tsx                # Redirect → /fr/admin
│   ├── components/
│   │   ├── layout/  (Sidebar, TopBar, LocaleSwitcher)
│   │   ├── ui/      (KPICard, AQIBadge, SeverityBadge, PageHeader, LoadingSkeleton)
│   │   ├── charts/  (AQILineChart, AQIBarChart, CorrelationHeatmap)
│   │   ├── map/     (MapContainer, CityMarker, HeatLayer, MapLegend)
│   │   └── chat/    (ChatWidget)
│   ├── lib/
│   │   ├── api.ts        # Fetch wrapper, base URL
│   │   ├── types.ts      # Interfaces TypeScript
│   │   ├── constants.ts  # Couleurs AQI, coordonnées Cameroun
│   │   └── utils.ts      # getAQIColor(), formatDate()
│   ├── hooks/   (useVilles, useAirQuality, useAlerts, useMeteo, useKPIs)
│   └── i18n/    (messages/fr.json, messages/en.json)
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

## Phases d'implémentation

### Phase 1 — Fondations + Dashboard Home
**Objectif** : App deployable avec la page principale complète

- [ ] Init Next.js + dépendances
- [ ] Tailwind config avec tokens design system
- [ ] `lib/types.ts` — Interfaces TypeScript
- [ ] `lib/api.ts` — Fetch wrapper
- [ ] `lib/constants.ts` + `lib/utils.ts`
- [ ] Layout : Sidebar + TopBar
- [ ] **Page /admin** :
  - [ ] 4 KPI cards (AQI moyen, villes critiques, total villes, alertes actives)
  - [ ] Mini-carte Leaflet (40 villes colorées par AQI)
  - [ ] Table des 5 alertes actives récentes
  - [ ] Graphique AQI 30 jours (Recharts AreaChart)

### Phase 2 — Carte interactive + Analytics
- [ ] **Page /admin/map** :
  - [ ] Carte plein écran + CircleMarkers + popups
  - [ ] HeatLayer (leaflet.heat)
  - [ ] Panel filtres (région, catégorie, date)
  - [ ] Légende AQI
- [ ] **Page /admin/analytics** :
  - [ ] Graphique climat vs AQI (dual Y-axis)
  - [ ] Top 10 villes polluées (BarChart)
  - [ ] Tendances multi-villes (LineChart)
  - [ ] Matrice corrélation
  - [ ] Analyse saisonnière

### Phase 3 — Prédictions + Alertes + Reports
- [ ] **Page /admin/predictions** :
  - [ ] Sélecteur de ville
  - [ ] 7 cards prédiction jour/jour
  - [ ] Graphique historique + prédictions
  - [ ] 3 cards risques (air, chaleur, inondation)
  - [ ] Panel simulation météo
- [ ] **Page /admin/alerts** :
  - [ ] 3 stats cards
  - [ ] Table paginée + filtres
  - [ ] Timeline alertes/jour
- [ ] **Page /admin/reports** :
  - [ ] Téléchargement PDF
  - [ ] Export CSV
- [ ] **Page /admin/api-docs** :
  - [ ] iframe Swagger

### Phase 4 — Polish
- [ ] Traductions anglaises
- [ ] Loading skeletons
- [ ] ChatWidget flottant
- [ ] Responsive mobile
- [ ] Micro-animations

## Points techniques
- **Leaflet SSR** : Toujours `dynamic(() => import(...), { ssr: false })`
- **CORS** : Backend autorise tous les origins
- **Recharts** : Toujours dans `<ResponsiveContainer>`
- **Couleurs AQI** : Via `getAQIColor()`, jamais hardcodées
- **SWR** : Hooks custom dans `/hooks/`

## Vérification
- [ ] `npm run dev` — toutes les pages OK
- [ ] Dashboard affiche les KPIs depuis l'API live
- [ ] Carte affiche les 40 villes
- [ ] Graphiques avec données réelles
- [ ] PDF téléchargeable
- [ ] Switcher FR/EN fonctionnel
- [ ] Deploy sur airguard-cm.duckdns.org
