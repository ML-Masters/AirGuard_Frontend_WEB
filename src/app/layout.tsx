import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://airguard-cm.duckdns.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AirGuard Cameroun - Surveillance et prédiction de la qualité de l'air",
  description:
    "Plateforme IA de surveillance et prédiction de la qualité de l'air dans 40 villes du Cameroun. Alertes en temps réel, prédictions multi-risques et conseils santé personnalisés.",
  openGraph: {
    title: "AirGuard Cameroun - Surveillance IA de la qualité de l'air",
    description:
      "Surveillance et prédiction de la qualité de l'air au Cameroun par intelligence artificielle. 40 villes, 5 modèles ML, notifications push.",
    url: siteUrl,
    siteName: "AirGuard Cameroun",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AirGuard Cameroun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirGuard Cameroun - Surveillance IA de la qualité de l'air",
    description:
      "Surveillance et prédiction de la qualité de l'air au Cameroun par intelligence artificielle.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
