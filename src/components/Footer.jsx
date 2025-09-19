import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Mail, 
  ExternalLink, 
  Heart,
  MapPin,
  Calendar,
  Shield,
  Target,
  Activity,
  ArrowUpRight,
  Satellite,
  Code,
  Telescope
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Newsletter subscription logic would go here
    setTimeout(() => {
      console.log("Newsletter subscription:", email);
      setEmail("");
      setIsSubscribing(false);
      // You could show a success message here
    }, 1500);
  };

  const currentYear = new Date().getFullYear();

  const externalResources = [
    { 
      name: "NASA DART Mission", 
      href: "https://dart.jhuapl.edu/", 
      icon: ExternalLink,
      description: "Double Asteroid Redirection Test"
    },
    { 
      name: "ESA Hera Mission", 
      href: "https://www.esa.int/hera", 
      icon: ExternalLink,
      description: "Post-impact asteroid assessment"
    },
    { 
      name: "JPL Asteroid Watch", 
      href: "https://eyes.nasa.gov/apps/asteroids/", 
      icon: ExternalLink,
      description: "Real-time asteroid tracking"
    }
  ];

  const achievements = [
    { text: "Open Source Educational Tool", icon: Code },
    { text: "Real-time Impact Simulation", icon: Activity },
    { text: "Scientific Data Integration", icon: Telescope }
  ];

  return (
    <footer className="bg-card/60 border-t border-border/50 backdrop-blur-sm relative overflow-hidden">
      {/* Professional Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-quantum-blue to-stellar-cyan rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-plasma-orange to-mission-green rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
          
          {/* Brand & Newsletter Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-quantum rounded-xl flex items-center justify-center shadow-command">
                <Satellite className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-quantum-blue bg-clip-text text-transparent">
                  Meteor Madness
                </span>
                <div className="text-xs text-muted-foreground font-medium">
                  by AstroVision
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              Professional asteroid impact simulation platform designed to educate and inform about 
              cosmic threats. Experience advanced planetary defense scenarios through 
              immersive scientific simulations and comprehensive data analysis.
            </p>

            {/* Project Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-quantum-blue uppercase tracking-wider">Project Features</h4>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="border-quantum-blue/30 text-quantum-blue bg-quantum-blue/5 hover:bg-quantum-blue/10 transition-colors text-xs"
                  >
                    <achievement.icon className="w-3 h-3 mr-1" />
                    {achievement.text}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Enhanced Newsletter Signup */}
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-stellar-cyan" />
                <h4 className="font-bold text-stellar-cyan">Project Updates</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Stay informed about new features, simulation improvements, and educational content updates
              </p>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-stellar-cyan transition-colors"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="bg-gradient-quantum hover:shadow-command transition-all duration-300 min-w-[60px]"
                >
                  {isSubscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Reference Sources */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-quantum-blue flex items-center">
              <div className="p-1 rounded-lg bg-stellar-cyan/10 mr-3">
                <ExternalLink className="w-5 h-5 text-stellar-cyan" />
              </div>
              Reference Sources
            </h3>
            
            <p className="text-sm text-muted-foreground">
              Scientific data and mission information sourced from leading space agencies
            </p>

            <div className="space-y-4">
              {externalResources.map((resource) => (
                <a 
                  key={resource.name}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted/10 hover:bg-muted/20 rounded-lg border border-border/30 hover:border-stellar-cyan/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-stellar-cyan/10 rounded-lg group-hover:bg-stellar-cyan/20 transition-colors">
                        <resource.icon className="w-4 h-4 text-stellar-cyan group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-stellar-cyan transition-colors">
                          {resource.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {resource.description}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-stellar-cyan transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Technology & Capabilities Section */}
        <div className="border-y border-border/30 py-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-stellar-cyan/10 text-stellar-cyan border-stellar-cyan/30 px-3 py-1">
                <MapPin className="w-3 h-3 mr-2" />
                Global Impact Detection
              </Badge>
              <Badge className="bg-plasma-orange/10 text-plasma-orange border-plasma-orange/30 px-3 py-1">
                <Calendar className="w-3 h-3 mr-2" />
                Real-time Calculations
              </Badge>
              <Badge className="bg-mission-green/10 text-mission-green border-mission-green/30 px-3 py-1">
                <Shield className="w-3 h-3 mr-2" />
                Defense Modeling
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-mission-green rounded-full animate-pulse" />
              <span className="font-medium">Built with modern web technologies</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6">
            <p className="text-muted-foreground text-sm flex items-center">
              © {currentYear} Meteor Madness. Built with 
              <Heart className="w-4 h-4 mx-2 text-red-500 animate-pulse" />
              by AstroVision.
            </p>        
          </div>

          {/* Social Links - Only GitHub and Email */}
          <div className="flex space-x-3">
            <a 
              href="https://github.com/MohammedAmin67/Meteoric-Madness" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-quantum-blue transition-all duration-300 p-3 hover:bg-quantum-blue/5 rounded-xl group border border-border/30 hover:border-quantum-blue/30"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="mailto:mohammed.amin67@example.com" 
              className="text-muted-foreground hover:text-plasma-orange transition-all duration-300 p-3 hover:bg-plasma-orange/5 rounded-xl group border border-border/30 hover:border-plasma-orange/30"
              aria-label="Contact Email"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Final Mission Statement */}
        <div className="mt-6 pt-4 border-t border-border/30 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-quantum-blue" />
            <p className="text-sm font-medium text-quantum-blue">
              Advancing Planetary Defense Education Through Innovation
            </p>
            <Target className="w-4 h-4 text-quantum-blue" />
          </div>
          <p className="text-xs text-muted-foreground">
            An independent educational project for understanding cosmic threats
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;