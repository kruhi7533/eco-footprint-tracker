import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, getCurrentUTCDate } from "@/lib/utils";
import { toast } from "sonner";
import { calculateDietEmissions } from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type MealTime = 'breakfast' | 'lunch' | 'evening' | 'dinner';
type DietType = 'MEAT_HEAVY' | 'AVERAGE' | 'VEGETARIAN' | 'VEGAN';

interface DietOption {
  id: DietType;
  label: string;
  co2: number;
  image: string;
  description: string;
}

interface MealOption {
  id: MealTime;
  label: string;
  icon: string;
  description: string;
}

const mealOptions: MealOption[] = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    icon: '🌅',
    description: 'Morning meal to start your day'
  },
  {
    id: 'lunch',
    label: 'Lunch',
    icon: '☀️',
    description: 'Midday meal to keep you going'
  },
  {
    id: 'evening',
    label: 'Evening Snack',
    icon: '🌆',
    description: 'Light meal in the evening'
  },
  {
    id: 'dinner',
    label: 'Dinner',
    icon: '🌙',
    description: 'Final meal of the day'
  }
];

const dietOptions: DietOption[] = [
  {
    id: 'MEAT_HEAVY',
    label: 'Meat Heavy',
    co2: 7.19,
    image: '/images/diets/meat-heavy.svg',
    description: 'High in animal products and red meat'
  },
  {
    id: 'AVERAGE',
    label: 'Average Diet',
    co2: 5.63,
    image: '/images/diets/average.svg',
    description: 'Balanced mix of meat and vegetables'
  },
  {
    id: 'VEGETARIAN',
    label: 'Vegetarian',
    co2: 3.81,
    image: '/images/diets/vegetarian.svg',
    description: 'No meat, includes dairy and eggs'
  },
  {
    id: 'VEGAN',
    label: 'Vegan',
    co2: 2.89,
    image: '/images/diets/vegan.svg',
    description: '100% plant-based foods'
  }
];

export function DietForm() {
  const [selectedMeal, setSelectedMeal] = useState<MealTime | ''>('');
  const [selectedDiet, setSelectedDiet] = useState<DietType | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const handleDietSubmit = async () => {
    if (!selectedMeal || !selectedDiet) return;
    
    setIsLoading(true);
    try {
      const emissions = calculateDietEmissions(selectedDiet);
      
      await addCarbonEntry({
        date: getCurrentUTCDate(),
        category: 'diet',
        activity_type: `${selectedMeal}_${selectedDiet}`,
        amount: 1,
        emissions: emissions / 4 // Divide by 4 since this is per meal
      });
      
      // Invalidate the carbon data cache to refresh the chart
      queryClient.invalidateQueries({ queryKey: ['dailySummaries'] });
      
      toast.success(`${(emissions/4).toFixed(2)} kg CO₂ added for your ${selectedMeal}`);
      refreshProfile();
      // Reset selections after successful submission
      setSelectedMeal('');
      setSelectedDiet('');
    } catch (error) {
      console.error('Error adding diet entry:', error);
      toast.error("Failed to log diet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedDiet('');
  };

  return (
    <div className="space-y-6">
      {!selectedMeal ? (
        // Meal Time Selection
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-4">Select Meal Time</label>
          <div className="grid grid-cols-2 gap-6">
            {mealOptions.map((meal) => (
              <Card
                key={meal.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200 hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedMeal(meal.id)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">{meal.icon}</span>
                  <h3 className="font-medium text-lg text-[#2D3436] mb-2">{meal.label}</h3>
                  <p className="text-sm text-[#636E72]">{meal.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedDiet ? (
        // Diet Type Selection
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-[#2D3436]">
              Select Diet Type for {mealOptions.find(m => m.id === selectedMeal)?.label}
            </label>
            <button
              onClick={() => setSelectedMeal('')}
              className="text-sm text-[#2F6B4A] hover:underline flex items-center"
            >
              ← Back to meal selection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {dietOptions.map((diet) => (
              <Card
                key={diet.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200",
                  selectedDiet === diet.id 
                    ? "ring-2 ring-[#2F6B4A] shadow-lg" 
                    : "hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedDiet(diet.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={diet.image} 
                    alt={diet.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder-diet.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className="font-medium text-white">{diet.label}</h3>
                    <p className="text-white/90 text-sm">
                      {(diet.co2/4).toFixed(2)} kg CO<sub>2</sub> per meal
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-[#F8FAF8]">
                  <p className="text-sm text-[#636E72]">{diet.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Confirmation View
        <div className="space-y-4">
          <div className="bg-[#F8FAF8] p-4 rounded-lg">
            <h3 className="font-medium text-[#2D3436] mb-2">Selected Meal</h3>
            <p className="text-[#636E72]">
              {mealOptions.find(m => m.id === selectedMeal)?.label} - {dietOptions.find(d => d.id === selectedDiet)?.label}
            </p>
            <p className="text-sm text-[#636E72] mt-1">
              Estimated impact: {((dietOptions.find(d => d.id === selectedDiet)?.co2 || 0)/4).toFixed(2)} kg CO₂
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              className="flex-1 bg-[#2F6B4A] hover:bg-[#408860] text-white"
              onClick={handleDietSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Logging..." : "Confirm"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
