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
  Shield,
  Target,
  Activity,
  TrendingUp,
  Info,
  Zap
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

  const getThreatLevel = (magnitude) => {
    if (magnitude < 6) return { level: "Low", color: "bg-mission-green", textColor: "text-mission-green" };
    if (magnitude < 7) return { level: "Moderate", color: "bg-plasma-orange", textColor: "text-plasma-orange" };
    return { level: "Critical", color: "bg-destructive", textColor: "text-destructive" };
  };

  const getCompositionInfo = (composition) => {
    const info = {
      rock: { emoji: "🪨", description: "Stony asteroid", density: "2.0-3.5 g/cm³", color: "text-stellar-cyan" },
      metal: { emoji: "⚙️", description: "Metallic asteroid", density: "7.0-8.0 g/cm³", color: "text-muted-foreground" },
      ice: { emoji: "🧊", description: "Icy comet", density: "0.5-1.0 g/cm³", color: "text-stellar-cyan" },
      mixed: { emoji: "🌑", description: "Mixed composition", density: "2.0-5.0 g/cm³", color: "text-plasma-orange" }
    };
    return info[composition] || info.rock;
  };

  const getSizeThreat = (size) => {
    const sizeNum = parseInt(size);
    if (sizeNum < 25) return { level: "Atmospheric Burnup", color: "text-mission-green", description: "Burns up in atmosphere" };
    if (sizeNum < 140) return { level: "Local Damage", color: "text-plasma-orange", description: "Localized destruction" };
    if (sizeNum < 1000) return { level: "Regional Threat", color: "text-destructive", description: "City-level devastation" };
    return { level: "Global Event", color: "text-destructive", description: "Mass extinction event" };
  };

  const formatLargeNumber = (number) => {
    if (number >= 1e12) return `${(number / 1e12).toFixed(1)}T`;
    if (number >= 1e9) return `${(number / 1e9).toFixed(1)}B`;
    if (number >= 1e6) return `${(number / 1e6).toFixed(1)}M`;
    if (number >= 1e3) return `${(number / 1e3).toFixed(1)}K`;
    return number.toLocaleString();
  };

  const formatCurrency = (number) => {
    if (number >= 1e12) return `$${(number / 1e12).toFixed(1)}T`;
    if (number >= 1e9) return `$${(number / 1e9).toFixed(1)}B`;
    if (number >= 1e6) return `$${(number / 1e6).toFixed(1)}M`;
    if (number >= 1e3) return `$${(number / 1e3).toFixed(1)}K`;
    return `$${number.toLocaleString()}`;
  };

  const formatArea = (number) => {
    if (number >= 1e6) return `${(number / 1e6).toFixed(1)}M km²`;
    if (number >= 1e3) return `${(number / 1e3).toFixed(1)}K km²`;
    return `${number.toLocaleString()} km²`;
  };

  return (
    <div className="w-full max-w-full">
      {/* Parameters Panel */}
      <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-quantum">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl text-quantum-blue">Threat Analysis</span>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Configure asteroid parameters
                </p>
              </div>
            </div>
            
            {/* Threat Level Badge */}
            {asteroidParams.size && (
              <Badge className={`${getSizeThreat(asteroidParams.size).color.replace('text-', 'bg-')} text-white px-3 py-1 text-xs flex-shrink-0`}>
                {getSizeThreat(asteroidParams.size).level}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Size Input */}
          <div className="space-y-2">
            <Label htmlFor="size" className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-plasma-orange" />
                <span className="font-medium text-sm">Diameter (meters)</span>
              </div>
              <Badge variant="outline" className="text-xs border-quantum-blue/30 text-quantum-blue">
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
              className="bg-background/50 border-border/50 focus:border-quantum-blue h-10 sm:h-11"
              placeholder="Enter diameter"
            />
            <p className="text-xs text-muted-foreground">
              {getSizeThreat(asteroidParams.size).description}
            </p>
          </div>

          {/* Velocity Input */}
          <div className="space-y-2">
            <Label htmlFor="velocity" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-stellar-cyan" />
              <span className="font-medium text-sm">Velocity (km/s)</span>
            </Label>
            <Input
              id="velocity"
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={asteroidParams.velocity}
              onChange={(e) => setAsteroidParams(prev => ({ ...prev, velocity: e.target.value }))}
              className="bg-background/50 border-border/50 focus:border-stellar-cyan h-10 sm:h-11"
              placeholder="Impact velocity"
            />
          </div>

          {/* Density and Angle Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="density" className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-mission-green" />
                <span className="font-medium text-sm">Density (g/cm³)</span>
              </Label>
              <Input
                id="density"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={asteroidParams.density}
                onChange={(e) => setAsteroidParams(prev => ({ ...prev, density: e.target.value }))}
                className="bg-background/50 border-border/50 focus:border-mission-green h-10 sm:h-11"
                placeholder="Density"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="angle" className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-plasma-orange" />
                <span className="font-medium text-sm">Angle (°)</span>
              </Label>
              <Input
                id="angle"
                type="number"
                min="0"
                max="90"
                value={asteroidParams.angle}
                onChange={(e) => setAsteroidParams(prev => ({ ...prev, angle: e.target.value }))}
                className="bg-background/50 border-border/50 focus:border-plasma-orange h-10 sm:h-11"
                placeholder="Entry angle"
              />
            </div>
          </div>

          {/* Composition Select */}
          <div className="space-y-2">
            <Label htmlFor="composition" className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-stellar-cyan" />
              <span className="font-medium text-sm">Composition</span>
            </Label>
            <Select 
              value={asteroidParams.composition} 
              onValueChange={(value) => setAsteroidParams(prev => ({ ...prev, composition: value }))}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-stellar-cyan h-10 sm:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border">
                <SelectItem value="rock">
                  <div className="flex items-center space-x-2">
                    <span>🪨</span>
                    <span>Rocky</span>
                  </div>
                </SelectItem>
                <SelectItem value="metal">
                  <div className="flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Metallic</span>
                  </div>
                </SelectItem>
                <SelectItem value="ice">
                  <div className="flex items-center space-x-2">
                    <span>🧊</span>
                    <span>Icy</span>
                  </div>
                </SelectItem>
                <SelectItem value="mixed">
                  <div className="flex items-center space-x-2">
                    <span>🌑</span>
                    <span>Mixed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Simple Composition Info */}
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center space-x-2 text-sm">
                <span>{getCompositionInfo(asteroidParams.composition).emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-quantum-blue">
                    {getCompositionInfo(asteroidParams.composition).description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Density: {getCompositionInfo(asteroidParams.composition).density}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              onClick={handleSimulate} 
              disabled={isLoading}
              className="flex-1 bg-gradient-quantum hover:shadow-command h-10 sm:h-12"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                  <span className="hidden sm:inline">Analyzing...</span>
                  <span className="sm:hidden">Analyzing</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Run Analysis</span>
                  <span className="sm:hidden">Analyze</span>
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="border-border h-10 sm:h-12 px-4 sm:px-6"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing...</span>
                <span className="font-mono text-quantum-blue">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Impact Summary */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-plasma-orange to-destructive">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl text-plasma-orange">Impact Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-quantum-blue/10 rounded-lg border border-quantum-blue/20">
                  <div className="text-2xl sm:text-3xl font-bold text-quantum-blue mb-1">
                    {(results.kineticEnergy / 1e15).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Petajoules</div>
                  <div className="text-xs text-quantum-blue mt-1">Kinetic Energy</div>
                </div>
                
                <div className="text-center p-4 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20">
                  <div className="text-2xl sm:text-3xl font-bold text-plasma-orange mb-1">
                    {results.craterSize.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Kilometers</div>
                  <div className="text-xs text-plasma-orange mt-1">Crater Diameter</div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-destructive" />
                    <div>
                      <div className="font-medium">Seismic Magnitude</div>
                      <div className="text-xs text-muted-foreground">Richter scale</div>
                    </div>
                  </div>
                  <Badge className={`${getThreatLevel(results.earthquakeMagnitude).color} text-white px-3 py-1`}>
                    {results.earthquakeMagnitude.toFixed(1)} - {getThreatLevel(results.earthquakeMagnitude).level}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-stellar-cyan" />
                    <div>
                      <div className="font-medium">Tsunami Risk</div>
                      <div className="text-xs text-muted-foreground">Ocean impact</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-stellar-cyan text-stellar-cyan px-3 py-1">
                    {results.tsunamiRisk}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-mission-green" />
                    <div>
                      <div className="font-medium">Impact Zone</div>
                      <div className="text-xs text-muted-foreground">Location</div>
                    </div>
                  </div>
                  <span className="font-medium text-foreground px-3 py-1">
                    {results.impactLocation.region}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damage Assessment */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-destructive to-plasma-orange">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl text-destructive">Damage Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Casualties */}
                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20 min-h-[100px] flex flex-col justify-center">
                  <div className="text-xl sm:text-2xl font-bold text-destructive">
                    {formatLargeNumber(results.damage.casualties)}
                  </div>
                  <div className="text-xs text-muted-foreground">Casualties</div>
                </div>
                
                {/* Economic Loss */}
                <div className="text-center p-4 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20 min-h-[100px] flex flex-col justify-center">
                  <div className="text-xl sm:text-2xl font-bold text-plasma-orange">
                    {formatCurrency(results.damage.economicLoss)}
                  </div>
                  <div className="text-xs text-muted-foreground">Economic Loss</div>
                </div>
                
                {/* Affected Area */}
                <div className="text-center p-4 bg-stellar-cyan/10 rounded-lg border border-stellar-cyan/20 sm:col-span-2 lg:col-span-1 min-h-[100px] flex flex-col justify-center">
                  <div className="text-xl sm:text-2xl font-bold text-stellar-cyan">
                    {formatArea(results.damage.affectedArea)}
                  </div>
                  <div className="text-xs text-muted-foreground">Affected Area</div>
                </div>
              </div>
              
              {/* Context Info */}
              <div className="mt-4 p-3 bg-muted/10 rounded-lg border border-border/30">
                <h4 className="text-sm font-semibold mb-2 flex items-center text-quantum-blue">
                  <Info className="w-4 h-4 mr-2" />
                  Impact Context
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Population:</span>
                    <div className="font-medium">
                      {results.impactLocation.populationDensity || 'Variable'} people/km²
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Infrastructure:</span>
                    <div className="font-medium">
                      {results.impactLocation.infrastructure || 'Mixed'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Warning:</span>
                    <div className="font-medium">
                      {results.impactLocation.warningTime || 'Hours to days'}
                    </div>
                  </div>
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