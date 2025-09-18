import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  Globe2, 
  Activity,
  Waves,
  Target,
  TrendingUp,
  Info
} from "lucide-react";
import { simulateAsteroid } from "@/services/mockApi";

const SimulationPanel = ({ onSimulationComplete, onParamsChange }) => {
  const [asteroidParams, setAsteroidParams] = useState({
    size: "100",
    velocity: "20",
    density: "2.5",
    composition: "rock",
    angle: "45"
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulate = async () => {
    setIsLoading(true);
    setProgress(0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulationData = await simulateAsteroid(asteroidParams);
      setResults(simulationData);
      onSimulationComplete?.(simulationData);
      setProgress(100);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  useEffect(() => {
    onParamsChange?.({
      ...asteroidParams,
      asteroidSize: asteroidParams.size,
      approachAngle: asteroidParams.angle
    });
  }, [asteroidParams, onParamsChange]);

  const handleReset = () => {
    setResults(null);
    setProgress(0);
    setAsteroidParams({
      size: "100",
      velocity: "20", 
      density: "2.5",
      composition: "rock",
      angle: "45"
    });
  };

  const getRiskLevel = (magnitude) => {
    if (magnitude < 6) return { level: "Low", color: "bg-success", textColor: "text-success" };
    if (magnitude < 7) return { level: "Moderate", color: "bg-cosmic-orange", textColor: "text-cosmic-orange" };
    return { level: "Catastrophic", color: "bg-destructive", textColor: "text-destructive" };
  };

  const getCompositionInfo = (composition) => {
    const info = {
      rock: { emoji: "🪨", description: "Stony asteroid", density: "2.0-3.5 g/cm³", color: "text-purple-400" },
      metal: { emoji: "⚙️", description: "Metallic asteroid", density: "7.0-8.0 g/cm³", color: "text-gray-400" },
      ice: { emoji: "🧊", description: "Icy comet", density: "0.5-1.0 g/cm³", color: "text-cyan-400" },
      mixed: { emoji: "🌑", description: "Mixed composition", density: "2.0-5.0 g/cm³", color: "text-orange-400" }
    };
    return info[composition] || info.rock;
  };

  const getSizeThreat = (size) => {
    const sizeNum = parseInt(size);
    if (sizeNum < 25) return { level: "Atmospheric Burnup", color: "text-success", description: "Harmlessly burns up in atmosphere" };
    if (sizeNum < 140) return { level: "Local Damage", color: "text-cosmic-orange", description: "Localized destruction zone" };
    if (sizeNum < 1000) return { level: "Regional Threat", color: "text-warning", description: "City-level devastation" };
    return { level: "Global Catastrophe", color: "text-destructive", description: "Mass extinction event" };
  };

  return (
    <div className="w-full">
      {/* Parameters Panel */}
      <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-cosmic">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-cosmic">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl">Asteroid Parameters</span>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  Configure the cosmic threat parameters
                </p>
              </div>
            </div>
            
            {/* Threat Level Indicator */}
            {asteroidParams.size && (
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Badge className={`${getSizeThreat(asteroidParams.size).color.replace('text-', 'bg-')} text-white px-3 py-1`}>
                  {getSizeThreat(asteroidParams.size).level}
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Size Input */}
          <div className="space-y-3">
            <Label htmlFor="size" className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-cosmic-orange" />
                <span className="font-medium">Size (meters)</span>
                <Info className="w-3 h-3 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                {getSizeThreat(asteroidParams.size).level}
              </Badge>
            </Label>
            <Input
              id="size"
              type="number"
              min="1"
              max="10000"
              value={asteroidParams.size}
              onChange={(e) => setAsteroidParams(prev => ({ ...prev, size: e.target.value }))}
              className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
              placeholder="Enter asteroid diameter"
            />
            <p className="text-xs text-muted-foreground">
              {getSizeThreat(asteroidParams.size).description}
            </p>
          </div>

          {/* Velocity Input */}
          <div className="space-y-3">
            <Label htmlFor="velocity" className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cosmic-blue" />
                <span className="font-medium">Velocity (km/s)</span>
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                Typical: 11-72 km/s
              </Badge>
            </Label>
            <Input
              id="velocity"
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={asteroidParams.velocity}
              onChange={(e) => setAsteroidParams(prev => ({ ...prev, velocity: e.target.value }))}
              className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
              placeholder="Impact velocity"
            />
          </div>

          {/* Density and Composition Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Density Input */}
            <div className="space-y-3">
              <Label htmlFor="density" className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-success" />
                <span className="font-medium">Density (g/cm³)</span>
              </Label>
              <Input
                id="density"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={asteroidParams.density}
                onChange={(e) => setAsteroidParams(prev => ({ ...prev, density: e.target.value }))}
                className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                placeholder="Material density"
              />
            </div>

            {/* Approach Angle */}
            <div className="space-y-3">
              <Label htmlFor="angle" className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-warning" />
                  <span className="font-medium">Approach Angle (°)</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {parseInt(asteroidParams.angle) < 30 ? "Shallow" : 
                   parseInt(asteroidParams.angle) < 60 ? "Moderate" : "Steep"}
                </Badge>
              </Label>
              <Input
                id="angle"
                type="number"
                min="0"
                max="90"
                value={asteroidParams.angle}
                onChange={(e) => setAsteroidParams(prev => ({ ...prev, angle: e.target.value }))}
                className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                placeholder="Entry angle"
              />
            </div>
          </div>

          {/* Composition Select */}
          <div className="space-y-3">
            <Label htmlFor="composition" className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-cosmic-purple" />
              <span className="font-medium">Composition</span>
            </Label>
            <Select 
              value={asteroidParams.composition} 
              onValueChange={(value) => setAsteroidParams(prev => ({ ...prev, composition: value }))}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="rock">
                  <div className="flex items-center space-x-3">
                    <span>🪨</span>
                    <div>
                      <div>Rocky</div>
                      <div className="text-xs text-muted-foreground">Stony asteroid</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="metal">
                  <div className="flex items-center space-x-3">
                    <span>⚙️</span>
                    <div>
                      <div>Metallic</div>
                      <div className="text-xs text-muted-foreground">Iron-nickel core</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ice">
                  <div className="flex items-center space-x-3">
                    <span>🧊</span>
                    <div>
                      <div>Icy</div>
                      <div className="text-xs text-muted-foreground">Comet-like body</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="mixed">
                  <div className="flex items-center space-x-3">
                    <span>🌑</span>
                    <div>
                      <div>Mixed</div>
                      <div className="text-xs text-muted-foreground">Hybrid composition</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Composition Info */}
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-lg">{getCompositionInfo(asteroidParams.composition).emoji}</span>
                <div className="flex-1">
                  <div className="font-medium">{getCompositionInfo(asteroidParams.composition).description}</div>
                  <div className="text-xs text-muted-foreground">
                    Typical density: {getCompositionInfo(asteroidParams.composition).density}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getCompositionInfo(asteroidParams.composition).color.replace('text-', 'bg-')}`} />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              onClick={handleSimulate} 
              disabled={isLoading}
              className="flex-1 bg-gradient-cosmic hover:shadow-glow transition-all duration-300 h-12"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-3" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-3" />
                  Run Simulation
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="border-border hover:border-primary hover:bg-primary/5 h-12 px-6"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Calculating trajectory...</span>
                <span className="font-mono font-bold text-primary">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted/30" />
              <div className="text-xs text-center text-muted-foreground">
                Processing orbital mechanics and impact physics
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section - Responsive */}
      {results && (
        <div className="mt-6 space-y-6">
          {/* Impact Summary */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-cosmic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-warning to-destructive">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span>Impact Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-cosmic-blue/10 rounded-lg border border-primary/20">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {(results.kineticEnergy / 1e15).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Petajoules</div>
                  <div className="text-xs text-primary mt-1">Kinetic Energy</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-cosmic-orange/10 to-warning/10 rounded-lg border border-cosmic-orange/20">
                  <div className="text-2xl sm:text-3xl font-bold text-cosmic-orange mb-1">
                    {results.craterSize.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Kilometers</div>
                  <div className="text-xs text-cosmic-orange mt-1">Crater Diameter</div>
                </div>
              </div>

              {/* Detailed Metrics - Mobile Friendly */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-warning" />
                    <div>
                      <div className="font-medium">Earthquake Magnitude</div>
                      <div className="text-xs text-muted-foreground">Richter scale equivalent</div>
                    </div>
                  </div>
                  <Badge className={`${getRiskLevel(results.earthquakeMagnitude).color} text-white px-3 py-1 w-fit`}>
                    {results.earthquakeMagnitude.toFixed(1)} - {getRiskLevel(results.earthquakeMagnitude).level}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Waves className="w-5 h-5 text-cosmic-blue" />
                    <div>
                      <div className="font-medium">Tsunami Risk</div>
                      <div className="text-xs text-muted-foreground">Ocean impact effects</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-cosmic-blue text-cosmic-blue px-3 py-1 w-fit">
                    {results.tsunamiRisk}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Globe2 className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium">Impact Location</div>
                      <div className="text-xs text-muted-foreground">Simulated impact zone</div>
                    </div>
                  </div>
                  <span className="font-medium text-foreground px-3 py-1 w-fit">
                    {results.impactLocation.region}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damage Assessment - Responsive Grid */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-cosmic">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-destructive to-warning">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span>Damage Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-xl sm:text-2xl font-bold text-destructive mb-1">
                    {results.damage.casualties.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated Casualties</div>
                </div>
                
                <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="text-xl sm:text-2xl font-bold text-warning mb-1">
                    ${(results.damage.economicLoss / 1e9).toFixed(1)}B
                  </div>
                  <div className="text-xs text-muted-foreground">Economic Loss</div>
                </div>
                
                <div className="text-center p-4 bg-cosmic-orange/10 rounded-lg border border-cosmic-orange/20 sm:col-span-2 lg:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-cosmic-orange mb-1">
                    {results.damage.affectedArea.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Affected Area (km²)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

SimulationPanel.propTypes = {
  onSimulationComplete: PropTypes.func,
  onParamsChange: PropTypes.func
};

export default SimulationPanel;