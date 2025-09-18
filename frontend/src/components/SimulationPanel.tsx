import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  Globe2, 
  Activity,
  Waves,
  Mountain,
  Info
} from "lucide-react";
import { simulateAsteroid } from "@/services/mockApi";

interface SimulationResults {
  kineticEnergy: number;
  craterSize: number;
  earthquakeMagnitude: number;
  tsunamiRisk: string;
  impactLocation: {
    lat: number;
    lng: number;
    region: string;
  };
  damage: {
    casualties: number;
    economicLoss: number;
    affectedArea: number;
  };
}

interface SimulationPanelProps {
  onSimulationComplete?: (data: SimulationResults) => void;
  onParamsChange?: (params: any) => void;
}

const SimulationPanel = ({ onSimulationComplete, onParamsChange }: SimulationPanelProps) => {
  const [asteroidParams, setAsteroidParams] = useState({
    size: "100",
    velocity: "20",
    density: "2.5",
    composition: "rock",
    angle: "45"
  });

  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulationData = await simulateAsteroid(asteroidParams);
      setResults(simulationData);
      onSimulationComplete?.(simulationData);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onParamsChange?.(asteroidParams);
  }, [asteroidParams, onParamsChange]);

  const handleReset = () => {
    setResults(null);
    setAsteroidParams({
      size: "100",
      velocity: "20",
      density: "2.5",
      composition: "rock",
      angle: "45"
    });
  };

  const getRiskLevel = (magnitude: number) => {
    if (magnitude < 6) return { level: "Low", color: "bg-success" };
    if (magnitude < 7) return { level: "Moderate", color: "bg-cosmic-orange" };
    return { level: "Catastrophic", color: "bg-destructive" };
  };

  return (
    <section id="simulation" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
              Asteroid Impact Simulator
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Configure asteroid parameters and witness the potential consequences of cosmic impacts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Asteroid Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size */}
              <div className="space-y-2">
                <Label htmlFor="size" className="flex items-center space-x-2">
                  <span>Size (meters)</span>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Input
                  id="size"
                  type="number"
                  value={asteroidParams.size}
                  onChange={(e) => setAsteroidParams(prev => ({ ...prev, size: e.target.value }))}
                  className="bg-background/50"
                />
              </div>

              {/* Velocity */}
              <div className="space-y-2">
                <Label htmlFor="velocity">Velocity (km/s)</Label>
                <Input
                  id="velocity"
                  type="number"
                  step="0.1"
                  value={asteroidParams.velocity}
                  onChange={(e) => setAsteroidParams(prev => ({ ...prev, velocity: e.target.value }))}
                  className="bg-background/50"
                />
              </div>

              {/* Density */}
              <div className="space-y-2">
                <Label htmlFor="density">Density (g/cm³)</Label>
                <Input
                  id="density"
                  type="number"
                  step="0.1"
                  value={asteroidParams.density}
                  onChange={(e) => setAsteroidParams(prev => ({ ...prev, density: e.target.value }))}
                  className="bg-background/50"
                />
              </div>

              {/* Composition */}
              <div className="space-y-2">
                <Label htmlFor="composition">Composition</Label>
                <Select 
                  value={asteroidParams.composition} 
                  onValueChange={(value) => setAsteroidParams(prev => ({ ...prev, composition: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rock">Rocky</SelectItem>
                    <SelectItem value="metal">Metallic</SelectItem>
                    <SelectItem value="ice">Icy</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Approach Angle */}
              <div className="space-y-2">
                <Label htmlFor="angle">Approach Angle (degrees)</Label>
                <Input
                  id="angle"
                  type="number"
                  min="0"
                  max="90"
                  value={asteroidParams.angle}
                  onChange={(e) => setAsteroidParams(prev => ({ ...prev, angle: e.target.value }))}
                  className="bg-background/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  onClick={handleSimulate} 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-cosmic hover:shadow-glow transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  className="border-border hover:border-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Loading Progress */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Calculating trajectory...</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Impact Summary */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span>Impact Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {(results.kineticEnergy / 1e15).toFixed(1)} PJ
                        </div>
                        <div className="text-sm text-muted-foreground">Kinetic Energy</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cosmic-orange">
                          {results.craterSize.toFixed(0)} km
                        </div>
                        <div className="text-sm text-muted-foreground">Crater Diameter</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-warning" />
                          <span className="text-sm">Earthquake Magnitude</span>
                        </div>
                        <Badge className={`${getRiskLevel(results.earthquakeMagnitude).color} text-white`}>
                          {results.earthquakeMagnitude.toFixed(1)} - {getRiskLevel(results.earthquakeMagnitude).level}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Waves className="w-4 h-4 text-cosmic-blue" />
                          <span className="text-sm">Tsunami Risk</span>
                        </div>
                        <Badge variant="outline" className="border-cosmic-blue text-cosmic-blue">
                          {results.tsunamiRisk}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe2 className="w-4 h-4 text-success" />
                          <span className="text-sm">Impact Location</span>
                        </div>
                        <span className="text-sm font-medium">{results.impactLocation.region}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Damage Assessment */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mountain className="w-5 h-5 text-destructive" />
                      <span>Damage Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated Casualties</span>
                        <span className="font-semibold text-destructive">
                          {results.damage.casualties.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Economic Loss</span>
                        <span className="font-semibold text-warning">
                          ${(results.damage.economicLoss / 1e9).toFixed(1)}B
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Affected Area</span>
                        <span className="font-semibold">
                          {results.damage.affectedArea.toLocaleString()} km²
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-glow-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Ready for Impact</h3>
                  <p className="text-muted-foreground">
                    Configure your asteroid parameters and run the simulation to see the potential impact results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulationPanel;