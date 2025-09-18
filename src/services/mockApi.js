// Mock API service for Meteor Madness
// This will be replaced with real backend calls later

// Mock asteroid database
export const mockAsteroids = [
  {
    id: "2023-DZ2",
    name: "Apophis",
    size: 340,
    velocity: 7.42,
    density: 2.6,
    composition: "rock",
    discoveryDate: "2004-06-19",
    riskLevel: "medium"
  },
  {
    id: "2022-AP7",
    name: "City Killer",
    size: 1500,
    velocity: 15.3,
    density: 3.2,
    composition: "metal",
    discoveryDate: "2022-01-13",
    riskLevel: "high"
  },
  {
    id: "2021-PDC",
    name: "Iceball",
    size: 800,
    velocity: 12.1,
    density: 1.8,
    composition: "ice",
    discoveryDate: "2021-04-30",
    riskLevel: "low"
  }
];

// Mock impact locations
const mockLocations = [
  { region: "Pacific Ocean", lat: -15.5, lng: -145.2 },
  { region: "Atlantic Ocean", lat: 25.3, lng: -35.7 },
  { region: "Sahara Desert", lat: 23.8, lng: 8.4 },
  { region: "Amazon Basin", lat: -8.2, lng: -63.1 },
  { region: "Siberian Tundra", lat: 65.4, lng: 102.8 },
  { region: "Australian Outback", lat: -25.7, lng: 134.2 }
];

export const getAsteroidData = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const asteroid = mockAsteroids.find(a => a.id === id);
  if (!asteroid) {
    throw new Error("Asteroid not found");
  }
  
  return asteroid;
};

export const simulateAsteroid = async (params) => {
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const size = parseFloat(params.size);
  const velocity = parseFloat(params.velocity);
  const density = parseFloat(params.density);
  const angle = parseFloat(params.angle);
  
  // Calculate kinetic energy: KE = 0.5 * mass * velocity^2
  const volume = (4/3) * Math.PI * Math.pow(size/2, 3); // sphere volume in m³
  const mass = volume * density * 1000; // kg (density converted from g/cm³)
  const velocityMS = velocity * 1000; // convert km/s to m/s
  const kineticEnergy = 0.5 * mass * Math.pow(velocityMS, 2); // joules
  
  // Calculate crater size (empirical formula with angle factor)
  const angleImpactFactor = Math.sin(angle * Math.PI / 180); // Convert to radians and get impact efficiency
  const craterSize = Math.pow(kineticEnergy / 1e15, 0.25) * 2 * angleImpactFactor; // rough approximation in km
  
  // Calculate earthquake magnitude (rough correlation)
  const earthquakeMagnitude = Math.min(9.5, 4 + Math.log10(kineticEnergy / 1e15) * 0.7);
  
  // Determine tsunami risk
  const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
  const isOceanImpact = location.region.includes("Ocean");
  let tsunamiRisk = "None";
  
  if (isOceanImpact && size > 50) {
    if (size > 500) tsunamiRisk = "Catastrophic";
    else if (size > 200) tsunamiRisk = "High";
    else tsunamiRisk = "Moderate";
  }
  
  // Calculate damage estimates (angle affects impact severity)
  const baseCasualties = Math.pow(size, 1.5) * Math.pow(velocity, 0.5) * 20 * angleImpactFactor;
  const casualties = Math.floor(baseCasualties * (isOceanImpact ? 0.1 : 1));

  const economicLoss = kineticEnergy / 1e12 * 1e9; // rough $5B per petajoule
  const affectedArea = Math.PI * Math.pow(craterSize * 3, 2); // damage radius ~3x crater radius

  return {
    kineticEnergy,
    craterSize,
    earthquakeMagnitude,
    tsunamiRisk,
    impactLocation: location,
    damage: {
      casualties,
      economicLoss,
      affectedArea
    }
  };
};

export const testMitigation = async (method, asteroidParams) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const size = parseFloat(asteroidParams.size);
  const velocity = parseFloat(asteroidParams.velocity);
  
  let result;
  
  switch (method) {
    case "kinetic_impactor":
      result = {
        success: size < 500,
        method: "Kinetic Impactor",
        energyRequired: Math.pow(size, 2) * velocity * 1e6, // joules
        timeRequired: Math.max(1, size / 50), // years
        successProbability: Math.max(0.1, 0.9 - (size / 1000)),
        costEstimate: size * velocity * 1e6 // USD
      };
      break;
      
    case "gravity_tractor":
      result = {
        success: size < 300,
        method: "Gravity Tractor",
        energyRequired: Math.pow(size, 1.5) * velocity * 1e7,
        timeRequired: Math.max(5, size / 20),
        successProbability: Math.max(0.05, 0.7 - (size / 500)),
        costEstimate: size * velocity * 2e6
      };
      break;
      
    case "nuclear_deflection":
      result = {
        success: size < 1000,
        method: "Nuclear Deflection",
        energyRequired: Math.pow(size, 1.8) * velocity * 1e8,
        timeRequired: Math.max(0.5, size / 100),
        successProbability: Math.max(0.3, 0.95 - (size / 2000)),
        costEstimate: size * velocity * 5e6
      };
      break;
      
    default:
      throw new Error("Unknown mitigation method");
  }
  
  return result;
};

export const getGameScenarios = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "scenario_1",
      name: "The Apophis Approach",
      description: "A 340m asteroid is on collision course with Earth. You have 2 years to act.",
      difficulty: "Medium",
      asteroid: mockAsteroids[0],
      timeLimit: 2,
      objectives: ["Prevent impact", "Minimize casualties", "Stay under budget"]
    },
    {
      id: "scenario_2", 
      name: "City Killer",
      description: "A massive 1.5km metallic asteroid threatens a major population center.",
      difficulty: "Hard",
      asteroid: mockAsteroids[1],
      timeLimit: 1,
      objectives: ["Full deflection required", "Maximum efficiency", "International cooperation"]
    },
    {
      id: "scenario_3",
      name: "Ice Giant",
      description: "An icy comet fragment breaks apart, creating multiple smaller threats.",
      difficulty: "Easy",
      asteroid: mockAsteroids[2],
      timeLimit: 3,
      objectives: ["Handle multiple fragments", "Orbital mechanics mastery", "Resource optimization"]
    }
  ];
};