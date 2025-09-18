import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, Shield, Globe } from "lucide-react";
import heroImage from "@/assets/hero-space.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Earth from space with approaching asteroid"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cosmic-blue rounded-full animate-twinkle" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cosmic-orange rounded-full animate-twinkle delay-1000" />
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary rounded-full animate-twinkle delay-2000" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
          <span className="bg-gradient-to-r from-primary via-cosmic-blue to-cosmic-orange bg-clip-text text-transparent">
            Meteor Madness
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed">
          Experience the ultimate asteroid impact simulation. Model cosmic threats, 
          test mitigation strategies, and defend our planet from celestial destruction.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:shadow-cosmic transition-all duration-300">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3 animate-glow-pulse" />
            <h3 className="text-lg font-semibold mb-2">Real Physics</h3>
            <p className="text-sm text-muted-foreground">
              Advanced orbital mechanics and impact modeling
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:shadow-cosmic transition-all duration-300">
            <Shield className="w-8 h-8 text-cosmic-blue mx-auto mb-3 animate-glow-pulse" />
            <h3 className="text-lg font-semibold mb-2">Mitigation</h3>
            <p className="text-sm text-muted-foreground">
              Test kinetic impactors and gravity tractors
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:shadow-cosmic transition-all duration-300">
            <Globe className="w-8 h-8 text-cosmic-orange mx-auto mb-3 animate-glow-pulse" />
            <h3 className="text-lg font-semibold mb-2">Defend Earth</h3>
            <p className="text-sm text-muted-foreground">
              Gamified missions to save humanity
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-cosmic hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
            onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Simulation
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/50 hover:border-primary hover:bg-primary/10 text-lg px-8 py-4"
            onClick={() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;