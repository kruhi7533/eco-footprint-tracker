import { useState, useEffect } from 'react';

export interface ImprovementTip {
  id: number;
  title: string;
  description: string;
  link: string;
  category: 'transportation' | 'energy' | 'diet' | 'waste' | 'home' | 'general';
  impact_level: number; // 1-5 scale of potential impact
  difficulty_level: number; // 1-5 scale of implementation difficulty
  co2_reduction_potential: number; // estimated kg of CO2 saved per year
}

interface UseImprovementTipsReturn {
  tips: ImprovementTip[];
  isLoading: boolean;
  error: Error | null;
  refreshTips: () => Promise<void>;
}

export function useImprovementTips(): UseImprovementTipsReturn {
  const [tips, setTips] = useState<ImprovementTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch tips from your API
  const fetchTips = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/improvement-tips');
      // const data = await response.json();
      
      // Simulated API response
      const data: ImprovementTip[] = [
        {
          id: 1,
          title: "Switch to renewable energy",
          description: "Consider solar panels or switch to a green energy provider.",
          link: "https://www.energy.gov/energysaver/benefits-residential-solar-electricity",
          category: "energy",
          impact_level: 5,
          difficulty_level: 3,
          co2_reduction_potential: 4000
        },
        {
          id: 2,
          title: "Reduce meat consumption",
          description: "Try going meat-free one day a week to start.",
          link: "https://www.worldwildlife.org/stories/eat-less-meat-to-reduce-your-impact-on-earth",
          category: "diet",
          impact_level: 4,
          difficulty_level: 2,
          co2_reduction_potential: 350
        },
        {
          id: 3,
          title: "Optimize transportation",
          description: "Use public transport, carpool, or walk for shorter distances.",
          link: "https://www.epa.gov/transportation-air-pollution-and-climate-change/what-you-can-do-reduce-pollution-vehicles",
          category: "transportation",
          impact_level: 4,
          difficulty_level: 3,
          co2_reduction_potential: 2500
        },
        {
          id: 4,
          title: "Improve home insulation",
          description: "Add proper insulation to reduce heating and cooling energy usage.",
          link: "https://www.energy.gov/energysaver/types-insulation",
          category: "home",
          impact_level: 4,
          difficulty_level: 4,
          co2_reduction_potential: 1200
        },
        {
          id: 5,
          title: "Reduce water waste",
          description: "Fix leaks, take shorter showers, and collect rainwater for gardens.",
          link: "https://www.epa.gov/watersense/start-saving",
          category: "home",
          impact_level: 3,
          difficulty_level: 1,
          co2_reduction_potential: 300
        },
        {
          id: 6,
          title: "Practice zero waste",
          description: "Use reusable bags, containers, and minimize single-use plastics.",
          link: "https://www.epa.gov/trash-free-waters/preventing-trash-source-0",
          category: "waste",
          impact_level: 3,
          difficulty_level: 2,
          co2_reduction_potential: 400
        }
      ];

      setTips(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tips'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tips on component mount
  useEffect(() => {
    fetchTips();
  }, []);

  return {
    tips,
    isLoading,
    error,
    refreshTips: fetchTips
  };
} 