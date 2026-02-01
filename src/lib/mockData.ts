
// Mock data for the carbon footprint tracker

import { calculateTotalFootprint } from './carbonUtils';

// Generate last 7 days dates
const generatePastDates = (days: number) => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Last 7 days
const pastWeek = generatePastDates(7);

// Mock user data
export const mockUser = {
  id: "user1",
  name: "Alex Green",
  email: "alex@example.com",
  joinedDate: "2023-01-15",
  level: 3,
  ecoPoints: 285,
  consecutiveDays: 5,
  transportationReductions: 75,
  energySavings: 120,
  wasteReduction: 30,
};

// Mock carbon footprint data for the past week
export const mockWeeklyData = pastWeek.map((date, index) => {
  // Create slightly varied data
  const transportationValue = 4 + Math.random() * 3 - (index * 0.2);
  const transportation = parseFloat(transportationValue.toFixed(2));
  
  const energyValue = 6 + Math.random() * 4 - (index * 0.3);
  const energy = parseFloat(energyValue.toFixed(2));
  
  const dietValue = 5 + Math.random() * 2 - (index * 0.1);
  const diet = parseFloat(dietValue.toFixed(2));
  
  const wasteValue = 2 + Math.random() * 1 - (index * 0.05);
  const waste = parseFloat(wasteValue.toFixed(2));

  return {
    date,
    transportation,
    energy,
    diet,
    waste,
    total: parseFloat(calculateTotalFootprint(transportation, energy, diet, waste).toFixed(2))
  };
});

// Calculate total carbon footprint
export const totalCarbonFootprint = parseFloat(
  mockWeeklyData.reduce((sum, day) => sum + day.total, 0).toFixed(2)
);

// Mock average footprints
export const averageFootprints = {
  user: parseFloat((totalCarbonFootprint / mockWeeklyData.length).toFixed(2)),
  country: 22.5, // Example country average per week
  global: 18.3, // Example global average per week
};

// Mock leaderboard data
export const mockLeaderboard = [
  { id: "user2", name: "Jamie Rivers", level: 5, ecoPoints: 520 },
  { id: "user3", name: "Sam Woods", level: 4, ecoPoints: 410 },
  { id: "user1", name: "Alex Green", level: 3, ecoPoints: 285 },
  { id: "user4", name: "Taylor Fields", level: 3, ecoPoints: 265 },
  { id: "user5", name: "Jordan Lake", level: 2, ecoPoints: 175 },
];

// Mock tips for each category
export const mockTips = {
  transportation: [
    "Try carpooling with colleagues to work",
    "Consider using public transportation for your daily commute",
    "For short trips, opt for walking or cycling instead of driving",
    "Maintain your vehicle properly to ensure optimal fuel efficiency",
  ],
  energy: [
    "Unplug electronics when not in use to prevent phantom energy use",
    "Switch to LED bulbs to reduce energy consumption",
    "Use natural light whenever possible during the day",
    "Set your thermostat a few degrees lower in winter and higher in summer",
  ],
  diet: [
    "Try to incorporate more plant-based meals into your diet",
    "Buy local and seasonal produce to reduce transportation emissions",
    "Reduce food waste by planning meals and using leftovers",
    "Start a small herb garden for fresh herbs without packaging",
  ],
  waste: [
    "Bring reusable bags when shopping to avoid single-use plastic bags",
    "Use a reusable water bottle instead of buying bottled water",
    "Start composting food scraps to reduce landfill waste",
    "Choose products with minimal or recyclable packaging",
  ],
};

// Mock achievements list
export const mockAchievements = [
  {
    id: "achievement1",
    title: "Carbon Cutter",
    description: "Reduce transportation emissions by 50kg",
    earned: true,
    date: "2023-04-15",
  },
  {
    id: "achievement2",
    title: "Energy Saver", 
    description: "Save 100kWh of energy",
    earned: true,
    date: "2023-05-22",
  },
  {
    id: "achievement3",
    title: "Waste Warrior",
    description: "Reduce waste by 20kg", 
    earned: true,
    date: "2023-06-10",
  },
  {
    id: "achievement4",
    title: "Eco Streak", 
    description: "Log your footprint for 7 consecutive days",
    earned: false,
    date: null,
  },
  {
    id: "achievement5",
    title: "Green Guardian", 
    description: "Master of all eco-friendly habits",
    earned: false,
    date: null,
  },
];
