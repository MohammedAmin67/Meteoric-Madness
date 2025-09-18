import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Telescope, 
  Shield, 
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Calculator,
  Info,
  Atom
} from "lucide-react";

const EducationalContent = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const educationalSections = {
    science: {
      title: "Asteroid Science",
      icon: Telescope,
      color: "text-cosmic-blue",
      topics: [
        {
          id: "composition",
          title: "Asteroid Composition",
          level: "Beginner",
          content: `Asteroids are rocky, metallic, or icy remnants left over from the early formation of our solar system. 
          
**Main Types:**
• **C-type (Carbonaceous)**: Dark, carbon-rich, most common (75%)
• **S-type (Silicaceous)**: Stony, silicon and nickel-iron composition (17%) 
• **M-type (Metallic)**: Mostly nickel-iron, potentially valuable for mining (8%)

The composition directly affects impact dynamics - metallic asteroids are denser and cause more damage, while icy asteroids may fragment more easily in the atmosphere.`,
          keyFacts: [
            "Over 1 million asteroids larger than 1km exist",
            "Most asteroids orbit between Mars and Jupiter",
            "Some contain precious metals worth trillions of dollars"
          ]
        },
        {
          id: "orbits",
          title: "Orbital Mechanics",
          level: "Intermediate", 
          content: `Asteroid orbits follow Kepler's laws of planetary motion. Understanding these principles is crucial for predicting impact trajectories and planning deflection missions.

**Key Orbital Elements:**
• **Semi-major axis**: Size of the orbit
• **Eccentricity**: How elliptical the orbit is
• **Inclination**: Tilt relative to Earth's orbital plane
• **Argument of periapsis**: Orientation of closest approach

**Potentially Hazardous Objects (PHOs)** are asteroids larger than 140m that come within 0.05 AU (7.5 million km) of Earth's orbit.`,
          keyFacts: [
            "Apollo asteroids cross Earth's orbit",
            "Aten asteroids have orbits mostly inside Earth's",
            "Amor asteroids approach but don't cross Earth's orbit"
          ]
        }
      ]
    },
    physics: {
      title: "Impact Physics",
      icon: Atom,
      color: "text-cosmic-orange",
      topics: [
        {
          id: "energy",
          title: "Kinetic Energy & Impact Dynamics",
          level: "Advanced",
          content: `The devastation from an asteroid impact comes from the enormous kinetic energy released on collision.

**Energy Formula**: KE = ½mv²
Where m is mass and v is velocity

**Key Relationships:**
• Energy increases with the **square** of velocity
• A 10km/s asteroid has 4x more energy than a 5km/s asteroid of the same size
• Impact angle affects energy transfer - steeper angles deliver more energy to the ground

**Crater Formation:**
Simple craters form from smaller impacts, complex craters (with central peaks and terraced walls) form from larger impacts exceeding ~2-4km diameter on Earth.`,
          keyFacts: [
            "Chicxulub impactor released ~100 million megatons of energy", 
            "Impact velocity on Earth ranges from 11-72 km/s",
            "Ocean impacts can generate devastating tsunamis"
          ]
        },
        {
          id: "atmosphere",
          title: "Atmospheric Entry Effects", 
          level: "Intermediate",
          content: `Earth's atmosphere provides significant protection against smaller asteroids through atmospheric entry heating and fragmentation.

**Entry Process:**
1. **Initial heating** at ~120km altitude
2. **Ablation** - surface material vaporizes and is stripped away
3. **Fragmentation** - thermal and aerodynamic stresses break apart weaker asteroids
4. **Airburst** - explosion in atmosphere for fragmented objects

**Size Thresholds:**
• <25m: Usually burn up completely (like Chelyabinsk meteor)
• 25-140m: May partially survive, create local damage
• >140m: Survive to impact, cause regional destruction
• >1km: Global climate effects, mass extinction potential`,
          keyFacts: [
            "Earth's atmosphere stops ~15,000 tons of meteors annually",
            "Chelyabinsk meteor (2013) was only ~20m across",
            "Tunguska event (1908) flattened 2,000 km² of forest"
          ]
        }
      ]
    },
    defense: {
      title: "Planetary Defense",
      icon: Shield, 
      color: "text-success",
      topics: [
        {
          id: "detection",
          title: "Detection & Tracking Systems",
          level: "Beginner",
          content: `Early detection is humanity's first line of defense against asteroid threats. Multiple ground and space-based systems continuously scan the sky.

**Major Detection Programs:**
• **LINEAR** (US): Discovers ~65% of near-Earth asteroids  
• **NEOWISE** (Space): Infrared detection and characterization
• **Catalina Sky Survey** (US): High-productivity ground survey
• **ESA Space Situational Awareness**: European detection network

**Detection Challenges:**
• Asteroids are dark and reflect little light
• Most dangerous ones approach from the Sun's direction
• Small asteroids are detected only hours before impact

**Future Systems:**
• **NEO Surveyor** (2028): Dedicated space telescope
• **Ground-based telescopes** with improved sensitivity`,
          keyFacts: [
            "Over 90% of 1km+ near-Earth asteroids are now catalogued",
            "Only ~40% of 140m+ asteroids have been found",
            "New asteroids are discovered daily"
          ]
        },
        {
          id: "deflection",
          title: "Deflection Technologies",
          level: "Advanced",
          content: `Multiple technologies exist to deflect threatening asteroids, each with different advantages depending on the scenario.

**Kinetic Impactor:**
• Spacecraft crashes into asteroid at high speed
• Changes velocity by momentum transfer
• **DART mission (2022)** successfully demonstrated this technique on Dimorphos

**Gravity Tractor:**
• Spacecraft hovers near asteroid, using gravitational attraction
• Very gentle but requires long mission duration
• Best for small course corrections with ample warning time

**Nuclear Deflection:**
• Nuclear explosion near (not on) asteroid surface
• Maximum energy transfer possible
• Risk of fragmenting asteroid into multiple threats

**Ion Beam Shepherd:**
• Spacecraft uses ion beam to gradually push asteroid
• Experimental concept with potential for precise control`,
          keyFacts: [
            "DART changed Dimorphos orbit by 32 minutes",
            "Nuclear deflection could work on asteroids up to several km",
            "Gravity tractor requires decades of advance warning"
          ]
        }
      ]
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-success';
      case 'Intermediate': return 'bg-cosmic-orange';
      case 'Advanced': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
              Asteroid Science Hub
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dive deep into the science behind asteroid impacts, orbital mechanics, and planetary defense strategies
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="physics">Physics</TabsTrigger>
            <TabsTrigger value="defense">Defense</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(educationalSections).map(([key, section]) => {
                const Icon = section.icon;
                return (
                  <Card key={key} className="bg-card/50 border-border/50 backdrop-blur-sm hover:shadow-cosmic transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${section.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span>{section.title}</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {section.topics.map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/20 transition-colors">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{topic.title}</span>
                            </div>
                            <Badge className={`${getLevelColor(topic.level)} text-white text-xs`}>
                              {topic.level}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full border-border hover:border-primary group"
                        onClick={() => {
                          // Switch to the section tab
                          const tabTrigger = document.querySelector(`[value="${key}"]`);
                          tabTrigger?.click();
                        }}
                      >
                        <span>Explore {section.title}</span>
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Facts */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-cosmic-orange" />
                  <span>Did You Know?</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-cosmic-blue">Detection Facts</h4>
                    <p className="text-sm text-muted-foreground">
                      NASA&apos;s automated systems discover about 3,000 new near-Earth asteroids every year
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-cosmic-orange">Impact History</h4>
                    <p className="text-sm text-muted-foreground">
                      The Chicxulub impact 66 million years ago created a crater 180km wide and ended the dinosaurs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-success">Future Missions</h4>
                    <p className="text-sm text-muted-foreground">
                      ESA&apos;s Hera mission will study the DART impact site in detail when it arrives in 2026
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Section Tabs */}
          {Object.entries(educationalSections).map(([key, section]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Topic List */}
                <Card className="lg:col-span-1 bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <section.icon className={`w-5 h-5 ${section.color}`} />
                      <span>Topics</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {section.topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant={selectedTopic === topic.id ? "default" : "ghost"}
                        className={`w-full justify-start h-auto p-3 ${
                          selectedTopic === topic.id ? 'bg-gradient-cosmic shadow-glow' : ''
                        }`}
                        onClick={() => setSelectedTopic(topic.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{topic.title}</div>
                          <Badge className={`${getLevelColor(topic.level)} text-white text-xs mt-1`}>
                            {topic.level}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Content Display */}
                <div className="lg:col-span-3">
                  {selectedTopic ? (
                    (() => {
                      const topic = section.topics.find(t => t.id === selectedTopic);
                      if (!topic) return null;

                      return (
                        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{topic.title}</span>
                              <Badge className={`${getLevelColor(topic.level)} text-white`}>
                                {topic.level}
                              </Badge>
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            {/* Main Content */}
                            <div className="prose prose-invert max-w-none">
                              <div className="text-foreground whitespace-pre-line leading-relaxed">
                                {topic.content}
                              </div>
                            </div>

                            {/* Key Facts */}
                            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                              <h4 className="font-semibold mb-3 flex items-center">
                                <Info className="w-4 h-4 mr-2 text-cosmic-blue" />
                                Key Facts
                              </h4>
                              <ul className="space-y-2">
                                {topic.keyFacts.map((fact, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm">
                                    <span className="text-cosmic-blue mt-0.5">•</span>
                                    <span>{fact}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Additional Resources */}
                            <div className="pt-4 border-t border-border/50">
                              <h4 className="font-semibold mb-3">Learn More</h4>
                              <div className="flex flex-wrap gap-3">
                                <Button variant="outline" size="sm" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-white">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  NASA Resources
                                </Button>
                                <Button variant="outline" size="sm" className="border-cosmic-orange text-cosmic-orange hover:bg-cosmic-orange hover:text-white">
                                  <Calculator className="w-4 h-4 mr-2" />
                                  Try Simulation
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()
                  ) : (
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <section.icon className={`w-16 h-16 ${section.color} mx-auto mb-4 animate-pulse`} />
                        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                        <p className="text-muted-foreground">
                          Select a topic from the left to dive deep into {section.title.toLowerCase()}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default EducationalContent;