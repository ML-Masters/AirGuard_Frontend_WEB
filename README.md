# AirGuard Dashboard

Tableau de bord web de surveillance de la qualite de l'air au Cameroun.

## Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (graphiques)
- Leaflet + React-Leaflet (carte interactive)
- SWR (data fetching + cache + polling temps reel)
- next-intl (bilingue FR/EN complet)
- Lucide React (icones)

## Fonctionnalites

| Fonctionnalite | Description |
|----------------|-------------|
| Authentification | Connexion JWT + AuthGuard |
| Tableau de bord | KPIs nationaux, graphique 30j, export CSV |
| Carte interactive | Leaflet, 40 villes, heatmap avec legende et points d'info |
| Analytics | Climat vs AQI, top 10, correlation, saisonnier, export CSV |
| Predictions | Page dediee : vue demain + vue semaine par ville |
| Alertes | Brouillons ML, publier/ignorer/modifier, export CSV |
| Rapports | Telechargement PDF + CSV, filtre par ville |
| Chatbot IA | Widget flottant integre |
| Bilingue FR/EN | Traduction complete (next-intl) avec switch de langue |
| SWR polling | Rafraichissement automatique des donnees en temps reel |
| Responsive | Mobile, tablette, desktop |

### Pages supprimees

- ~~Import de donnees~~ (supprime)
- ~~Documentation API~~ (supprime)

## 40 villes couvertes

Le dashboard couvre les 40 villes principales du Cameroun reparties dans 10 regions.

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
