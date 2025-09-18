import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Zap, 
  Shield, 
  Rocket, 
  Clock, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { testMitigation } from "@/services/mockApi";

const MitigationStrategies = ({ asteroidParams }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const strategies = [
    {
      id: "kinetic_impactor",
      name: "Kinetic Impactor",
      icon: Rocket,
      description: "High-speed spacecraft collision to alter asteroid trajectory",
      advantages: ["Proven technology", "Immediate effect", "Precise targeting"],
      limitations: ["Single use", "Requires early detection", "Debris creation"],
      color: "text-cosmic-orange"
    },
    {
      id: "gravity_tractor",
      name: "Gravity Tractor",
      icon: Target,
      description: "Long-term gravitational pull using spacecraft positioning",
      advantages: ["Gentle deflection", "No debris", "Controllable"],
      limitations: ["Very slow", "Long mission duration", "Large fuel requirements"],
      color: "text-cosmic-blue"
    },
    {
      id: "nuclear_deflection",
      name: "Nuclear Deflection",
      icon: Zap,
      description: "Nuclear explosion near asteroid surface for maximum deflection",
      advantages: ["Highest energy", "Works on large asteroids", "Fast execution"],
      limitations: ["Fragmentation risk", "Political challenges", "Radiation effects"],
      color: "text-warning"
    }
  ];

  const handleTestStrategy = async (strategyId) => {
    if (!asteroidParams) return;

    setLoading(prev => ({ ...prev, [strategyId]: true }));
    
    try {
      const result = await testMitigation(strategyId, asteroidParams);
      setResults(prev => ({ ...prev, [strategyId]: result }));
    } catch (error) {
      console.error("Mitigation test failed:", error);
    } finally {
      setLoading(prev => ({ ...prev, [strategyId]: false }));
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${(value / 1e3).toFixed(0)}K`;
  };

  const formatEnergy = (value) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)} TJ`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)} GJ`;
    return `${(value / 1e6).toFixed(1)} MJ`;
  };

  const getSuccessColor = (probability) => {
    if (probability >= 0.8) return "text-success";
    if (probability >= 0.5) return "text-cosmic-orange";
    return "text-destructive";
  };

  const getSuccessBadge = (probability) => {
    if (probability >= 0.8) return "bg-success";
    if (probability >= 0.5) return "bg-cosmic-orange";
    return "bg-destructive";
  };

  return (
    <section id="mitigation" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
              Planetary Defense Strategies
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore cutting-edge mitigation technologies to deflect incoming asteroids and protect Earth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            const result = results[strategy.id];
            const isLoading = loading[strategy.id];

            return (
              <Card key={strategy.id} className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-muted/50 ${strategy.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span>{strategy.name}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {strategy.description}
                  </p>

                  {/* Advantages & Limitations */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-success mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Advantages
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {strategy.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-warning mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Limitations
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {strategy.limitations.map((limitation, index) => (
                          <li key={index}>• {limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Test Button */}
                  <Button
                    onClick={() => handleTestStrategy(strategy.id)}
                    disabled={!asteroidParams || isLoading}
                    className="w-full bg-gradient-cosmic hover:shadow-glow transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Test Strategy
                      </>
                    )}
                  </Button>

                  {/* Results */}
                  {result && (
                    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                      {/* Success Indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mission Success</span>
                        <Badge className={`${getSuccessBadge(result.successProbability)} text-white`}>
                          {result.success ? "Viable" : "Not Viable"}
                        </Badge>
                      </div>

                      {/* Success Probability */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Success Probability</span>
                          <span className={`text-sm font-semibold ${getSuccessColor(result.successProbability)}`}>
                            {(result.successProbability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={result.successProbability * 100} 
                          className="h-2"
                        />
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-cosmic-orange" />
                          <div>
                            <div className="text-xs text-muted-foreground">Energy</div>
                            <div className="font-semibold">{formatEnergy(result.energyRequired)}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-cosmic-blue" />
                          <div>
                            <div className="text-xs text-muted-foreground">Time</div>
                            <div className="font-semibold">{result.timeRequired.toFixed(1)}yr</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 col-span-2">
                          <DollarSign className="w-4 h-4 text-success" />
                          <div>
                            <div className="text-xs text-muted-foreground">Estimated Cost</div>
                            <div className="font-semibold">{formatCurrency(result.costEstimate)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'border-success/50 bg-success/10' 
                          : 'border-destructive/50 bg-destructive/10'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {result.success ? (
                            <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                          )}
                          <div className="text-xs">
                            {result.success ? (
                              <span className="text-success">
                                This strategy shows promise for the given asteroid parameters. 
                                Consider implementation with adequate lead time.
                              </span>
                            ) : (
                              <span className="text-destructive">
                                This strategy may not be effective for the current asteroid. 
                                Consider alternative approaches or combined strategies.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Strategy Comparison */}
        {Object.keys(results).length > 1 && (
          <Card className="mt-12 bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Strategy Comparison</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2">Strategy</th>
                      <th className="text-center py-2">Success Rate</th>
                      <th className="text-center py-2">Time Required</th>
                      <th className="text-center py-2">Cost</th>
                      <th className="text-center py-2">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results).map(([strategyId, result]) => {
                      return (
                        <tr key={strategyId} className="border-b border-border/30">
                          <td className="py-3 font-medium">{result.method}</td>
                          <td className={`text-center py-3 ${getSuccessColor(result.successProbability)}`}>
                            {(result.successProbability * 100).toFixed(0)}%
                          </td>
                          <td className="text-center py-3">{result.timeRequired.toFixed(1)}yr</td>
                          <td className="text-center py-3">{formatCurrency(result.costEstimate)}</td>
                          <td className="text-center py-3">
                            <Badge className={`${getSuccessBadge(result.successProbability)} text-white`}>
                              {result.success ? "Viable" : "Risk"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

MitigationStrategies.propTypes = {
  asteroidParams: PropTypes.shape({
    size: PropTypes.string,
    velocity: PropTypes.string,
    density: PropTypes.string,
    composition: PropTypes.string,
    angle: PropTypes.string
  })
};

export default MitigationStrategies;