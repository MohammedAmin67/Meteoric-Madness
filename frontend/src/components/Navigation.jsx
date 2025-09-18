import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Zap, Target, Brain, Info, Github, Settings } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Simulation", href: "#simulation", icon: Zap, section: "simulation" },
    { name: "Mitigation", href: "#mitigation", icon: Target, section: "mitigation" },
    { name: "Defend Earth", href: "#gamified", icon: Brain, section: "gamified" },
    { name: "Learn", href: "#education", icon: Info, section: "education" },
  ];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.section);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      } else if (window.scrollY < 100) {
        setActiveSection("home");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (href, section) => {
    setActiveSection(section);
    setIsOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    setActiveSection("home");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg' 
        : 'bg-background/80 backdrop-blur-lg border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={scrollToTop}
          >
            <div className={`w-10 h-10 bg-gradient-cosmic rounded-xl flex items-center justify-center transition-all duration-300`}>
              <Zap className="w-6 h-6 text-primary-foreground group-hover:shadow-glow" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-cosmic-blue bg-clip-text text-transparent">
                Meteor Madness
              </span>
              <div className="text-xs text-muted-foreground hidden sm:block">
                Asteroid Impact Simulator
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.section)}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      isActive 
                        ? 'text-primary bg-primary/10 shadow-glow' 
                        : 'text-foreground hover:text-primary hover:bg-card/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-all duration-300 ${
                      isActive ? 'animate-glow-pulse' : 'group-hover:animate-glow-pulse'
                    }`} />
                    <span>{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
              
              {/* GitHub Link */}
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 hover:bg-card/50 group"
                onClick={() => window.open('https://github.com/MohammedAmin67/Meteor-Madness', '_blank')}
              >
                <Github className="w-4 h-4 group-hover:animate-pulse" />
                <span className="hidden lg:inline ml-2">GitHub</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Notification indicator */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-card/50"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-cosmic-orange animate-pulse" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-card/50 transition-all duration-300"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
                <X className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                }`} />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`md:hidden fixed inset-0 transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Items */}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.section;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.section)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 transform ${
                    isActive 
                      ? 'text-primary bg-primary/10 shadow-glow scale-105' 
                      : 'text-foreground hover:text-primary hover:bg-muted/50 hover:scale-105'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? 'slideInRight 0.5s ease-out forwards' : 'none'
                  }}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-primary/20' : 'bg-muted/50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'animate-glow-pulse' : ''
                    }`} />
                  </div>
                  <div>
                    <div className="text-base">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.name === 'Simulation' && 'Configure asteroid parameters'}
                      {item.name === 'Mitigation' && 'Planetary defense strategies'}
                      {item.name === 'Defend Earth' && 'Interactive game mode'}
                      {item.name === 'Learn' && 'Educational content hub'}
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
            
            {/* Divider */}
            <div className="border-t border-border/50 my-4" />
            
            {/* Additional Mobile Options */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  window.open('https://github.com/MohammedAmin67/Meteor-Madness', '_blank');
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-muted/50">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-medium">View on GitHub</div>
                  <div className="text-xs text-muted-foreground">Source code and documentation</div>
                </div>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-muted/50">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Customize your experience</div>
                </div>
                <Badge className="ml-auto bg-cosmic-orange text-white text-xs">New</Badge>
              </button>
            </div>
            
            {/* User Info */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-cosmic rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">MA</span>
                </div>
                <div>
                  <div className="text-sm font-medium">MohammedAmin67</div>
                  <div className="text-xs text-muted-foreground">Asteroid Defense Researcher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;