import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Platform from "@/components/landing/Platform";
import Download from "@/components/landing/Download";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-white overflow-x-hidden">
      <LandingHeader />
      <Hero />
      <Stats />
      <Problem />
      <Solution />
      <Platform />
      <Download />
      <Footer />
    </main>
  );
}
