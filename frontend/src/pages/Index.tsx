import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SimulationPanel from "@/components/SimulationPanel";
import OrbitalVisualization from "@/components/OrbitalVisualization";
import ImpactDataChart from "@/components/ImpactDataChart";
import MitigationStrategies from "@/components/MitigationStrategies";
import GameMode from "@/components/GameMode";
import EducationalContent from "@/components/EducationalContent";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [asteroidParams, setAsteroidParams] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <SimulationPanel 
              onSimulationComplete={setSimulationData}
              onParamsChange={setAsteroidParams}
            />
            <div className="space-y-8">
              <OrbitalVisualization params={asteroidParams} />
              <ImpactDataChart data={simulationData} />
            </div>
          </div>
        </div>
        <MitigationStrategies asteroidParams={asteroidParams} />
        <GameMode />
        <EducationalContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
