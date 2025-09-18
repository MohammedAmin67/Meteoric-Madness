import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  RotateCcw
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

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-success';
      case 'medium': return 'text-cosmic-orange';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section id="gamified" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-orange bg-clip-text text-transparent">
              Defend Earth - Game Mode
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your planetary defense skills in challenging scenarios. Save humanity from cosmic threats!
          </p>
        </div>

        {!gameState.scenario ? (
          // Scenario Selection
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="bg-card/50 border-border/50 backdrop-blur-sm hover:shadow-cosmic transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{scenario.name}</span>
                    <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white`}>
                      {scenario.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {scenario.description}
                  </p>

                  {/* Asteroid Info */}
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1 text-cosmic-orange" />
                      Threat: {scenario.asteroid.name}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-1 font-medium">{scenario.asteroid.size}m</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="ml-1 font-medium">{scenario.asteroid.velocity}km/s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1 font-medium capitalize">{scenario.asteroid.composition}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk:</span>
                        <span className={`ml-1 font-medium capitalize ${getRiskColor(scenario.asteroid.riskLevel)}`}>
                          {scenario.asteroid.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-cosmic-blue" />
                      Mission Objectives
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {scenario.objectives.map((objective, index) => (
                        <li key={index}>• {objective}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Time Limit */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="text-muted-foreground">Time Limit:</span>
                    </div>
                    <span className="font-semibold">{scenario.timeLimit} years</span>
                  </div>

                  <Button
                    onClick={() => startScenario(scenario)}
                    className="w-full bg-gradient-cosmic hover:shadow-glow transition-all duration-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Mission
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Active Game
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Status */}
            <Card className="lg:col-span-1 bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-cosmic-orange" />
                  <span>Mission Status</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Scenario Name */}
                <div>
                  <h3 className="text-lg font-bold">{gameState.scenario.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {gameState.scenario.description}
                  </p>
                </div>

                {/* Timer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Remaining</span>
                    <span className={`font-mono font-bold ${
                      gameState.timeRemaining < 30 ? 'text-destructive' : 'text-foreground'
                    }`}>
                      {formatTime(gameState.timeRemaining)}
                    </span>
                  </div>
                  <Progress 
                    value={(gameState.timeRemaining / (gameState.scenario.timeLimit * 60)) * 100}
                    className="h-2"
                  />
                </div>

                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Score</span>
                  <span className="text-2xl font-bold text-primary">{gameState.score}</span>
                </div>

                {/* Objectives */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Objectives</h4>
                  <div className="space-y-1">
                    {gameState.scenario.objectives.map((objective, index) => {
                      const isCompleted = gameState.completedObjectives.includes(objective);
                      return (
                        <div key={index} className={`flex items-center space-x-2 text-sm ${
                          isCompleted ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                          )}
                          <span className={isCompleted ? 'line-through' : ''}>{objective}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mission Status */}
                {gameState.missionStatus !== 'pending' && (
                  <div className={`p-3 rounded-lg border ${
                    gameState.missionStatus === 'success' 
                      ? 'border-success/50 bg-success/10' 
                      : 'border-destructive/50 bg-destructive/10'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {gameState.missionStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                      <span className={`font-semibold ${
                        gameState.missionStatus === 'success' ? 'text-success' : 'text-destructive'
                      }`}>
                        {gameState.missionStatus === 'success' ? 'Mission Successful!' : 'Mission Failed!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full border-border hover:border-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Mission
                </Button>
              </CardContent>
            </Card>

            {/* Strategy Selection */}
            <Card className="lg:col-span-2 bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-cosmic-blue" />
                  <span>Choose Your Strategy</span>
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
                        cost: 'Moderate'
                      },
                      {
                        id: 'gravity_tractor',
                        name: 'Gravity Tractor',
                        icon: Zap,
                        effectiveness: 'Gentle but slow',
                        time: 'Long mission duration',
                        cost: 'High fuel requirements'
                      },
                      {
                        id: 'nuclear_deflection',
                        name: 'Nuclear Deflection',
                        icon: AlertTriangle,
                        effectiveness: 'Maximum power',
                        time: 'Fast execution',
                        cost: 'Very high'
                      }
                    ].map((strategy) => {
                      const Icon = strategy.icon;
                      const isSelected = gameState.selectedStrategy === strategy.id;
                      
                      return (
                        <Button
                          key={strategy.id}
                          onClick={() => selectStrategy(strategy.id)}
                          disabled={!!gameState.selectedStrategy || gameState.missionStatus !== 'pending'}
                          className={`h-auto p-4 flex flex-col items-center space-y-3 ${
                            isSelected 
                              ? 'bg-gradient-cosmic shadow-glow' 
                              : 'bg-muted/20 hover:bg-muted/40 text-foreground'
                          }`}
                          variant={isSelected ? "default" : "outline"}
                        >
                          <Icon className="w-8 h-8" />
                          <div className="text-center">
                            <div className="font-semibold">{strategy.name}</div>
                            <div className="text-xs mt-2 space-y-1">
                              <div>⚡ {strategy.effectiveness}</div>
                              <div>⏱️ {strategy.time}</div>
                              <div>💰 {strategy.cost}</div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {gameState.missionStatus === 'success' ? 'Congratulations!' : 
                       gameState.missionStatus === 'failure' ? 'Mission Failed' : 
                       'Mission Complete'}
                    </h3>
                    <p className="text-muted-foreground">
                      {gameState.missionStatus === 'success' ? 
                        'You successfully defended Earth from the asteroid threat!' :
                        'The asteroid impact could not be prevented. Try again with a different strategy.'}
                    </p>
                    
                    {gameState.missionStatus !== 'pending' && (
                      <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                          Final Score: {gameState.score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Objectives Completed: {gameState.completedObjectives.length}/{gameState.scenario.objectives.length}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameMode;