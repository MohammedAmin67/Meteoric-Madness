import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SimulationPanel from "@/components/SimulationPanel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SimulationPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
