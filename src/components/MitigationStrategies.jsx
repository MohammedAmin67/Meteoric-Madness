import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Shield, 
  Rocket, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Atom,
  Orbit,
  BarChart3,
  Award,
  Info
} from "lucide-react";
import { testMitigation } from "@/services/mockApi";

const MitigationStrategies = ({ asteroidParams }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const strategies = [
    {
      id: "kinetic_impactor",
      name: "Kinetic Impactor",
      icon: Rocket,
      description: "High-speed spacecraft collision to alter asteroid trajectory using momentum transfer",
      detailedDescription: "The kinetic impactor technique involves sending a spacecraft to collide with an asteroid at high velocity, transferring momentum to change its orbit. This method was successfully demonstrated by NASA's DART mission in 2022.",
      advantages: ["Proven technology (DART mission)", "Immediate effect", "Precise targeting", "Cost-effective"],
      limitations: ["Single use only", "Requires early detection", "Limited to smaller asteroids", "Debris creation risk"],
      color: "text-cosmic-orange",
      bgColor: "bg-cosmic-orange",
      gradientColor: "from-cosmic-orange to-warning",
      effectiveness: 85,
      readiness: 90,
      cost: 1.5e9,
      missionDuration: "2-3 years",
      optimalSize: "50-500m",
      successRate: "85-95%"
    },
    {
      id: "gravity_tractor",
      name: "Gravity Tractor",
      icon: Orbit,
      description: "Long-term gravitational pull using precise spacecraft positioning near the asteroid",
      detailedDescription: "A gravity tractor uses the gravitational attraction between a spacecraft and asteroid to slowly change the asteroid's trajectory. This gentle method requires precise positioning and extended mission duration.",
      advantages: ["Gentle deflection", "No debris creation", "Highly controllable", "Reversible process"],
      limitations: ["Extremely slow", "Decades of operation", "Massive fuel requirements", "Complex navigation"],
      color: "text-cosmic-blue",
      bgColor: "bg-cosmic-blue",
      gradientColor: "from-cosmic-blue to-primary",
      effectiveness: 70,
      readiness: 60,
      cost: 8.5e9,
      missionDuration: "10-20 years",
      optimalSize: "100-1000m",
      successRate: "70-85%"
    },
    {
      id: "nuclear_deflection",
      name: "Nuclear Deflection",
      icon: Atom,
      description: "Nuclear explosion near asteroid surface for maximum energy transfer and deflection",
      detailedDescription: "Nuclear deflection involves detonating a nuclear device near (not on) an asteroid to vaporize surface material and create thrust. This provides the highest energy option for large asteroids.",
      advantages: ["Highest energy output", "Works on large asteroids", "Fast execution", "Scalable power"],
      limitations: ["Fragmentation risk", "Political/legal challenges", "Radiation concerns", "Technical complexity"],
      color: "text-warning",
      bgColor: "bg-warning",
      gradientColor: "from-warning to-destructive",
      effectiveness: 95,
      readiness: 40,
      cost: 12e9,
      missionDuration: "3-5 years",
      optimalSize: "500m+",
      successRate: "90-98%"
    }
  ];

  const handleTestStrategy = async (strategyId) => {
    if (!asteroidParams) return;

    setLoading(prev => ({ ...prev, [strategyId]: true }));
    
    try {
      const result = await testMitigation(strategyId, asteroidParams);
      setResults(prev => ({ ...prev, [strategyId]: result }));
      setSelectedStrategy(strategyId);
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

  const getReadinessLevel = (readiness) => {
    if (readiness >= 80) return { level: "Operational", color: "bg-success", description: "Ready for deployment" };
    if (readiness >= 60) return { level: "Development", color: "bg-cosmic-orange", description: "Under development" };
    return { level: "Research", color: "bg-destructive", description: "Research phase" };
  };

  const getOptimalMatch = (strategy, asteroidParams) => {
    if (!asteroidParams) return 50;
    
    const size = parseInt(asteroidParams.size) || 100;
    const velocity = parseInt(asteroidParams.velocity) || 20;
    
    let score = 50;
    
    // Size compatibility
    switch (strategy.id) {
      case 'kinetic_impactor':
        score += size <= 500 ? 30 : -20;
        break;
      case 'gravity_tractor':
        score += size >= 100 && size <= 1000 ? 25 : -15;
        break;
      case 'nuclear_deflection':
        score += size >= 500 ? 35 : -10;
        break;
      default:
        break;
    }
    
    // Velocity considerations
    if (velocity > 30) {
      score += strategy.id === 'nuclear_deflection' ? 15 : -10;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  return (
    <section id="mitigation" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
              Planetary Defense Strategies
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore cutting-edge mitigation technologies to deflect incoming asteroids and protect Earth
          </p>
        </div>

        <Tabs defaultValue="strategies" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted/30 h-auto">
            <TabsTrigger value="strategies" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3">
              Strategies
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3">
              Comparison
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3">
              Analysis
            </TabsTrigger>
          </TabsList>

          {/* Strategies Tab */}
          <TabsContent value="strategies">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {strategies.map((strategy) => {
                const Icon = strategy.icon;
                const result = results[strategy.id];
                const isLoading = loading[strategy.id];
                const readiness = getReadinessLevel(strategy.readiness);
                const matchScore = getOptimalMatch(strategy, asteroidParams);

                return (
                  <Card 
                    key={strategy.id} 
                    className={`bg-card/60 border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-cosmic ${
                      selectedStrategy === strategy.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${strategy.gradientColor} bg-opacity-20`}>
                            <Icon className={`w-6 h-6 ${strategy.color}`} />
                          </div>
                          <div className="flex-1">
                            <span className="text-lg font-bold">{strategy.name}</span>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge className={`${readiness.color} text-white text-xs`}>
                                {readiness.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {strategy.effectiveness}% effective
                              </Badge>
                              {asteroidParams && (
                                <Badge 
                                  className={`text-white text-xs ${
                                    matchScore >= 70 ? 'bg-success' : 
                                    matchScore >= 50 ? 'bg-cosmic-orange' : 'bg-destructive'
                                  }`}
                                >
                                  {matchScore}% match
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Description */}
                      <div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {strategy.description}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {strategy.detailedDescription}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Mission Duration</div>
                          <div className="font-semibold">{strategy.missionDuration}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Optimal Size</div>
                          <div className="font-semibold">{strategy.optimalSize}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Success Rate</div>
                          <div className="font-semibold text-success">{strategy.successRate}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Est. Cost</div>
                          <div className="font-semibold text-cosmic-orange">{formatCurrency(strategy.cost)}</div>
                        </div>
                      </div>

                      {/* Effectiveness Bars */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Effectiveness</span>
                            <span className="font-semibold">{strategy.effectiveness}%</span>
                          </div>
                          <Progress value={strategy.effectiveness} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Tech Readiness</span>
                            <span className="font-semibold">{strategy.readiness}%</span>
                          </div>
                          <Progress value={strategy.readiness} className="h-2" />
                        </div>

                        {asteroidParams && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Compatibility</span>
                              <span className="font-semibold">{matchScore}%</span>
                            </div>
                            <Progress value={matchScore} className="h-2" />
                          </div>
                        )}
                      </div>

                      {/* Advantages & Limitations */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-success mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Advantages
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {strategy.advantages.map((advantage, advIndex) => (
                              <li key={advIndex} className="flex items-start space-x-2">
                                <span className="text-success mt-0.5">•</span>
                                <span>{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-warning mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Limitations
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {strategy.limitations.map((limitation, limIndex) => (
                              <li key={limIndex} className="flex items-start space-x-2">
                                <span className="text-warning mt-0.5">•</span>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Test Button */}
                      <Button
                        onClick={() => handleTestStrategy(strategy.id)}
                        disabled={!asteroidParams || isLoading}
                        className="w-full bg-gradient-cosmic hover:shadow-glow transition-all duration-300 h-12"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-3" />
                            Testing Strategy...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5 mr-3" />
                            Test Strategy
                          </>
                        )}
                      </Button>

                      {/* Results */}
                      {result && (
                        <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                          {/* Success Indicator */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Mission Success Probability</span>
                            <Badge className={`${getSuccessBadge(result.successProbability)} text-white px-3 py-1`}>
                              {result.success ? "Viable" : "High Risk"}
                            </Badge>
                          </div>

                          {/* Success Probability */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Success Rate</span>
                              <span className={`text-sm font-semibold ${getSuccessColor(result.successProbability)}`}>
                                {(result.successProbability * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={result.successProbability * 100} 
                              className="h-3"
                            />
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-cosmic-orange" />
                              <div>
                                <div className="text-xs text-muted-foreground">Energy Required</div>
                                <div className="font-semibold">{formatEnergy(result.energyRequired)}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-cosmic-blue" />
                              <div>
                                <div className="text-xs text-muted-foreground">Mission Duration</div>
                                <div className="font-semibold">{result.timeRequired.toFixed(1)} years</div>
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
                                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                              )}
                              <div className="text-xs">
                                {result.success ? (
                                  <span className="text-success">
                                    <strong>Recommended:</strong> This strategy shows high promise for the given asteroid parameters. 
                                    Implementation should be considered with adequate preparation time.
                                  </span>
                                ) : (
                                  <span className="text-destructive">
                                    <strong>Caution:</strong> This strategy may not be optimal for the current asteroid characteristics. 
                                    Consider alternative approaches or combined mission strategies.
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
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            {Object.keys(results).length > 1 ? (
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Strategy Comparison Analysis</span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-2">Strategy</th>
                          <th className="text-center py-3 px-2">Success Rate</th>
                          <th className="text-center py-3 px-2">Duration</th>
                          <th className="text-center py-3 px-2">Energy</th>
                          <th className="text-center py-3 px-2">Cost</th>
                          <th className="text-center py-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(results).map(([strategyId, result]) => {
                          const strategy = strategies.find(s => s.id === strategyId);
                          if (!strategy) return null;
                          
                          return (
                            <tr key={strategyId} className="border-b border-border/30 hover:bg-muted/10">
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-2">
                                  <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                                  <span className="font-medium">{strategy.name}</span>
                                </div>
                              </td>
                              <td className={`text-center py-3 px-2 font-semibold ${getSuccessColor(result.successProbability)}`}>
                                {(result.successProbability * 100).toFixed(0)}%
                              </td>
                              <td className="text-center py-3 px-2">{result.timeRequired.toFixed(1)}yr</td>
                              <td className="text-center py-3 px-2">{formatEnergy(result.energyRequired)}</td>
                              <td className="text-center py-3 px-2">{formatCurrency(result.costEstimate)}</td>
                              <td className="text-center py-3 px-2">
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
            ) : (
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Test Multiple Strategies</h3>
                  <p className="text-muted-foreground">
                    Test at least two different strategies to see a detailed comparison analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Mission Development Timeline</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${strategy.bgColor} bg-opacity-20`}>
                        <strategy.icon className={`w-5 h-5 ${strategy.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{strategy.name}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Development Phase</div>
                            <div className="font-medium">
                              {strategy.readiness >= 80 ? "Operational" : 
                               strategy.readiness >= 60 ? "Testing" : "Research"}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Time to Deploy</div>
                            <div className="font-medium">
                              {strategy.readiness >= 80 ? "2-3 years" : 
                               strategy.readiness >= 60 ? "5-8 years" : "10+ years"}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Readiness Level</div>
                            <Badge className={`${getReadinessLevel(strategy.readiness).color} text-white`}>
                              TRL {Math.floor(strategy.readiness / 10)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Progress value={strategy.readiness} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost-Effectiveness Analysis */}
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-cosmic-orange" />
                    <span>Cost-Effectiveness Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategies.map((strategy) => (
                      <div key={strategy.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                            <span className="text-sm font-medium">{strategy.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(strategy.cost)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={strategy.effectiveness} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-xs text-muted-foreground w-10">
                            {strategy.effectiveness}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-success" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategies.map((strategy) => {
                      const riskScore = 100 - strategy.readiness;
                      const riskLevel = riskScore < 30 ? "Low" : riskScore < 60 ? "Medium" : "High";
                      const riskColor = riskScore < 30 ? "text-success" : riskScore < 60 ? "text-cosmic-orange" : "text-destructive";
                      
                      return (
                        <div key={strategy.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                              <span className="text-sm font-medium">{strategy.name}</span>
                            </div>
                            <Badge className={`${riskColor.replace('text-', 'bg-')} text-white text-xs`}>
                              {riskLevel} Risk
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Readiness: {strategy.readiness}% | Success Rate: {strategy.successRate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-cosmic-blue" />
                  <span>Strategic Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <h4 className="font-semibold text-success mb-2">Near-term Strategy (1-5 years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Deploy kinetic impactor missions for small to medium asteroids (50-500m). 
                    This technology is proven and cost-effective with high readiness levels.
                  </p>
                </div>
                
                <div className="p-4 bg-cosmic-orange/10 border border-cosmic-orange/20 rounded-lg">
                  <h4 className="font-semibold text-cosmic-orange mb-2">Medium-term Strategy (5-15 years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Develop gravity tractor capabilities for precise, gentle deflection of medium-sized asteroids. 
                    Ideal for scenarios with long warning times.
                  </p>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <h4 className="font-semibold text-warning mb-2">Long-term Strategy (15+ years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Research and develop nuclear deflection systems for catastrophic threats from large asteroids (500m+). 
                    Address political and technical challenges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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