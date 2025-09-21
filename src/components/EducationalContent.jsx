import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Telescope, 
  Shield, 
  ChevronRight,
  Lightbulb,
  Calculator,
  Info,
  Atom,
  PlayCircle,
  GraduationCap,
  Target,
  Activity,
  Rocket,
} from "lucide-react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const EducationalContent = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  // ✅ REMOVED: animatedTopics tracking that was causing the blank content issue

  // Animation refs
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const overviewGridRef = useRef(null);
  const topicNavRef = useRef(null);
  const contentDisplayRef = useRef(null);
  const featuresRef = useRef(null);

  const educationalSections = {
    science: {
      title: "Asteroid Science",
      icon: Telescope,
      color: "text-stellar-cyan",
      gradient: "from-stellar-cyan to-quantum-blue",
      bgColor: "bg-stellar-cyan/10",
      borderColor: "border-stellar-cyan/20",
      topics: [
        {
          id: "composition",
          title: "Asteroid Composition",
          level: "Beginner",
          estimatedTime: "5 min read",
          content: `Asteroids are rocky, metallic, or icy remnants left over from the early formation of our solar system about 4.6 billion years ago.
          
**Main Asteroid Types:**

• **C-type (Carbonaceous)**: Dark, carbon-rich asteroids
  - Most common type (~75% of known asteroids)
  - Low reflectivity (albedo 3-9%)
  - Rich in water and organic compounds
  - Examples: Ceres, Mathilde

• **S-type (Silicaceous)**: Stony asteroids  
  - Silicon and nickel-iron composition (~17%)
  - Moderate reflectivity (albedo 10-22%)
  - Common in inner asteroid belt
  - Examples: Itokawa, Eros

• **M-type (Metallic)**: Metal-rich asteroids
  - Mostly nickel-iron composition (~8%)
  - High reflectivity and density
  - Potentially valuable for space mining
  - Examples: Psyche, Kleopatra

**Impact on Earth Defense:**
The composition directly affects impact dynamics. Metallic asteroids are denser and cause more damage per unit size, while icy asteroids may fragment more easily in Earth's atmosphere, potentially reducing surface damage but creating atmospheric effects.`,
          keyFacts: [
            "Over 1.3 million asteroids larger than 1km have been catalogued",
            "Most asteroids orbit in the Main Belt between Mars and Jupiter",
            "Asteroid 16 Psyche contains enough metals to be worth $10,000 quadrillion",
            "C-type asteroids may contain up to 20% water by mass"
          ],
          applications: [
            "Understanding composition helps predict deflection effectiveness",
            "Material properties affect fragmentation during atmospheric entry",
            "Composition analysis guides space mining mission planning"
          ]
        },
        {
          id: "orbits",
          title: "Orbital Mechanics",
          level: "Intermediate", 
          estimatedTime: "8 min read",
          content: `Asteroid orbits follow Kepler's laws of planetary motion, discovered in the early 1600s. Understanding these principles is crucial for predicting impact trajectories and planning deflection missions.

**Kepler's Three Laws:**

1. **Law of Ellipses**: Asteroid orbits are elliptical with the Sun at one focus
2. **Law of Equal Areas**: Asteroids sweep equal areas in equal time periods
3. **Harmonic Law**: Orbital period squared is proportional to semi-major axis cubed

**Key Orbital Elements:**

• **Semi-major axis (a)**: Defines the size of the orbit
• **Eccentricity (e)**: How elliptical the orbit is (0 = circle, 1 = parabola)
• **Inclination (i)**: Tilt relative to Earth's orbital plane
• **Argument of periapsis (ω)**: Orientation of closest approach
• **Longitude of ascending node (Ω)**: Where orbit crosses Earth's plane
• **Mean anomaly (M)**: Position of asteroid in its orbit at a given time

**Near-Earth Asteroid Classifications:**

• **Apollo asteroids**: Cross Earth's orbit (semi-major axis > 1 AU)
• **Aten asteroids**: Orbits mostly inside Earth's (semi-major axis < 1 AU)  
• **Amor asteroids**: Approach but don't cross Earth's orbit
• **Atira asteroids**: Orbits entirely inside Earth's orbit

**Potentially Hazardous Objects (PHOs)** are asteroids larger than 140m that come within 0.05 AU (7.5 million km) of Earth's orbit - about 19.5 times the distance to the Moon.`,
          keyFacts: [
            "Over 31,000 near-Earth asteroids have been discovered",
            "About 2,300 are classified as Potentially Hazardous Objects",
            "The closest approach ever recorded was 2020 VT4 at just 370 km altitude",
            "Orbital periods of near-Earth asteroids range from 0.3 to 4+ years"
          ],
          applications: [
            "Precise orbit determination enables impact prediction decades in advance",
            "Orbital mechanics calculations guide spacecraft trajectory planning",
            "Understanding resonances helps predict long-term orbital evolution"
          ]
        },
        {
          id: "discovery",
          title: "Discovery & Tracking",
          level: "Beginner",
          estimatedTime: "6 min read",
          content: `Modern asteroid discovery relies on sophisticated ground and space-based telescopes that continuously survey the sky for moving objects.

**Discovery Timeline:**
• **1801**: First asteroid Ceres discovered by Giuseppe Piazzi
• **1930s**: Photographic surveys begin systematic search
• **1990s**: Digital CCD cameras revolutionize detection
• **2000s**: Dedicated NEO survey programs established
• **2010s**: Space-based infrared telescopes deployed
• **2020s**: AI and machine learning accelerate discovery

**Major Survey Programs:**

• **LINEAR (US)**: Discovers ~65% of near-Earth asteroids
• **NEOWISE (Space)**: Infrared detection and size/composition characterization  
• **Catalina Sky Survey (US)**: High-productivity ground survey
• **ATLAS (Hawaii)**: Early warning system for imminent impactors
• **ESA Space Situational Awareness**: European detection network

**Detection Challenges:**
• Asteroids reflect only 3-20% of sunlight (very dark)
• Most dangerous ones approach from Sun's direction
• Small asteroids detected only hours before potential impact
• Atmospheric interference affects ground-based observations
• Need multiple observations to confirm orbital trajectory

**Future Detection Systems:**
• **NEO Surveyor (2028)**: Dedicated space-based infrared telescope
• **Rubin Observatory (2025)**: Revolutionary ground-based survey capability
• **Enhanced radar systems**: Better characterization of discovered objects`,
          keyFacts: [
            "New near-Earth asteroids are discovered almost daily",
            "Current discovery rate: ~3,000 new NEAs per year",
            "It takes 3+ observations over several days to confirm an orbit",
            "NEOWISE has characterized sizes of 1,000+ near-Earth asteroids"
          ],
          applications: [
            "Early detection enables deflection mission planning",
            "Continuous tracking refines impact probability calculations",
            "Characterization data informs mitigation strategy selection"
          ]
        }
      ]
    },
    physics: {
      title: "Impact Physics",
      icon: Atom,
      color: "text-plasma-orange",
      gradient: "from-plasma-orange to-destructive",
      bgColor: "bg-plasma-orange/10",
      borderColor: "border-plasma-orange/20",
      topics: [
        {
          id: "energy",
          title: "Kinetic Energy & Impact Dynamics",
          level: "Advanced",
          estimatedTime: "10 min read",
          content: `The devastating effects of asteroid impacts come from the enormous kinetic energy released during collision with Earth.

**Fundamental Energy Equation:**
**KE = ½mv²**

Where:
• m = mass of asteroid (kg)
• v = impact velocity (m/s)
• KE = kinetic energy (Joules)

**Critical Relationships:**

1. **Velocity Dominance**: Energy increases with the **square** of velocity
   - A 20 km/s asteroid has 4× more energy than a 10 km/s asteroid of same size
   - Typical Earth impact velocities: 11-72 km/s

2. **Mass Scaling**: Proportional to volume (and thus diameter cubed)
   - A 200m asteroid has 8× more mass than a 100m asteroid
   - Mass also depends on density (varies 2-8 g/cm³)

3. **Impact Angle Effects**: Steeper angles deliver more energy to ground
   - 90° (vertical): Maximum energy transfer to surface
   - 45°: Optimal angle for crater formation
   - <30°: Significant atmospheric interaction, potential ricochet

**Energy Release Mechanisms:**

• **Shock Wave Formation**: Instantaneous compression creates high-pressure waves
• **Excavation**: Material ejected from crater at supersonic speeds  
• **Vaporization**: Extreme temperatures vaporize impactor and target rock
• **Seismic Energy**: Ground motion propagates as earthquake waves
• **Thermal Radiation**: Intense heat pulse ignites fires over vast areas

**Crater Formation Process:**
1. **Contact & Compression** (microseconds): Initial shock wave formation
2. **Excavation** (seconds): Material ejected, transient crater formed  
3. **Modification** (minutes): Crater walls collapse, central peak rebounds
4. **Final Crater**: Stable structure with diameter 10-20× impactor size

**Scaling Laws:**
• Simple craters: <2-4 km diameter (depending on gravity/target)
• Complex craters: Central peaks, terraced walls, multiple rings
• Multi-ring basins: >200 km diameter, multiple concentric rings`,
          keyFacts: [
            "Chicxulub impactor (66 Mya) released energy equivalent to 100 million megatons TNT",
            "A 1 km asteroid impact releases energy of 100,000 Hiroshima bombs",
            "Impact velocities on Earth range from 11 km/s (minimum) to 72 km/s (maximum)",
            "Ocean impacts can generate tsunamis with waves >100m high"
          ],
          applications: [
            "Energy calculations predict crater size and damage radius",
            "Velocity analysis helps determine optimal deflection strategies",
            "Understanding scaling laws guides planetary defense planning"
          ]
        },
        {
          id: "atmosphere",
          title: "Atmospheric Entry Effects", 
          level: "Intermediate",
          estimatedTime: "7 min read",
          content: `Earth's atmosphere provides our first line of defense against smaller asteroids through heating, ablation, and fragmentation processes.

**Atmospheric Entry Physics:**

**1. Initial Contact (~120 km altitude)**
• Atmospheric pressure: 10⁻⁷ Earth surface pressure
• Initial heating begins due to compression
• Meteor trail becomes visible

**2. Ablation Phase (80-40 km altitude)**
• Surface material vaporizes and strips away
• Creates bright fireball visible for hundreds of km
• Mass loss rate proportional to velocity³

**3. Fragmentation (40-20 km altitude)**
• Thermal and aerodynamic stresses exceed material strength
• Asteroid breaks into multiple fragments
• Each fragment creates its own trail

**4. Terminal Explosion/Airburst**
• Rapid fragmentation releases remaining kinetic energy
• Creates powerful atmospheric blast wave
• Can cause significant ground damage without surface impact

**Size-Dependent Outcomes:**

• **<1m**: Complete atmospheric burnup, harmless meteors
• **1-25m**: Mostly destroyed, small fragments may survive
  - Example: Chelyabinsk meteor (2013, ~20m) - airburst at 30 km
• **25-140m**: Partial survival, regional damage possible
  - Example: Tunguska event (1908, ~60m) - airburst flattened 2,000 km²
• **140m-1km**: Survive to impact, cause regional devastation
• **>1km**: Minimal atmospheric effect, global consequences

**Material Strength Effects:**
• **Weak (rubble pile)**: Fragments easily, multiple airbursts
• **Moderate (fractured rock)**: Breaks apart at 20-40 km altitude  
• **Strong (solid metal)**: Survives to lower altitudes, ground impact likely

**Atmospheric Protection Statistics:**
• Earth's atmosphere intercepts ~15,000 tons of meteoric material annually
• >99% burns up completely before reaching the surface
• Atmosphere effectively shields against objects <25m diameter`,
          keyFacts: [
            "Earth's atmosphere stops approximately 40 meteors per day >1 meter in size",
            "The Chelyabinsk meteor injured 1,500 people despite exploding 30 km up",
            "Atmospheric entry heating can reach temperatures >3,000°C",
            "Strong metallic asteroids are 10× more likely to survive atmospheric entry"
          ],
          applications: [
            "Atmospheric modeling predicts airburst altitudes and ground effects",
            "Understanding fragmentation helps assess casualty risks",
            "Entry physics guide early warning system development"
          ]
        }
      ]
    },
    defense: {
      title: "Planetary Defense",
      icon: Shield, 
      color: "text-mission-green",
      gradient: "from-mission-green to-stellar-cyan",
      bgColor: "bg-mission-green/10",
      borderColor: "border-mission-green/20",
      topics: [
        {
          id: "detection",
          title: "Detection & Tracking Systems",
          level: "Beginner",
          estimatedTime: "6 min read",
          content: `Early detection forms humanity's first and most critical line of defense against asteroid threats. Modern detection systems combine ground-based telescopes with space-based assets to continuously monitor the skies.

**Ground-Based Detection Systems:**

• **LINEAR (Lincoln Near-Earth Asteroid Research)**
  - Location: New Mexico, USA
  - Discovers ~65% of all near-Earth asteroids
  - Uses 1-meter telescope with sensitive CCD cameras
  - Automated detection software processes thousands of images nightly

• **Catalina Sky Survey**
  - Location: Arizona, USA  
  - Most productive NEO discovery program
  - Multiple telescopes scanning large sky areas
  - Responsible for >45% of new NEO discoveries

• **ATLAS (Asteroid Terrestrial-impact Last Alert System)**
  - Hawaii-based early warning network
  - Designed to detect city-killer asteroids weeks before impact
  - Can spot 140m asteroids 3 weeks out, 40m objects 1 week out

**Space-Based Assets:**

• **NEOWISE Mission**
  - Infrared space telescope in polar orbit
  - Detects asteroid thermal emissions, not just reflected light
  - Can determine size and composition
  - Has characterized 1,000+ near-Earth asteroids

**Detection Challenges:**

• **Brightness**: Asteroids reflect only 3-20% of sunlight
• **Solar Blind Spot**: Most dangerous asteroids approach from Sun's direction
• **Size vs Distance**: Small nearby objects vs large distant ones
• **Orbital Uncertainty**: Need multiple observations over weeks to confirm trajectory
• **Weather**: Ground-based telescopes affected by atmospheric conditions

**Next-Generation Systems:**

• **NEO Surveyor (Launch 2028)**
  - Dedicated space-based infrared telescope
  - Will discover 2/3 of remaining undiscovered NEOs >140m
  - Better size and composition characterization

• **Rubin Observatory (First Light 2025)**
  - 8.4-meter ground-based telescope in Chile
  - Will image entire visible sky every 3 nights
  - Expected to discover millions of new objects`,
          keyFacts: [
            "Over 90% of potentially hazardous asteroids >1 km have been found",
            "Only ~40% of potentially hazardous asteroids >140m have been discovered",
            "New near-Earth asteroids are discovered at a rate of ~8 per day",
            "It takes a minimum of 3 observations over several days to confirm an orbit"
          ],
          applications: [
            "Early detection enables decades of advance warning for deflection missions",
            "Continuous tracking refines impact probability predictions",
            "Characterization data informs optimal mitigation strategy selection"
          ]
        },
        {
          id: "deflection",
          title: "Deflection Technologies",
          level: "Advanced",
          estimatedTime: "12 min read",
          content: `Multiple proven and experimental technologies exist to deflect threatening asteroids, each optimized for different scenarios and asteroid characteristics.

**1. Kinetic Impactor Technology**

**Principle**: High-speed spacecraft collision transfers momentum to change asteroid velocity

**DART Mission Success (2022)**:
• Target: Dimorphos (160m moonlet of asteroid Didymos)
• Impact velocity: 6.14 km/s
• Result: Changed orbital period by 32 minutes (11.5× minimum success threshold)
• Proved kinetic impactor concept at realistic scale

**Advantages**:
• Proven technology with successful demonstration
• Relatively simple and cost-effective
• Immediate effect - no long mission duration required
• Precise targeting possible with modern guidance systems

**Limitations**:
• Single-use system
• Effectiveness decreases with asteroid size
• Creates debris cloud that could pose secondary hazard
• Requires early detection (minimum 5-10 years warning)

**Optimal Scenarios**: Small to medium asteroids (50-500m), 5+ years warning time

**2. Gravity Tractor Technology**

**Principle**: Spacecraft hovers near asteroid, using gravitational attraction to slowly pull it off course

**Technical Implementation**:
• Station-keeping near asteroid using ion propulsion
• Gravitational force proportional to spacecraft mass
• Deflection accumulates over months to decades
• Can "fine-tune" deflection with extreme precision

**Advantages**:
• No contact required - works on any asteroid composition
• Highly controllable - can stop/reverse deflection if needed
• No debris creation
• Can be combined with other methods

**Limitations**:
• Extremely slow - requires decades of warning time
• Massive fuel requirements for long-duration missions
• Complex navigation and station-keeping
• Spacecraft mass severely limits deflection capability

**Optimal Scenarios**: Small asteroids with 20+ years warning, precision trajectory adjustments

**3. Nuclear Deflection Technology**

**Principle**: Nuclear explosion near (not on) asteroid surface vaporizes material, creating thrust

**Technical Approach**:
• Detonate nuclear device 100-1000m from asteroid surface
• X-ray radiation instantly vaporizes surface material
• Expanding vapor cloud provides deflection impulse
• Standoff distance prevents fragmentation

**Advantages**:
• Highest energy density available to humanity
• Effective against largest asteroids (>1 km)
• Rapid deployment possible
• Scalable yield (kiloton to megaton range)

**Limitations**:
• Risk of fragmenting asteroid into multiple threats
• Complex international legal and political challenges
• Radiation effects on spacecraft systems
• Public perception and safety concerns

**Optimal Scenarios**: Large asteroids (>500m), short warning times (<5 years), last resort

**4. Experimental Concepts**

**Ion Beam Shepherd**:
• Spacecraft uses focused ion beam to gradually push asteroid
• Extremely precise control possible
• Very slow but highly accurate

**Solar Concentrator**:
• Large mirror focuses sunlight to vaporize asteroid surface
• Uses solar energy instead of nuclear
• Requires very long mission duration

**Mass Driver**:
• Robotic system mines asteroid material and ejects it as propellant
• Self-sustaining deflection over years
• Complex technology requiring asteroid landing

**Deflection Scaling Laws**:
• Deflection ∝ (delivered energy) / (asteroid mass)
• Earlier intervention requires exponentially less energy
• Velocity change of 1 cm/s applied 10 years before impact = 1000 km miss distance`,
          keyFacts: [
            "DART changed Dimorphos orbit by 32 minutes with 6.14 km/s impact",
            "A 1 cm/s velocity change 10 years before impact results in 1000 km miss distance",
            "Nuclear deflection could handle asteroids up to several kilometers in diameter",
            "Gravity tractor requires 10-100× more spacecraft mass than kinetic impactor"
          ],
          applications: [
            "Strategy selection depends on asteroid size, composition, and warning time",
            "Multiple techniques may be combined for maximum effectiveness",
            "Backup plans essential given mission failure possibilities"
          ]
        }
      ]
    }
  };

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
      setTimeout(addInteractiveEffects, 600);
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Interactive hover effects
  const addInteractiveEffects = () => {
    // Educational card hover effects
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach((card) => {
      if (card.dataset.hoverInitialized) return;
      card.dataset.hoverInitialized = 'true';
      
      const icon = card.querySelector('.education-icon');
      const exploreButton = card.querySelector('.explore-button');
      
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
        if (exploreButton) {
          gsap.to(exploreButton, {
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
        if (exploreButton) {
          gsap.to(exploreButton, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    // Topic button hover effects
    const topicButtons = document.querySelectorAll('.topic-button');
    topicButtons.forEach((button) => {
      if (button.dataset.hoverInitialized) return;
      button.dataset.hoverInitialized = 'true';
      
      const handleMouseEnter = () => {
        if (!button.classList.contains('bg-gradient-quantum')) {
          gsap.to(button, {
            scale: 1.02,
            x: 5,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          x: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
    });

    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      if (card.dataset.hoverInitialized) return;
      card.dataset.hoverInitialized = 'true';
      
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.05,
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

  // Animate tab content when switching
  useEffect(() => {
    const animateTabContent = () => {
      let contentRef = null;
      
      switch (activeTab) {
        case "overview":
          contentRef = overviewGridRef.current;
          break;
        case "science":
        case "physics":
        case "defense":
          contentRef = topicNavRef.current;
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

        // Animate child elements based on tab
        if (activeTab === "overview") {
          const educationCards = contentRef.querySelectorAll('.education-card');
          gsap.fromTo(educationCards, {
            opacity: 0,
            y: 30,
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

          // Animate features section
          if (featuresRef.current) {
            const featureCards = featuresRef.current.querySelectorAll('.feature-card');
            gsap.fromTo(featureCards, {
              opacity: 0,
              y: 20,
              scale: 0.95
            }, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.5
            });
          }
        } else {
          const topicButtons = contentRef.querySelectorAll('.topic-button');
          gsap.fromTo(topicButtons, {
            opacity: 0,
            x: -20
          }, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2
          });
        }
      }
    };

    if (isLoaded) {
      animateTabContent();
      setTimeout(addInteractiveEffects, 300);
    }
  }, [activeTab, isLoaded]);

  // ✅ FIXED: Animate content display when topic changes - Always animate, no tracking
  useEffect(() => {
    if (selectedTopic && contentDisplayRef.current) {
      // Always animate content when topic changes
      gsap.fromTo(contentDisplayRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });

      // Animate content sections
      const contentSections = contentDisplayRef.current.querySelectorAll('.content-section');
      gsap.fromTo(contentSections, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    }
  }, [selectedTopic]); // ✅ REMOVED: animatedTopics dependency

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-mission-green';
      case 'Intermediate': return 'bg-plasma-orange';
      case 'Advanced': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Beginner': return '🟢';
      case 'Intermediate': return '🟡';
      case 'Advanced': return '🔴';
      default: return '⚪';
    }
  };

  const handleExploreSection = (sectionKey) => {
    setActiveTab(sectionKey);
    // Auto-select first topic when exploring a section
    const firstTopic = educationalSections[sectionKey].topics[0];
    if (firstTopic) {
      setSelectedTopic(firstTopic.id);
    }
  };

  // ✅ SIMPLIFIED: Direct topic selection without fade-out animation
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className={`px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={tabsRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="tabs-list grid w-full grid-cols-2 lg:grid-cols-4 bg-card/60 border-border/50 backdrop-blur-sm h-auto p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <GraduationCap className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Start</span>
              </TabsTrigger>
              <TabsTrigger 
                value="science" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <Telescope className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Science</span>
                <span className="sm:hidden">Sci</span>
              </TabsTrigger>
              <TabsTrigger 
                value="physics" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <Atom className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Physics</span>
                <span className="sm:hidden">Phy</span>
              </TabsTrigger>
              <TabsTrigger 
                value="defense" 
                className="data-[state=active]:bg-gradient-quantum data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 h-10 sm:h-12"
              >
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Defense</span>
                <span className="sm:hidden">Def</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div ref={overviewGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {Object.entries(educationalSections).map(([key, section]) => {
                  const Icon = section.icon;
                  return (
                    <Card key={key} className="education-card bg-card/60 border-border/50 backdrop-blur-sm shadow-command hover:shadow-glow transition-all duration-300 group">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center space-x-3">
                          <div className={`education-icon p-3 rounded-lg bg-gradient-to-br ${section.gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-quantum-blue">{section.title}</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {section.topics.length} comprehensive topics
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {section.topics.slice(0, 3).map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
                              <div className="flex items-center space-x-3">
                                <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{topic.title}</div>
                                  <div className="text-xs text-muted-foreground">{topic.estimatedTime}</div>
                                </div>
                              </div>
                              <Badge className={`${getLevelColor(topic.level)} text-white text-xs px-2 py-1`}>
                                {getLevelIcon(topic.level)}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <Button 
                          className="explore-button w-full text-quantum-white bg-gradient-quantum hover:shadow-command transition-all duration-300 h-10 sm:h-12 group-hover:scale-105"
                          onClick={() => handleExploreSection(key)}
                        >
                          <span className="hidden sm:inline">Explore {section.title}</span>
                          <span className="sm:hidden">Explore</span>
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Educational Features */}
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-quantum">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-quantum-blue">Learning Features</span>
                  </CardTitle>
                </CardHeader>

                <CardContent ref={featuresRef}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="feature-card p-4 bg-stellar-cyan/10 rounded-lg border border-stellar-cyan/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <Target className="w-5 h-5 text-stellar-cyan" />
                        <h4 className="font-bold text-stellar-cyan">Interactive Content</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Engage with comprehensive materials covering asteroid detection, 
                        orbital mechanics, and impact physics with real-world examples.
                      </p>
                    </div>

                    <div className="feature-card p-4 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <Activity className="w-5 h-5 text-plasma-orange" />
                        <h4 className="font-bold text-plasma-orange">Progressive Learning</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Topics are organized by difficulty level from beginner to advanced, 
                        allowing you to build knowledge systematically.
                      </p>
                    </div>

                    <div className="feature-card p-4 bg-mission-green/10 rounded-lg border border-mission-green/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <Rocket className="w-5 h-5 text-mission-green" />
                        <h4 className="font-bold text-mission-green">Practical Applications</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Learn how scientific principles apply to real planetary defense 
                        missions and current space agency initiatives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-quantum">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-quantum-blue">Did You Know?</span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center p-4 bg-stellar-cyan/10 rounded-lg border border-stellar-cyan/20">
                      <div className="text-2xl font-bold text-stellar-cyan mb-2">31,000+</div>
                      <div className="text-sm text-muted-foreground mb-2">Near-Earth Asteroids Discovered</div>
                      <div className="text-xs text-muted-foreground">
                        <span>NASA automated systems discover about 3,000 new objects annually</span>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20">
                      <div className="text-2xl font-bold text-plasma-orange mb-2">66 MYA</div>
                      <div className="text-sm text-muted-foreground mb-2">Chicxulub Impact Event</div>
                      <div className="text-xs text-muted-foreground">
                        Created 180km crater, ending the age of dinosaurs and reshaping evolution
                      </div>
                    </div>

                    <div className="text-center p-4 bg-mission-green/10 rounded-lg border border-mission-green/20">
                      <div className="text-2xl font-bold text-mission-green mb-2">2026</div>
                      <div className="text-sm text-muted-foreground mb-2">Hera Mission Arrival</div>
                      <div className="text-xs text-muted-foreground">
                        ESA follow-up mission to study the DART impact site and validate deflection models
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Individual Section Tabs */}
            {Object.entries(educationalSections).map(([key, section]) => (
              <TabsContent key={key} value={key} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
                  {/* Topic Navigation - Responsive */}
                  <Card ref={topicNavRef} className="xl:col-span-1 bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${section.gradient}`}>
                          <section.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg text-quantum-blue">{section.title}</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {section.topics.map((topic) => (
                        <Button
                          key={topic.id}
                          variant={selectedTopic === topic.id ? "default" : "ghost"}
                          className={`topic-button w-full justify-start h-auto p-3 text-left transition-all duration-300 ${
                            selectedTopic === topic.id ? 'bg-gradient-quantum shadow-command' : 'hover:bg-muted/20'
                          }`}
                          onClick={() => handleTopicSelect(topic.id)}
                        >
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm mb-2">{topic.title}</div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`${getLevelColor(topic.level)} text-white text-xs px-2 py-1`}>
                                {getLevelIcon(topic.level)} {topic.level}
                              </Badge>
                              <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{topic.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Content Display - Responsive */}
                  <div className="xl:col-span-3">
                    {selectedTopic ? (
                      (() => {
                        const topic = section.topics.find(t => t.id === selectedTopic);
                        if (!topic) return null;

                        return (
                          <Card ref={contentDisplayRef} className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                            <CardHeader className="pb-3 sm:pb-4">
                              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <span className="text-xl text-quantum-blue">{topic.title}</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className={`${getLevelColor(topic.level)} text-white px-3 py-1`}>
                                    {getLevelIcon(topic.level)} {topic.level}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-quantum-blue/30 text-quantum-blue">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    {topic.estimatedTime}
                                  </Badge>
                                </div>
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 sm:space-y-6">
                              {/* Main Content */}
                              <div className="content-section prose prose-invert max-w-none">
                                <div className="text-foreground whitespace-pre-line leading-relaxed text-sm sm:text-base">
                                  {topic.content}
                                </div>
                              </div>

                              {/* Key Facts */}
                              <div className={`content-section p-4 rounded-lg border ${section.bgColor} ${section.borderColor}`}>
                                <h4 className={`font-bold mb-3 flex items-center ${section.color}`}>
                                  <Info className="w-5 h-5 mr-2" />
                                  Key Facts
                                </h4>
                                <div className="space-y-2">
                                  {topic.keyFacts.map((fact, factIndex) => (
                                    <div key={factIndex} className="flex items-start space-x-3 text-sm">
                                      <span className={`mt-0.5 flex-shrink-0 ${section.color}`}>•</span>
                                      <span className="text-muted-foreground">{fact}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Applications */}
                              {topic.applications && (
                                <div className="content-section p-4 bg-quantum-blue/10 rounded-lg border border-quantum-blue/20">
                                  <h4 className="font-bold mb-3 flex items-center text-quantum-blue">
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    Real-World Applications
                                  </h4>
                                  <div className="space-y-2">
                                    {topic.applications.map((application, appIndex) => (
                                      <div key={appIndex} className="flex items-start space-x-3 text-sm">
                                        <span className="text-quantum-blue mt-0.5 flex-shrink-0">→</span>
                                        <span className="text-muted-foreground">{application}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <Separator className="my-4" />

                              {/* Additional Resources */}
                              <div className="content-section space-y-3">
                                <h4 className="font-bold text-quantum-blue">Learn More</h4>
                                <div className="flex flex-wrap gap-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-plasma-orange text-plasma-orange hover:bg-plasma-orange hover:text-white transition-all duration-300"
                                    onClick={() => {
                                      const simulationSection = document.getElementById('simulation');
                                      if (simulationSection) {
                                        simulationSection.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }}
                                  >
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
                      <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-command">
                        <CardContent className="p-8 sm:p-12 text-center">
                          <div className={`p-4 rounded-full bg-gradient-to-br ${section.gradient} w-fit mx-auto mb-6`}>
                            <section.icon className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
                          </div>
                          <h3 className="text-xl font-bold text-quantum-blue mb-2">{section.title}</h3>
                          <p className="text-muted-foreground mb-6">
                            Select a topic from the navigation to dive deep into {section.title.toLowerCase()}
                          </p>
                          <Button 
                            onClick={() => setSelectedTopic(section.topics[0].id)}
                            className="bg-gradient-quantum hover:shadow-command"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default EducationalContent;