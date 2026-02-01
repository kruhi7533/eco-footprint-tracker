
// Carbon footprint calculation utilities

// Constants for carbon emissions
const EMISSIONS = {
  // Transportation (kg CO2 per km)
  CAR: 0.192, // Average car
  BUS: 0.105, // Bus
  TRAIN: 0.041, // Train
  PLANE: 0.255, // Airplane
  WALK_BIKE: 0, // Walking or biking
  
  // Energy (kg CO2 per kWh)
  ELECTRICITY: 0.233, // Average electricity
  NATURAL_GAS: 0.184, // Natural gas per kWh
  
  // Diet (kg CO2 per day)
  MEAT_HEAVY: 7.19, // Meat-heavy diet
  AVERAGE: 5.63, // Average diet
  VEGETARIAN: 3.81, // Vegetarian diet
  VEGAN: 2.89, // Vegan diet
  
  // Waste (kg CO2 per kg of waste)
  LANDFILL: 0.61, // Waste to landfill
  RECYCLED: 0.21, // Recycled waste
  COMPOSTED: 0.08, // Composted waste
};

// Calculate transportation emissions
export const calculateTransportEmissions = (
  mode: keyof typeof EMISSIONS,
  distance: number // in km
): number => {
  return EMISSIONS[mode] * distance;
};

// Calculate energy emissions
export const calculateEnergyEmissions = (
  energyType: 'ELECTRICITY' | 'NATURAL_GAS',
  consumption: number // in kWh
): number => {
  return EMISSIONS[energyType] * consumption;
};

// Calculate diet emissions
export const calculateDietEmissions = (
  dietType: 'MEAT_HEAVY' | 'AVERAGE' | 'VEGETARIAN' | 'VEGAN',
  days: number = 1 // number of days
): number => {
  return EMISSIONS[dietType] * days;
};

// Calculate waste emissions
export const calculateWasteEmissions = (
  wasteType: 'LANDFILL' | 'RECYCLED' | 'COMPOSTED',
  weight: number // in kg
): number => {
  return EMISSIONS[wasteType] * weight;
};

// Calculate total carbon footprint
export const calculateTotalFootprint = (
  transportation: number,
  energy: number,
  diet: number,
  waste: number
): number => {
  return transportation + energy + diet + waste;
};

// Generate eco tips based on footprint data
export const generateEcoTips = (
  transportationScore: number,
  energyScore: number,
  dietScore: number,
  wasteScore: number
): string[] => {
  const tips: string[] = [];
  
  // Transportation tips
  if (transportationScore > 50) {
    tips.push("Consider carpooling or using public transportation to reduce your carbon footprint.");
    tips.push("For short trips, try walking or biking instead of driving.");
  }
  
  // Energy tips
  if (energyScore > 40) {
    tips.push("Reduce your energy consumption by unplugging devices when not in use.");
    tips.push("Switch to LED light bulbs to save energy.");
  }
  
  // Diet tips
  if (dietScore > 30) {
    tips.push("Try incorporating more plant-based meals into your diet.");
    tips.push("Consider participating in 'Meatless Monday' to reduce your carbon footprint.");
  }
  
  // Waste tips
  if (wasteScore > 20) {
    tips.push("Start composting your food waste to reduce landfill contributions.");
    tips.push("Use reusable bags and containers to minimize single-use plastic waste.");
  }
  
  // General tips
  tips.push("Replace single-use items with reusable alternatives.");
  tips.push("Choose local and seasonal foods to reduce transportation emissions.");
  
  return tips;
};

// Calculate user level based on eco actions
export const calculateUserLevel = (ecoPoints: number): number => {
  return Math.floor(ecoPoints / 100) + 1;
};

// Get achievement status based on user activity
export const getAchievements = (userData: {
  transportationReductions: number;
  energySavings: number;
  wasteReduction: number;
  consecutiveDays: number;
}): { title: string; earned: boolean; description: string }[] => {
  return [
    {
      title: "Carbon Cutter",
      earned: userData.transportationReductions >= 50,
      description: "Reduce transportation emissions by 50kg"
    },
    {
      title: "Energy Saver",
      earned: userData.energySavings >= 100,
      description: "Save 100kWh of energy"
    },
    {
      title: "Waste Warrior",
      earned: userData.wasteReduction >= 20,
      description: "Reduce waste by 20kg"
    },
    {
      title: "Eco Streak",
      earned: userData.consecutiveDays >= 7,
      description: "Log your footprint for 7 consecutive days"
    },
    {
      title: "Green Guardian",
      earned: 
        userData.transportationReductions >= 100 && 
        userData.energySavings >= 200 && 
        userData.wasteReduction >= 40,
      description: "Master of all eco-friendly habits"
    }
  ];
};
