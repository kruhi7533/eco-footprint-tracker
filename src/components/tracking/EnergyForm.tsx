import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, getCurrentUTCDate } from "@/lib/utils";
import { toast } from "sonner";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type EnergyType = 'electricity' | 'gas' | 'water' | 'heating';
type UsageType = 'home' | 'office' | 'renewable' | 'standard';

interface EnergyOption {
  id: EnergyType;
  label: string;
  icon: string;
  description: string;
  unit: string;
}

interface UsageOption {
  id: UsageType;
  label: string;
  co2PerUnit: number;
  image: string;
  description: string;
}

const energyOptions: EnergyOption[] = [
  {
    id: 'electricity',
    label: 'Electricity',
    icon: '⚡',
    description: 'Power consumption',
    unit: 'kWh'
  },
  {
    id: 'gas',
    label: 'Natural Gas',
    icon: '🔥',
    description: 'Gas consumption',
    unit: 'm³'
  },
  {
    id: 'water',
    label: 'Water',
    icon: '💧',
    description: 'Water usage',
    unit: 'm³'
  },
  {
    id: 'heating',
    label: 'Heating',
    icon: '🌡️',
    description: 'Heating energy',
    unit: 'kWh'
  }
];

const usageOptions: Record<EnergyType, UsageOption[]> = {
  electricity: [
    {
      id: 'standard',
      label: 'Standard Grid',
      co2PerUnit: 0.475,
      image: '/images/energy/electricity.svg',
      description: 'Regular power grid electricity'
    },
    {
      id: 'renewable',
      label: 'Green Energy',
      co2PerUnit: 0.025,
      image: '/images/energy/electricity.svg',
      description: 'Renewable energy sources'
    }
  ],
  gas: [
    {
      id: 'home',
      label: 'Home Usage',
      co2PerUnit: 2.02,
      image: '/images/energy/gas.svg',
      description: 'Residential natural gas'
    },
    {
      id: 'office',
      label: 'Commercial',
      co2PerUnit: 1.98,
      image: '/images/energy/gas.svg',
      description: 'Commercial gas usage'
    }
  ],
  water: [
    {
      id: 'home',
      label: 'Home Usage',
      co2PerUnit: 0.344,
      image: '/images/energy/water.svg',
      description: 'Residential water consumption'
    },
    {
      id: 'office',
      label: 'Commercial',
      co2PerUnit: 0.322,
      image: '/images/energy/water.svg',
      description: 'Commercial water usage'
    }
  ],
  heating: [
    {
      id: 'standard',
      label: 'Traditional',
      co2PerUnit: 0.269,
      image: '/images/energy/oil.svg',
      description: 'Conventional heating system'
    },
    {
      id: 'renewable',
      label: 'Heat Pump',
      co2PerUnit: 0.119,
      image: '/images/energy/electricity.svg',
      description: 'Energy efficient heat pump'
    }
  ]
};

export function EnergyForm() {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyType | ''>('');
  const [selectedUsage, setSelectedUsage] = useState<UsageType | ''>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const handleSubmit = async () => {
    if (!selectedEnergy || !selectedUsage || !amount) return;
    
    setIsLoading(true);
    try {
      const usageOption = usageOptions[selectedEnergy].find(f => f.id === selectedUsage);
      if (!usageOption) throw new Error('Invalid usage type');
      
      const emissions = usageOption.co2PerUnit * amount;
      
      await addCarbonEntry({
        date: getCurrentUTCDate(),
        category: 'energy',
        activity_type: `${selectedEnergy}_${selectedUsage}`,
        amount,
        emissions
      });
      
      // Invalidate the carbon data cache to refresh the chart
      queryClient.invalidateQueries({ queryKey: ['dailySummaries'] });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added for your ${amount} ${energyOptions.find(e => e.id === selectedEnergy)?.unit} of ${selectedEnergy}`);
      refreshProfile();
      // Reset selections after successful submission
      setSelectedEnergy('');
      setSelectedUsage('');
      setAmount(0);
    } catch (error) {
      console.error('Error adding energy entry:', error);
      toast.error("Failed to log energy usage. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (amount > 0) {
      setAmount(0);
    } else if (selectedUsage) {
      setSelectedUsage('');
    } else {
      setSelectedEnergy('');
    }
  };

  return (
    <div className="space-y-6">
      {!selectedEnergy ? (
        // Energy Type Selection
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-4">Select Energy Type</label>
          <div className="grid grid-cols-2 gap-6">
            {energyOptions.map((energy) => (
              <Card
                key={energy.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200 hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedEnergy(energy.id)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">{energy.icon}</span>
                  <h3 className="font-medium text-lg text-[#2D3436] mb-2">{energy.label}</h3>
                  <p className="text-sm text-[#636E72]">{energy.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedUsage ? (
        // Usage Type Selection
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-[#2D3436]">
              Select Type for {energyOptions.find(e => e.id === selectedEnergy)?.label}
            </label>
            <button
              onClick={() => setSelectedEnergy('')}
              className="text-sm text-[#2F6B4A] hover:underline flex items-center"
            >
              ← Back to energy selection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {usageOptions[selectedEnergy].map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200",
                  selectedUsage === option.id 
                    ? "ring-2 ring-[#2F6B4A] shadow-lg" 
                    : "hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedUsage(option.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder-energy.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className="font-medium text-white">{option.label}</h3>
                    <p className="text-white/90 text-sm">
                      {option.co2PerUnit} kg CO<sub>2</sub>/{energyOptions.find(e => e.id === selectedEnergy)?.unit}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-[#F8FAF8]">
                  <p className="text-sm text-[#636E72]">{option.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Amount Input and Confirmation
        <div className="space-y-4">
          <div className="bg-[#F8FAF8] p-4 rounded-lg">
            <h3 className="font-medium text-[#2D3436] mb-2">Selected Energy Usage</h3>
            <p className="text-[#636E72]">
              {energyOptions.find(e => e.id === selectedEnergy)?.label} - {
                usageOptions[selectedEnergy].find(u => u.id === selectedUsage)?.label
              }
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2D3436]">
              Amount ({energyOptions.find(e => e.id === selectedEnergy)?.unit})
            </label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder={`Enter amount in ${energyOptions.find(e => e.id === selectedEnergy)?.unit}`}
              className="w-full"
            />
            {amount > 0 && (
              <p className="text-sm text-[#636E72]">
                Estimated impact: {(amount * (usageOptions[selectedEnergy].find(u => u.id === selectedUsage)?.co2PerUnit || 0)).toFixed(2)} kg CO₂
              </p>
            )}
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
              onClick={handleSubmit}
              disabled={isLoading || !amount}
            >
              {isLoading ? "Logging..." : "Confirm"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
