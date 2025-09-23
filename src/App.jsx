import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import pages
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import shared components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Import individual components for dedicated pages
import AboutSection from "./components/AboutSection";
import SimulationPanel from "./components/SimulationPanel";
import OrbitalVisualization from "./components/OrbitalVisualization";
import ImpactDataChart from "./components/ImpactDataChart";
import MitigationStrategies from "./components/MitigationStrategies";
import GameMode from "./components/GameMode";
import EducationalContent from "./components/EducationalContent";

const queryClient = new QueryClient();

// Dedicated page for About
const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <div className="pt-8">
      <AboutSection />
    </div>
  </div>
);

// Simulation Page with asteroid parameters and simulation data state
const SimulationPage = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [asteroidParams, setAsteroidParams] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Called by SimulationPanel when simulation finishes
  const handleSimulationStart = (data) => {
    setIsSimulating(true);
    setSimulationData(data);
    setTimeout(() => setIsSimulating(false), 10000);
  };

  // Called by SimulationPanel when asteroid params change
  const handleParamsChange = (params) => {
    setAsteroidParams(params);
  };

  // Example: Direct use of setAsteroidParams to show it's not just for passing to children
  // This can be removed in production, it's just to avoid lint errors and help debugging
  const handleSetDefaultAsteroid = () => {
    setAsteroidParams({
      size: 50,
      velocity: 25,
      composition: "rocky"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-quantum-blue">
                Asteroid Impact Simulator
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Configure asteroid parameters and witness the potential consequences of cosmic impacts
            </p>
          </div>

          <div className="mb-6">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={handleSetDefaultAsteroid}
            >
              Set Example Asteroid Params (Demo)
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Current asteroidParams: {asteroidParams ? JSON.stringify(asteroidParams) : "none"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4 xl:col-span-4">
              <div className="sticky top-20 lg:top-24">
                <SimulationPanel
                  onSimulationComplete={handleSimulationStart}
                  onParamsChange={handleParamsChange}
                />
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-8 space-y-6 lg:space-y-8">
              <OrbitalVisualization
                params={asteroidParams}
                isSimulating={isSimulating}
              />
              <ImpactDataChart data={simulationData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Defense Page using asteroidParams (but with no update mechanism here)
const DefensePage = () => {
  // Remove the local state from DefensePage to avoid duplicate setAsteroidParams.
  // Instead, you should consider passing asteroidParams from the parent if needed.
  // For now, since it is not being updated here, just pass null.
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-mission-green">
                Planetary Defense Systems
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced mitigation technologies to deflect incoming asteroids and protect Earth
            </p>
          </div>
          <MitigationStrategies asteroidParams={null} />
        </div>
      </section>
    </div>
  );
};

// Mission Control Page
const MissionControlPage = () => (
  <div className="min-h-screen bg-background">
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-plasma-orange">
              Mission Control Center
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive command center for asteroid threat scenarios and defense coordination
          </p>
        </div>
        <GameMode />
      </div>
    </section>
  </div>
);

// Education Page
const EducationPage = () => (
  <div className="min-h-screen bg-background">
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-stellar-cyan">
              Asteroid Science Hub
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive education on asteroid science, impact physics, and planetary defense strategies
          </p>
        </div>
        <EducationalContent />
      </div>
    </section>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/Meteor-Madness">
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/defense" element={<DefensePage />} />
              <Route path="/mission-control" element={<MissionControlPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/demo" element={<Index />} />
              <Route path="/all-in-one" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;