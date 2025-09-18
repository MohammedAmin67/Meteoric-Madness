import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Award,
  Users,
  Flame
} from "lucide-react";
import { getGameScenarios } from "@/services/mockApi";

const GameMode = () => {
  const [scenarios, setScenarios] = useState([]);
  const [gameState, setGameState] = useState({
    scenario: null,
    isPlaying: false,
    timeRemaining: 0,
    score: 0,
    completedObjectives: [],
    selectedStrategy: null,
    missionStatus: 'pending'
  });
  const [selectedTab, setSelectedTab] = useState("scenarios");

  useEffect(() => {
    loadScenarios();
  }, []);

  // Game timer
  useEffect(() => {
    let interval;
    
    if (gameState.isPlaying && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameState.isPlaying && gameState.timeRemaining === 0) {
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.timeRemaining]);

  const loadScenarios = async () => {
    try {
      const scenarioData = await getGameScenarios();
      setScenarios(scenarioData);
    } catch (error) {
      console.error("Failed to load scenarios:", error);
    }
  };

  const startScenario = (scenario) => {
    setGameState({
      scenario,
      isPlaying: true,
      timeRemaining: scenario.timeLimit * 60, // Convert minutes to seconds
      score: 0,
      completedObjectives: [],
      selectedStrategy: null,
      missionStatus: 'pending'
    });
    setSelectedTab("mission");
  };

  const selectStrategy = (strategy) => {
    if (!gameState.isPlaying) return;

    setGameState(prev => ({ ...prev, selectedStrategy: strategy }));
    
    // Simulate strategy execution
    setTimeout(() => {
      executeStrategy(strategy);
    }, 2000);
  };

  const executeStrategy = (strategy) => {
    if (!gameState.scenario) return;

    const { asteroid } = gameState.scenario;
    let success = false;
    let scoreGained = 0;
    let objectivesCompleted = [];

    // Calculate success based on asteroid properties and strategy
    switch (strategy) {
      case 'kinetic_impactor':
        success = asteroid.size < 500;
        scoreGained = success ? 1000 : 200;
        if (success) objectivesCompleted = ['Prevent impact'];
        break;
        
      case 'gravity_tractor':
        success = asteroid.size < 300 && gameState.timeRemaining > 60;
        scoreGained = success ? 1500 : 300;
        if (success) objectivesCompleted = ['Prevent impact', 'Minimize casualties'];
        break;
        
      case 'nuclear_deflection':
        success = asteroid.size < 1000;
        scoreGained = success ? 2000 : 100;
        if (success) objectivesCompleted = ['Prevent impact', 'Maximum efficiency'];
        break;
      
      default:
        success = false;
        scoreGained = 0;
        break;
    }

    // Time bonus
    const timeBonus = Math.floor(gameState.timeRemaining / 10);
    scoreGained += timeBonus;

    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreGained,
      completedObjectives: [...prev.completedObjectives, ...objectivesCompleted],
      missionStatus: success ? 'success' : 'failure',
      isPlaying: false
    }));
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      missionStatus: 'failure',
      isPlaying: false
    }));
  };

  const resetGame = () => {
    setGameState({
      scenario: null,
      isPlaying: false,
      timeRemaining: 0,
      score: 0,
      completedObjectives: [],
      selectedStrategy: null,
      missionStatus: 'pending'
    });
    setSelectedTab("scenarios");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-cosmic-orange';
      case 'hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return Shield;
      case 'medium': return Target;
      case 'hard': return Flame;
      default: return Star;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-success';
      case 'medium': return 'text-cosmic-orange';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreRating = (score) => {
    if (score >= 2000) return { rating: "Legendary", color: "text-primary", icon: Star };
    if (score >= 1500) return { rating: "Expert", color: "text-cosmic-blue", icon: Award };
    if (score >= 1000) return { rating: "Skilled", color: "text-success", icon: Trophy };
    if (score >= 500) return { rating: "Novice", color: "text-cosmic-orange", icon: Target };
    return { rating: "Trainee", color: "text-muted-foreground", icon: Shield };
  };

  return (
    <section id="gamified" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-orange bg-clip-text text-transparent">
              Defend Earth - Game Mode
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your planetary defense skills in challenging scenarios. Save humanity from cosmic threats!
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-muted/30 h-auto">
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3">
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="mission" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3" disabled={!gameState.scenario}>
              Mission
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm p-2 sm:p-3 col-span-2 sm:col-span-1">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {scenarios.map((scenario) => {
                const DifficultyIcon = getDifficultyIcon(scenario.difficulty);
                
                return (
                  <Card key={scenario.id} className="bg-card/60 border-border/50 backdrop-blur-sm hover:shadow-cosmic transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DifficultyIcon className="w-5 h-5 text-cosmic-blue" />
                          <span className="text-lg">{scenario.name}</span>
                        </div>
                        <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white text-xs`}>
                          {scenario.difficulty}
                        </Badge>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {scenario.description}
                      </p>

                      {/* Asteroid Info - Enhanced */}
                      <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                        <h4 className="text-sm font-semibold mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-cosmic-orange" />
                          Threat: {scenario.asteroid.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">{scenario.asteroid.size}m</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Speed:</span>
                            <span className="font-medium">{scenario.asteroid.velocity}km/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium capitalize">{scenario.asteroid.composition}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Risk:</span>
                            <span className={`font-medium capitalize ${getRiskColor(scenario.asteroid.riskLevel)}`}>
                              {scenario.asteroid.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Objectives - Enhanced */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-cosmic-blue" />
                          Mission Objectives
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1 pl-6">
                          {scenario.objectives.map((objective, objIndex) => (
                            <li key={objIndex} className="flex items-start space-x-2">
                              <span className="text-cosmic-blue mt-0.5">•</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Mission Details */}
                      <div className="flex items-center justify-between text-sm p-3 bg-muted/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-warning" />
                          <span className="text-muted-foreground">Time Limit:</span>
                        </div>
                        <span className="font-semibold">{scenario.timeLimit} minutes</span>
                      </div>

                      <Button
                        onClick={() => startScenario(scenario)}
                        className="w-full bg-gradient-cosmic hover:shadow-glow transition-all duration-300 h-12 group-hover:scale-105"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Mission
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Mission Tab */}
          <TabsContent value="mission">
            {gameState.scenario ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Game Status - Enhanced */}
                <Card className="lg:col-span-1 bg-card/60 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-cosmic-orange" />
                      <span>Mission Control</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Scenario Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold">{gameState.scenario.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {gameState.scenario.description}
                      </p>
                    </div>

                    {/* Timer - Enhanced */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Time Remaining</span>
                        <span className={`font-mono font-bold text-lg ${
                          gameState.timeRemaining < 30 ? 'text-destructive animate-pulse' : 
                          gameState.timeRemaining < 60 ? 'text-warning' : 'text-foreground'
                        }`}>
                          {formatTime(gameState.timeRemaining)}
                        </span>
                      </div>
                      <Progress 
                        value={(gameState.timeRemaining / (gameState.scenario.timeLimit * 60)) * 100}
                        className="h-3 bg-muted/30"
                      />
                      {gameState.timeRemaining < 30 && (
                        <div className="text-xs text-destructive font-medium animate-pulse">
                          ⚠️ Critical time remaining!
                        </div>
                      )}
                    </div>

                    {/* Score - Enhanced */}
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-cosmic-blue/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mission Score</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{gameState.score}</div>
                          <div className="text-xs text-muted-foreground">
                            {getScoreRating(gameState.score).rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Objectives - Enhanced */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Mission Objectives</h4>
                      <div className="space-y-2">
                        {gameState.scenario.objectives.map((objective, objIndex) => {
                          const isCompleted = gameState.completedObjectives.includes(objective);
                          return (
                            <div key={objIndex} className={`flex items-center space-x-3 p-2 rounded transition-colors ${
                              isCompleted ? 'text-success bg-success/10' : 'text-muted-foreground'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                              )}
                              <span className={`text-sm ${isCompleted ? 'line-through' : ''}`}>
                                {objective}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mission Status */}
                    {gameState.missionStatus !== 'pending' && (
                      <div className={`p-4 rounded-lg border ${
                        gameState.missionStatus === 'success' 
                          ? 'border-success/50 bg-success/10' 
                          : 'border-destructive/50 bg-destructive/10'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {gameState.missionStatus === 'success' ? (
                            <CheckCircle className="w-6 h-6 text-success" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                          )}
                          <div>
                            <div className={`font-semibold ${
                              gameState.missionStatus === 'success' ? 'text-success' : 'text-destructive'
                            }`}>
                              {gameState.missionStatus === 'success' ? 'Mission Successful!' : 'Mission Failed!'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {gameState.missionStatus === 'success' 
                                ? 'Earth has been saved from the asteroid threat!'
                                : 'The asteroid impact could not be prevented.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reset Button */}
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full border-border hover:border-primary h-12"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Mission
                    </Button>
                  </CardContent>
                </Card>

                {/* Strategy Selection - Enhanced */}
                <Card className="lg:col-span-2 bg-card/60 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-cosmic-blue" />
                      <span>Choose Your Defense Strategy</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {gameState.isPlaying ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            id: 'kinetic_impactor',
                            name: 'Kinetic Impactor',
                            icon: Target,
                            effectiveness: 'High for small asteroids',
                            time: 'Quick deployment',
                            cost: 'Moderate',
                            color: 'text-cosmic-orange'
                          },
                          {
                            id: 'gravity_tractor',
                            name: 'Gravity Tractor',
                            icon: Zap,
                            effectiveness: 'Gentle but slow',
                            time: 'Long mission duration',
                            cost: 'High fuel requirements',
                            color: 'text-cosmic-blue'
                          },
                          {
                            id: 'nuclear_deflection',
                            name: 'Nuclear Deflection',
                            icon: AlertTriangle,
                            effectiveness: 'Maximum power',
                            time: 'Fast execution',
                            cost: 'Very high',
                            color: 'text-warning'
                          }
                        ].map((strategy) => {
                          const Icon = strategy.icon;
                          const isSelected = gameState.selectedStrategy === strategy.id;
                          
                          return (
                            <Button
                              key={strategy.id}
                              onClick={() => selectStrategy(strategy.id)}
                              disabled={!!gameState.selectedStrategy || gameState.missionStatus !== 'pending'}
                              className={`h-auto p-6 flex flex-col items-center space-y-4 transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-gradient-cosmic shadow-glow scale-105' 
                                  : 'bg-muted/20 hover:bg-muted/40 text-foreground hover:scale-105'
                              }`}
                              variant={isSelected ? "default" : "outline"}
                            >
                              <Icon className={`w-10 h-10 ${isSelected ? 'text-white' : strategy.color}`} />
                              <div className="text-center space-y-2">
                                <div className="font-semibold text-base">{strategy.name}</div>
                                <div className="text-xs space-y-1 opacity-90">
                                  <div className="flex items-center justify-center space-x-1">
                                    <span>⚡</span>
                                    <span>{strategy.effectiveness}</span>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <span>⏱️</span>
                                    <span>{strategy.time}</span>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <span>💰</span>
                                    <span>{strategy.cost}</span>
                                  </div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="w-20 h-20 text-muted-foreground mx-auto mb-6 animate-pulse" />
                        <h3 className="text-2xl font-semibold mb-3">
                          {gameState.missionStatus === 'success' ? 'Mission Accomplished!' : 
                           gameState.missionStatus === 'failure' ? 'Mission Failed' : 
                           'Mission Complete'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {gameState.missionStatus === 'success' ? 
                            'You successfully defended Earth from the asteroid threat!' :
                            'The asteroid impact could not be prevented. Try again with a different strategy.'}
                        </p>
                        
                        {gameState.missionStatus !== 'pending' && (
                          <div className="max-w-md mx-auto p-6 bg-muted/20 rounded-lg border border-border/50">
                            <div className="text-3xl font-bold text-primary mb-2">
                              Final Score: {gameState.score}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">
                              Objectives Completed: {gameState.completedObjectives.length}/{gameState.scenario.objectives.length}
                            </div>
                            <Badge className={`${getScoreRating(gameState.score).color.replace('text-', 'bg-')} text-white`}>
                              {getScoreRating(gameState.score).rating} Performance
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Mission</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a scenario from the Scenarios tab to begin your planetary defense mission.
                  </p>
                  <Button onClick={() => setSelectedTab("scenarios")}>
                    <Play className="w-4 h-4 mr-2" />
                    Choose Scenario
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-cosmic-orange" />
                  <span>Global Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock leaderboard data */}
                  {[
                    { rank: 1, name: "AsteroidHunter", score: 2850, missions: 12, icon: "🏆" },
                    { rank: 2, name: "PlanetDefender", score: 2640, missions: 15, icon: "🥈" },
                    { rank: 3, name: "CosmicGuardian", score: 2420, missions: 8, icon: "🥉" },
                    { rank: 4, name: "SpaceVigilant", score: 2180, missions: 11, icon: "🌟" },
                    { rank: 5, name: "EarthProtector", score: 1950, missions: 9, icon: "🛡️" }
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{player.icon}</div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {player.missions} missions completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{player.score}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Complete missions to earn points and climb the global rankings!
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default GameMode;