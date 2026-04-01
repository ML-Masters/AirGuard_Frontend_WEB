# AirGuard Cameroun — Roadmap du projet

## Etat du projet

### Backend API (Django + PostgreSQL)
| Fonctionnalite | Statut |
|----------------|--------|
| API REST (CRUD villes, regions, meteo, air quality) | Fait |
| PostgreSQL 16 avec Docker | Fait |
| Auth JWT (access 1h / refresh 7j) | Fait |
| 5 modeles ML charges (PM2.5, chaleur, inondation...) | Fait |
| Predictions multi-risques depuis donnees DB | Fait |
| Chatbot IA (OpenAI) | Fait |
| Import dataset avec progression SSE | Fait |
| Alertes automatiques ML (brouillon/publier/ignorer) | Fait |
| Recommandations residents vs visiteurs | Fait |
| Rapport PDF professionnel | Fait |
| Notifications push Firebase | Fait |
| Documentation Swagger/ReDoc | Fait |
| CI/CD GitHub Actions | Fait |
| Deploiement VPS + SSL | Fait |
| 87 240 donnees reelles importees | Fait |

### Dashboard Next.js
| Page | Statut |
|------|--------|
| Login (JWT auth) | Fait |
| Tableau de bord (KPIs, carte, alertes, graphique 30j) | Fait |
| Carte interactive (Leaflet, markers, popups) | Fait |
| Analytics (climat vs AQI, top 10, correlation, saisonnier) | Fait |
| Predictions ML (selecteur ville, 3 risques, graphique) | Fait |
| Alertes (brouillons ML, publier/ignorer/modifier, table, timeline) | Fait |
| Rapports (telechargement PDF) | Fait |
| Import donnees (drag & drop, progression temps reel) | Fait |
| API Docs (Swagger integre) | Fait |
| ChatWidget flottant | Fait |
| AuthGuard + deconnexion | Fait |
| Loading skeletons | Fait |
| Favicon custom | Fait |
| CI/CD GitHub Actions | Fait |
| Deploiement VPS + SSL | Fait |

### ML Notebook
| Fonctionnalite | Statut |
|----------------|--------|
| EDA + nettoyage | Fait |
| Feature engineering (53 features) | Fait |
| 4 algorithmes compares (XGBoost, LightGBM, RF, MLP) | Fait |
| 5 modeles exportes (.joblib) | Fait |
| Analyse SHAP | Fait |
| 13 visualisations | Fait |
| Requirements.txt | Fait |

## Ce qui reste

### Obligatoire pour la soumission
- [ ] App Mobile Kotlin KMP (non commencee)
- [ ] Pitch deck (5-7 slides PDF)
- [ ] Video demo (3 min max)

### Ameliorations optionnelles
- [ ] Bilingue FR/EN actif dans le dashboard (fichiers prets, pas branche)
- [ ] Export CSV depuis le dashboard
- [ ] Postgres local Windows (bug psycopg2 + Python 3.14)

## URLs de production

| Service | URL |
|---------|-----|
| Dashboard | https://airguard-cm.duckdns.org |
| API | https://api.airguard-cm.duckdns.org |
| Swagger | https://api.airguard-cm.duckdns.org/api/docs/ |

## Repos GitHub

| Repo | Contenu |
|------|---------|
| ML-Masters/AirGuard_Backend | Backend Django + modeles ML |
| ML-Masters/AirGuard_Frontend_WEB | Dashboard Next.js |
| ML-Masters/AirGuard_ML (?) | Notebook ML |

## Equipe

**ML Masters** — Hackathon IndabaX Cameroon 2026
