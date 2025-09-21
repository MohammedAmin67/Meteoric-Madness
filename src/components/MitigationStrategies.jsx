import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Rocket, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Atom,
  Orbit,
  BarChart3,
  Award,
  Info,
  Target,
  Activity,
  Play,
  Settings
} from "lucide-react";
import { testMitigation } from "@/services/mockApi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const MitigationStrategies = ({ asteroidParams }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState("strategies");
  const [isLoaded, setIsLoaded] = useState(false);
  // ✅ ADDED: State for effective asteroid params (from props or localStorage)
  const [effectiveAsteroidParams, setEffectiveAsteroidParams] = useState(null);
  // ✅ ADDED: Track which results have been animated to prevent re-animation
  const [animatedResults, setAnimatedResults] = useState(new Set());

  // Animation refs
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const strategiesGridRef = useRef(null);
  const comparisonRef = useRef(null);
  const timelineRef = useRef(null);
  const analysisRef = useRef(null);

  const strategies = [
    {
      id: "kinetic_impactor",
      name: "Kinetic Impactor",
      icon: Rocket,
      description: "High-speed spacecraft collision to alter asteroid trajectory using momentum transfer",
      detailedDescription: "The kinetic impactor technique involves sending a spacecraft to collide with an asteroid at high velocity, transferring momentum to change its orbit. This method was successfully demonstrated by NASA's DART mission.",
      advantages: ["Proven technology (DART mission)", "Immediate effect", "Precise targeting", "Cost-effective"],
      limitations: ["Single use only", "Requires early detection", "Limited to smaller asteroids", "Debris creation risk"],
      color: "text-plasma-orange",
      bgColor: "bg-plasma-orange",
      gradientColor: "from-plasma-orange to-stellar-cyan",
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
      color: "text-quantum-blue",
      bgColor: "bg-quantum-blue",
      gradientColor: "from-quantum-blue to-stellar-cyan",
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
      color: "text-destructive",
      bgColor: "bg-destructive",
      gradientColor: "from-destructive to-plasma-orange",
      effectiveness: 95,
      readiness: 40,
      cost: 12e9,
      missionDuration: "3-5 years",
      optimalSize: "500m+",
      successRate: "90-98%"
    }
  ];

  // ✅ ADDED: Get asteroid params from props or localStorage
  useEffect(() => {
    let params = asteroidParams;
    
    // If no props, try to get from localStorage
    if (!params) {
      try {
        const storedParams = localStorage.getItem('meteoric-asteroid-params');
        if (storedParams) {
          params = JSON.parse(storedParams);
        }
      } catch (error) {
        console.error('Error reading asteroid params from localStorage:', error);
      }
    }
    
    setEffectiveAsteroidParams(params);
    console.log("🔍 Debug - effectiveAsteroidParams:", params);
  }, [asteroidParams]);

  // ✅ ADDED: Listen for localStorage changes (when SimulationPanel updates params)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedParams = localStorage.getItem('meteoric-asteroid-params');
        if (storedParams && !asteroidParams) {
          setEffectiveAsteroidParams(JSON.parse(storedParams));
        }
      } catch (error) {
        console.error('Error reading updated asteroid params:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [asteroidParams]);

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);

      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.2
        });
      }

      // Tabs animation
      if (tabsRef.current) {
        ScrollTrigger.create({
          trigger: tabsRef.current,
          start: "top 90%",
          onEnter: () => {
            gsap.fromTo(tabsRef.current.querySelector('.tabs-list'), {
              opacity: 0,
              scale: 0.95
            }, {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.4)"
            });
          },
          once: true
        });
      }

      // Add interactive effects
      const addInteractiveEffects = () => {
        // Strategy card hover effects
        const strategyCards = document.querySelectorAll('.strategy-card');
        strategyCards.forEach((card) => {
          if (card.dataset.hoverInitialized) return;
          card.dataset.hoverInitialized = 'true';
          
          const icon = card.querySelector('.card-icon');
          const badge = card.querySelector('.strategy-badge');
          
          const handleMouseEnter = () => {
            gsap.to(card, {
              scale: 1.02,
              y: -8,
              duration: 0.3,
              ease: "power2.out"
            });
            if (icon) {
              gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(1.7)"
              });
            }
            if (badge) {
              gsap.to(badge, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
              });
            }
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
            if (icon) {
              gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
              });
            }
            if (badge) {
              gsap.to(badge, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
              });
            }
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.interactive-button');
        buttons.forEach((button) => {
          if (button.dataset.hoverInitialized) return;
          button.dataset.hoverInitialized = 'true';
          
          const handleMouseEnter = () => {
            gsap.to(button, {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to(button, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          };

          button.addEventListener('mouseenter', handleMouseEnter);
          button.addEventListener('mouseleave', handleMouseLeave);
        });

        // Tab content cards
        const tabCards = document.querySelectorAll('.tab-content-card');
        tabCards.forEach((card) => {
          if (card.dataset.hoverInitialized) return;
          card.dataset.hoverInitialized = 'true';
          
          const handleMouseEnter = () => {
            gsap.to(card, {
              scale: 1.02,
              duration: 0.2,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        });
      };

      setTimeout(addInteractiveEffects, 600);
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate strategies grid when it becomes visible
  useEffect(() => {
    if (strategiesGridRef.current && activeTab === "strategies") {
      const cards = strategiesGridRef.current.querySelectorAll('.strategy-card');
      gsap.fromTo(cards, {
        opacity: 0,
        y: 40,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    }
  }, [activeTab]);

  // Tab content animations
  useEffect(() => {
    const animateTabContent = () => {
      let contentRef = null;
      
      switch (activeTab) {
        case "comparison":
          contentRef = comparisonRef.current;
          break;
        case "timeline":
          contentRef = timelineRef.current;
          break;
        case "analysis":
          contentRef = analysisRef.current;
          break;
        default:
          return;
      }

      if (contentRef) {
        gsap.fromTo(contentRef, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        });

        // Animate child elements
        const childElements = contentRef.querySelectorAll('.tab-content-card, .analysis-card, .timeline-item');
        if (childElements.length > 0) {
          gsap.fromTo(childElements, {
            opacity: 0,
            y: 20,
            scale: 0.98
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2
          });
        }
      }
    };

    animateTabContent();
  }, [activeTab]);

  // ✅ FIXED: Animate only NEW results, not all existing ones
  useEffect(() => {
    if (selectedStrategy && results[selectedStrategy] && !animatedResults.has(selectedStrategy)) {
      // Only animate the specific strategy's result elements
      const strategyCard = document.querySelector(`[data-strategy-id="${selectedStrategy}"]`);
      if (strategyCard) {
        const resultElements = strategyCard.querySelectorAll('.result-animation');
        
        gsap.fromTo(resultElements, {
          opacity: 0,
          y: 20,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.4)"
        });

        // Mark this result as animated
        setAnimatedResults(prev => new Set([...prev, selectedStrategy]));
      }
    }
  }, [selectedStrategy, results, animatedResults]);

  const handleTestStrategy = async (strategyId) => {
    // ✅ FIXED: Use effectiveAsteroidParams instead of asteroidParams
    if (!effectiveAsteroidParams) return;

    setLoading(prev => ({ ...prev, [strategyId]: true }));
    
    try {
      const result = await testMitigation(strategyId, effectiveAsteroidParams);
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
    if (probability >= 0.8) return "text-mission-green";
    if (probability >= 0.5) return "text-plasma-orange";
    return "text-destructive";
  };

  const getSuccessBadge = (probability) => {
    if (probability >= 0.8) return "bg-mission-green";
    if (probability >= 0.5) return "bg-plasma-orange";
    return "bg-destructive";
  };

  const getReadinessLevel = (readiness) => {
    if (readiness >= 80) return { level: "Operational", color: "bg-mission-green", description: "Ready for deployment" };
    if (readiness >= 60) return { level: "Development", color: "bg-plasma-orange", description: "Under development" };
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
    <section 
      id="mitigation" 
      ref={sectionRef}
      className={`px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-6 sm:mb-8">
          {/* Show current asteroid parameters status */}
          {effectiveAsteroidParams ? (
            <div className="mt-4 inline-flex items-center space-x-2 bg-mission-green/10 border border-mission-green/20 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4 text-mission-green" />
              <span className="text-sm font-medium text-mission-green">
                Asteroid parameters loaded: {effectiveAsteroidParams.size}m diameter
              </span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center space-x-2 bg-plasma-orange/10 border border-plasma-orange/20 rounded-full px-4 py-2">
              <AlertTriangle className="w-4 h-4 text-plasma-orange" />
              <span className="text-sm font-medium text-plasma-orange">
                Run a simulation first to test defense strategies
              </span>
            </div>
          )}
        </div>

        <div ref={tabsRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="tabs-list grid w-full grid-cols-2 lg:grid-cols-4 bg-card/60 border-border/50 backdrop-blur-sm h-auto p-1">
              <TabsTrigger 
                value="strategies" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Defense</span>
                <span className="sm:hidden">Def</span>
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Compare</span>
                <span className="sm:hidden">Comp</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="data-[state-active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <Clock className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Timeline</span>
                <span className="sm:hidden">Time</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <TrendingUp className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analysis</span>
                <span className="sm:hidden">Data</span>
              </TabsTrigger>
            </TabsList>

            {/* Strategies Tab */}
            <TabsContent value="strategies">
              <div ref={strategiesGridRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {strategies.map((strategy) => {
                  const Icon = strategy.icon;
                  const result = results[strategy.id];
                  const isLoading = loading[strategy.id];
                  const readiness = getReadinessLevel(strategy.readiness);
                  // ✅ FIXED: Use effectiveAsteroidParams
                  const matchScore = getOptimalMatch(strategy, effectiveAsteroidParams);

                  return (
                    <Card 
                      key={strategy.id} 
                      data-strategy-id={strategy.id} // ✅ ADDED: Strategy ID for targeting specific animations
                      className={`strategy-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command transition-all duration-300 hover:shadow-glow ${
                        selectedStrategy === strategy.id ? 'ring-2 ring-quantum-blue shadow-command' : ''
                      }`}
                    >
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex flex-col space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`card-icon p-2 rounded-lg bg-gradient-to-br ${strategy.gradientColor}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="text-lg font-bold text-quantum-blue">{strategy.name}</span>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {strategy.missionDuration} mission
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`strategy-badge ${readiness.color} text-white text-xs px-2 py-1`}>
                              {readiness.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-quantum-blue/30 text-quantum-blue">
                              {strategy.effectiveness}% effective
                            </Badge>
                            {/* ✅ FIXED: Use effectiveAsteroidParams */}
                            {effectiveAsteroidParams && (
                              <Badge 
                                className={`text-white text-xs px-2 py-1 ${
                                  matchScore >= 70 ? 'bg-mission-green' : 
                                  matchScore >= 50 ? 'bg-plasma-orange' : 'bg-destructive'
                                }`}
                              >
                                {matchScore}% match
                              </Badge>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4 sm:space-y-5">
                        {/* Description */}
                        <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                            {strategy.description}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {strategy.detailedDescription}
                          </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-quantum-blue/10 rounded-lg border border-quantum-blue/20 text-center">
                            <div className="text-lg sm:text-xl font-bold text-quantum-blue">
                              {strategy.successRate}
                            </div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                          
                          <div className="p-3 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20 text-center">
                            <div className="text-lg sm:text-xl font-bold text-plasma-orange">
                              {formatCurrency(strategy.cost)}
                            </div>
                            <div className="text-xs text-muted-foreground">Est. Cost</div>
                          </div>
                        </div>

                        {/* Effectiveness Metrics */}
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="flex items-center space-x-2">
                                <Target className="w-4 h-4 text-quantum-blue" />
                                <span>Effectiveness</span>
                              </span>
                              <span className="font-mono text-quantum-blue">{strategy.effectiveness}%</span>
                            </div>
                            <Progress value={strategy.effectiveness} className="h-2" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="flex items-center space-x-2">
                                <Settings className="w-4 h-4 text-stellar-cyan" />
                                <span>Tech Readiness</span>
                              </span>
                              <span className="font-mono text-stellar-cyan">{strategy.readiness}%</span>
                            </div>
                            <Progress value={strategy.readiness} className="h-2" />
                          </div>

                          {/* ✅ FIXED: Use effectiveAsteroidParams */}
                          {effectiveAsteroidParams && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="flex items-center space-x-2">
                                  <Activity className="w-4 h-4 text-mission-green" />
                                  <span>Compatibility</span>
                                </span>
                                <span className="font-mono text-mission-green">{matchScore}%</span>
                              </div>
                              <Progress value={matchScore} className="h-2" />
                            </div>
                          )}
                        </div>

                        <Separator className="my-4" />

                        {/* Advantages & Limitations */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-mission-green mb-2 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Advantages
                            </h4>
                            <div className="space-y-1">
                              {strategy.advantages.slice(0, 2).map((advantage, advIndex) => (
                                <div key={advIndex} className="flex items-start space-x-2 text-xs">
                                  <span className="text-mission-green mt-0.5">•</span>
                                  <span className="text-muted-foreground">{advantage}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-plasma-orange mb-2 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Limitations
                            </h4>
                            <div className="space-y-1">
                              {strategy.limitations.slice(0, 2).map((limitation, limIndex) => (
                                <div key={limIndex} className="flex items-start space-x-2 text-xs">
                                  <span className="text-plasma-orange mt-0.5">•</span>
                                  <span className="text-muted-foreground">{limitation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Test Strategy Button */}
                        <div className="space-y-2">
                          <Button
                            onClick={() => handleTestStrategy(strategy.id)}
                            disabled={!effectiveAsteroidParams || isLoading}
                            className="interactive-button w-full bg-gradient-quantum hover:shadow-command transition-all duration-300 h-10 sm:h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                                <span className="hidden sm:inline">Testing Strategy...</span>
                                <span className="sm:hidden">Testing...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span className="hidden sm:inline">Test Strategy</span>
                                <span className="sm:hidden">Test</span>
                              </>
                            )}
                          </Button>
                          
                          {/* ✅ ADDED: Helper message when disabled */}
                          {!effectiveAsteroidParams && (
                            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                              <AlertTriangle className="w-3 h-3 text-plasma-orange" />
                              <span>Run a simulation first to enable strategy testing</span>
                            </div>
                          )}
                        </div>

                        {/* ✅ FIXED: Mission Analysis Container with proper alignment */}
                        {result && (
                          <div className="result-animation space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                            {/* Success Header */}
                            <div className="result-animation flex items-center justify-between">
                              <span className="text-sm font-medium text-quantum-blue">Mission Analysis</span>
                              <Badge className={`${getSuccessBadge(result.successProbability)} text-white px-3 py-1`}>
                                {result.success ? "Viable" : "High Risk"}
                              </Badge>
                            </div>

                            {/* Success Probability */}
                            <div className="result-animation space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm flex items-center space-x-2">
                                  <Target className="w-4 h-4 text-quantum-blue" />
                                  <span>Success Probability</span>
                                </span>
                                <span className={`text-sm font-mono font-bold ${getSuccessColor(result.successProbability)}`}>
                                  {(result.successProbability * 100).toFixed(0)}%
                                </span>
                              </div>
                              <Progress 
                                value={result.successProbability * 100} 
                                className="h-3"
                              />
                            </div>

                            {/* ✅ FIXED: Key Metrics Grid with better alignment */}
                            <div className="result-animation grid grid-cols-2 gap-3">
                              <div className="flex flex-col items-center justify-center text-center p-3 bg-quantum-blue/10 rounded-lg border border-quantum-blue/20 min-h-[80px]">
                                <div className="text-lg font-bold text-quantum-blue">
                                  {formatEnergy(result.energyRequired)}
                                </div>
                                <div className="text-xs text-muted-foreground">Energy Required</div>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center text-center p-3 bg-stellar-cyan/10 rounded-lg border border-stellar-cyan/20 min-h-[80px]">
                                <div className="text-lg font-bold text-stellar-cyan">
                                  {result.timeRequired.toFixed(1)}yr
                                </div>
                                <div className="text-xs text-muted-foreground">Duration</div>
                              </div>
                            </div>

                            {/* Mission Assessment */}
                            <div className={`result-animation p-3 rounded-lg border ${
                              result.success 
                                ? 'border-mission-green/50 bg-mission-green/10' 
                                : 'border-destructive/50 bg-destructive/10'
                            }`}>
                              <div className="flex items-start space-x-2">
                                {result.success ? (
                                  <CheckCircle className="w-4 h-4 text-mission-green mt-0.5 flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                )}
                                <div className="text-xs leading-relaxed">
                                  {result.success ? (
                                    <span className="text-mission-green">
                                      <strong>Mission Viable:</strong> Strategy shows high compatibility with asteroid parameters. 
                                      Recommend for deployment with sufficient preparation time.
                                    </span>
                                  ) : (
                                    <span className="text-destructive">
                                      <strong>High Risk Mission:</strong> Strategy may not be optimal for current parameters. 
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
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison">
              {Object.keys(results).length > 1 ? (
                <div ref={comparisonRef}>
                  <Card className="tab-content-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-quantum">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg sm:text-xl text-quantum-blue">Strategy Comparison</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="text-left py-3 px-2 font-medium text-quantum-blue">Strategy</th>
                              <th className="text-center py-3 px-2 font-medium text-quantum-blue">Success</th>
                              <th className="text-center py-3 px-2 font-medium text-quantum-blue">Duration</th>
                              <th className="text-center py-3 px-2 font-medium text-quantum-blue">Energy</th>
                              <th className="text-center py-3 px-2 font-medium text-quantum-blue">Cost</th>
                              <th className="text-center py-3 px-2 font-medium text-quantum-blue">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(results).map(([strategyId, result]) => {
                              const strategy = strategies.find(s => s.id === strategyId);
                              if (!strategy) return null;
                              
                              return (
                                <tr key={strategyId} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                  <td className="py-3 px-2">
                                    <div className="flex items-center space-x-2">
                                      <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                                      <span className="font-medium">{strategy.name}</span>
                                    </div>
                                  </td>
                                  <td className={`text-center py-3 px-2 font-mono font-bold ${getSuccessColor(result.successProbability)}`}>
                                    {(result.successProbability * 100).toFixed(0)}%
                                  </td>
                                  <td className="text-center py-3 px-2 font-mono">{result.timeRequired.toFixed(1)}yr</td>
                                  <td className="text-center py-3 px-2 font-mono text-stellar-cyan">{formatEnergy(result.energyRequired)}</td>
                                  <td className="text-center py-3 px-2 font-mono text-plasma-orange">{formatCurrency(result.costEstimate)}</td>
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
                </div>
              ) : (
                <div ref={comparisonRef}>
                  <Card className="tab-content-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                    <CardContent className="p-8 sm:p-12 text-center">
                      <div className="p-4 rounded-full bg-gradient-quantum w-fit mx-auto mb-4">
                        <Star className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-quantum-blue mb-2">Test Multiple Strategies</h3>
                      <p className="text-muted-foreground">
                        Test at least two different strategies to see a detailed comparison analysis
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <div ref={timelineRef}>
                <Card className="tab-content-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-quantum">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg sm:text-xl text-quantum-blue">Development Timeline</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {strategies.map((strategy) => (
                      <div key={strategy.id} className="timeline-item flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${strategy.gradientColor}`}>
                          <strategy.icon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-bold text-quantum-blue mb-2">{strategy.name}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm mb-3">
                            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                              <div className="text-xs text-muted-foreground mb-1">Current Phase</div>
                              <div className="font-medium">
                                {strategy.readiness >= 80 ? "Operational" : 
                                 strategy.readiness >= 60 ? "Testing" : "Research"}
                              </div>
                            </div>
                            
                            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                              <div className="text-xs text-muted-foreground mb-1">Deploy Time</div>
                              <div className="font-medium">
                                {strategy.readiness >= 80 ? "2-3 years" : 
                                 strategy.readiness >= 60 ? "5-8 years" : "10+ years"}
                              </div>
                            </div>
                            
                            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                              <div className="text-xs text-muted-foreground mb-1">Readiness</div>
                              <Badge className={`${getReadinessLevel(strategy.readiness).color} text-white`}>
                                TRL {Math.floor(strategy.readiness / 10)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Development Progress</span>
                              <span className="font-mono text-quantum-blue">{strategy.readiness}%</span>
                            </div>
                            <Progress value={strategy.readiness} className="h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <div ref={analysisRef} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Cost-Effectiveness Analysis */}
                  <Card className="analysis-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-plasma-orange to-stellar-cyan">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg text-plasma-orange">Cost Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {strategies.map((strategy) => (
                        <div key={strategy.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                              <span className="text-sm font-medium">{strategy.name}</span>
                            </div>
                            <span className="text-sm font-mono text-plasma-orange">
                              {formatCurrency(strategy.cost)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={strategy.effectiveness} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-xs font-mono text-quantum-blue w-12">
                              {strategy.effectiveness}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card className="analysis-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-mission-green to-quantum-blue">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg text-mission-green">Risk Assessment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {strategies.map((strategy) => {
                        const riskScore = 100 - strategy.readiness;
                        const riskLevel = riskScore < 30 ? "Low" : riskScore < 60 ? "Medium" : "High";
                        const riskColor = riskScore < 30 ? "bg-mission-green" : riskScore < 60 ? "bg-plasma-orange" : "bg-destructive";
                        
                        return (
                          <div key={strategy.id} className="p-3 bg-muted/20 rounded-lg border border-border/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <strategy.icon className={`w-4 h-4 ${strategy.color}`} />
                                <span className="text-sm font-medium">{strategy.name}</span>
                              </div>
                              <Badge className={`${riskColor} text-white text-xs`}>
                                {riskLevel} Risk
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                              <div>Readiness: <span className="font-mono text-quantum-blue">{strategy.readiness}%</span></div>
                              <div>Success: <span className="font-mono text-mission-green">{strategy.successRate}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Strategic Recommendations */}
                <Card className="analysis-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-quantum">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg sm:text-xl text-quantum-blue">Strategic Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-mission-green/10 border border-mission-green/20 rounded-lg">
                      <h4 className="font-bold text-mission-green mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Near-term Strategy (1-5 years)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Deploy kinetic impactor missions for small to medium asteroids (50-500m). 
                        This technology is proven and cost-effective with high readiness levels.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-plasma-orange/10 border border-plasma-orange/20 rounded-lg">
                      <h4 className="font-bold text-plasma-orange mb-2 flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Medium-term Strategy (5-15 years)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Develop gravity tractor capabilities for precise, gentle deflection of medium-sized asteroids. 
                        Ideal for scenarios with long warning times.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-bold text-destructive mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Long-term Strategy (15+ years)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Research and develop nuclear deflection systems for catastrophic threats from large asteroids (500m+). 
                        Address political and technical challenges through international cooperation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
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