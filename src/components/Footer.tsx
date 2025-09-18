import { Github, Twitter, Mail, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/30 border-t border-border/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-cosmic rounded-lg flex items-center justify-center animate-glow-pulse">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
                Meteor Madness
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Advanced asteroid impact simulation platform. Explore cosmic threats, 
              test planetary defense strategies, and protect Earth from celestial destruction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Simulation</h3>
            <ul className="space-y-2">
              <li>
                <a href="#simulation" className="text-muted-foreground hover:text-primary transition-colors">
                  Impact Calculator
                </a>
              </li>
              <li>
                <a href="#mitigation" className="text-muted-foreground hover:text-primary transition-colors">
                  Defense Strategies
                </a>
              </li>
              <li>
                <a href="#gamified" className="text-muted-foreground hover:text-primary transition-colors">
                  Defend Earth Mode
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <a href="#education" className="text-muted-foreground hover:text-primary transition-colors">
                  Asteroid Science
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Impact Physics
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Planetary Defense
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Meteor Madness. Protecting Earth through simulation.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg"
              aria-label="Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;