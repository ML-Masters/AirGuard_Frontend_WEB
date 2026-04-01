import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AirGuard Cameroun",
  description:
    "Plateforme de surveillance et prediction de la qualite de l'air au Cameroun. IA, predictions multi-risques et alertes en temps reel pour 40 villes.",
  openGraph: {
    title: "AirGuard Cameroun",
    description:
      "Surveillance et prediction de la qualite de l'air au Cameroun par intelligence artificielle.",
    siteName: "AirGuard Cameroun",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary",
    title: "AirGuard Cameroun",
    description:
      "Surveillance et prediction de la qualite de l'air au Cameroun par intelligence artificielle.",
  },
  icons: {
    icon: "/icon.svg",
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
