import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Shield, Target, Zap, BookOpen, Settings, Satellite } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Threat Analysis", href: "#simulation", icon: Zap, section: "simulation" },
    { name: "Defense Systems", href: "#mitigation", icon: Shield, section: "mitigation" },
    { name: "Command Center", href: "#gamified", icon: Target, section: "gamified" },
    { name: "Intel Hub", href: "#education", icon: BookOpen, section: "education" },
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
        ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-command' 
        : 'bg-background/80 backdrop-blur-lg border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Professional Logo */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={scrollToTop}
          >
            {/* Shield Icon */}
            <div className={`relative w-12 h-12 bg-gradient-quantum rounded-xl flex items-center justify-center transition-all duration-300 group-hover:quantum-glow group-hover:scale-110 shadow-command`}>
              <Shield className="w-7 h-7 text-white drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-stellar-cyan/20 to-transparent rounded-xl animate-pulse-glow"></div>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col justify-center pb-6">
              <h1 className="text-2xl font-bold leading-none mb-0.5">
                <span className="bg-gradient-to-r from-quantum-blue via-stellar-cyan to-plasma-orange bg-clip-text text-transparent drop-shadow-sm">
                  AstroGuard
                </span>
              </h1>
              <div className="text-md font-bold tracking-[0.2em] text-stellar-cyan uppercase leading-none opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                IMPACT LAB
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
                        ? 'text-quantum-blue bg-quantum-blue/10 shadow-command border border-quantum-blue/30' 
                        : 'text-foreground hover:text-quantum-blue hover:bg-card/50 border border-transparent hover:border-quantum-blue/20'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-all duration-300 ${
                      isActive ? 'text-quantum-blue animate-pulse-glow' : 'group-hover:text-quantum-blue group-hover:animate-pulse-glow'
                    }`} />
                    <span className="hidden lg:inline">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-quantum-blue rounded-full shadow-command" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Status indicator */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-card/50 border border-transparent hover:border-quantum-blue/20"
              >
                <Satellite className="w-4 h-4 text-foreground" />
              </Button>
              <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-mission-green animate-pulse" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-card/50 transition-all duration-300 border border-transparent hover:border-quantum-blue/20"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-300 text-foreground ${
                  isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
                <X className={`absolute inset-0 w-5 h-5 transition-all duration-300 text-foreground ${
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
          className={`absolute inset-0 bg-background/90 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-16 left-0 right-0 card-command border-b border-border transform transition-all duration-300 ${
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
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 transform border ${
                    isActive 
                      ? 'text-quantum-blue bg-quantum-blue/10 shadow-command scale-105 border-quantum-blue/30' 
                      : 'text-foreground hover:text-quantum-blue hover:bg-muted/50 hover:scale-105 border-transparent hover:border-quantum-blue/20'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? 'slideInRight 0.5s ease-out forwards' : 'none'
                  }}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-quantum-blue/20 shadow-command' : 'bg-muted/50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-quantum-blue animate-pulse-glow' : ''
                    }`} />
                  </div>
                  <div>
                    <div className="text-base">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.name === 'Threat Analysis' && 'Asteroid impact modeling'}
                      {item.name === 'Defense Systems' && 'Planetary protection protocols'}
                      {item.name === 'Command Center' && 'Mission control interface'}
                      {item.name === 'Intel Hub' && 'Research & intelligence'}
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-quantum-blue rounded-full shadow-command" />
                    </div>
                  )}
                </button>
              );
            })}
            
            {/* Divider */}
            <div className="border-t border-border/50 my-4" />
            
            {/* Additional Mobile Options - Removed GitHub */}
            <div className="space-y-3">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-foreground hover:text-quantum-blue hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-quantum-blue/20"
              >
                <div className="p-2 rounded-lg bg-muted/50">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-medium">System Settings</div>
                  <div className="text-xs text-muted-foreground">Configure preferences</div>
                </div>
                <Badge className="ml-auto bg-plasma-orange text-white text-xs">Beta</Badge>
              </button>
            </div>
            
            {/* Mission Control Info */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-quantum rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">AG</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Mission Commander</div>
                  <div className="text-xs text-muted-foreground">AstroGuard Impact Lab</div>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-mission-green rounded-full animate-pulse"></div>
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