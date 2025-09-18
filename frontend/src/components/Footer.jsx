import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Mail, 
  Zap, 
  ExternalLink, 
  Heart,
  MapPin,
  Calendar,
  Users,
  Shield,
  Globe,
  Rocket
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  const projectStats = [
    { icon: Users, label: "Simulations Run", value: "50,000+" },
    { icon: Shield, label: "Threats Detected", value: "1,234" },
    { icon: Globe, label: "Earth Protected", value: "24/7" }
  ];

  const quickLinks = [
    { name: "Impact Calculator", href: "#simulation", icon: Zap },
    { name: "Defense Strategies", href: "#mitigation", icon: Shield },
    { name: "Defend Earth Mode", href: "#gamified", icon: Rocket }
  ];

  const learnLinks = [
    { name: "Asteroid Science", href: "#education", icon: Globe },
    { name: "Impact Physics", href: "#education", icon: Zap },
    { name: "Planetary Defense", href: "#education", icon: Shield }
  ];

  const externalResources = [
    { name: "NASA DART Mission", href: "https://dart.jhuapl.edu/", icon: ExternalLink },
    { name: "ESA Hera Mission", href: "https://www.esa.int/hera", icon: ExternalLink },
    { name: "Asteroid Watch", href: "https://eyes.nasa.gov/apps/asteroids/", icon: ExternalLink }
  ];

  return (
    <footer className="bg-card/30 border-t border-border/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-cosmic-blue rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-cosmic rounded-lg flex items-center justify-center animate-glow-pulse">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
                Meteor Madness
              </span>
            </div>
            
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Advanced asteroid impact simulation platform. Explore cosmic threats, 
              test planetary defense strategies, and protect Earth from celestial destruction 
              through cutting-edge science and technology.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
                <Button type="submit" className="bg-gradient-cosmic hover:shadow-glow">
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Get updates on new features and space threat discoveries
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-cosmic-orange" />
              Simulation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <Separator className="my-6" />

            {/* External Resources */}
            <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
              Space Agencies
            </h4>
            <ul className="space-y-2">
              {externalResources.map((resource) => (
                <li key={resource.name}>
                  <a 
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-cosmic-blue transition-colors group"
                  >
                    <resource.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    <span>{resource.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn & Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cosmic-blue" />
              Learn
            </h3>
            <ul className="space-y-3 mb-8">
              {learnLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Project Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Platform Stats
              </h4>
              {projectStats.map((stat) => (
                <div key={stat.label} className="flex items-center space-x-3">
                  <div className="p-2 bg-muted/20 rounded-lg">
                    <stat.icon className="w-4 h-4 text-cosmic-orange" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Technology Badge */}
        <div className="border-y border-border/30 py-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-primary/50 text-primary">
                <MapPin className="w-3 h-3 mr-1" />
                Global Impact Detection
              </Badge>
              <Badge variant="outline" className="border-cosmic-blue/50 text-cosmic-blue">
                <Calendar className="w-3 h-3 mr-1" />
                Real-time Tracking
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by NASA & ESA data feeds
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-muted-foreground text-sm flex items-center">
              © {currentYear} Meteor Madness. Made with 
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              for planetary defense.
            </p>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="https://github.com/MohammedAmin67" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-cosmic-blue transition-colors p-2 hover:bg-card/50 rounded-lg group"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="mailto:mohammed.amin67@example.com" 
              className="text-muted-foreground hover:text-cosmic-orange transition-colors p-2 hover:bg-card/50 rounded-lg group"
              aria-label="Contact"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Final Credit */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            Built for the future of planetary defense • Inspired by real asteroid threats
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;