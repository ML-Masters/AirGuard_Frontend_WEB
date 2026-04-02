# AirGuard Dashboard

Tableau de bord web de surveillance de la qualite de l'air au Cameroun.

## Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (graphiques)
- Leaflet + React-Leaflet (carte interactive)
- SWR (data fetching + cache)
- next-intl (bilingue FR/EN)
- Lucide React (icones)

## Fonctionnalites

- Connexion JWT + authentification
- Tableau de bord avec KPIs nationaux
- Carte interactive des 40 villes (Leaflet)
- Analytics (climat vs AQI, top 10, correlation, saisonnier)
- Predictions ML par ville (3 risques)
- Gestion des alertes (brouillon/publier/ignorer)
- Chatbot IA flottant
- Rapport PDF telechargeable
- Import de donnees (drag & drop + progression SSE)
- Export CSV (dashboard, alertes, analytics)
- Documentation API integree (Swagger)
- Bilingue FR/EN avec switch de langue
- Responsive (mobile, tablette, desktop)

## Installation

```bash
git clone https://github.com/ML-Masters/AirGuard_Frontend_WEB.git
cd AirGuard_Frontend_WEB
npm install
npm run dev
```

## Deploiement

- CI/CD GitHub Actions
- VPS + SSL
- URL : https://airguard-cm.duckdns.org

## Equipe

ML Masters — Hackathon IndabaX Cameroun 2026
