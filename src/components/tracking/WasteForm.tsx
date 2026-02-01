import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, getCurrentUTCDate } from "@/lib/utils";
import { toast } from "sonner";
import { addCarbonEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type WasteType = 'general' | 'recycling' | 'organic' | 'electronic';
type DisposalType = 'landfill' | 'recycle' | 'compost' | 'special';

interface WasteOption {
  id: WasteType;
  label: string;
  icon: string;
  description: string;
  unit: string;
}

interface DisposalOption {
  id: DisposalType;
  label: string;
  co2PerKg: number;
  image: string;
  description: string;
}

const wasteOptions: WasteOption[] = [
  {
    id: 'general',
    label: 'General Waste',
    icon: '🗑️',
    description: 'Regular household waste',
    unit: 'kg'
  },
  {
    id: 'recycling',
    label: 'Recyclables',
    icon: '♻️',
    description: 'Paper, plastic, glass, metal',
    unit: 'kg'
  },
  {
    id: 'organic',
    label: 'Organic Waste',
    icon: '🥬',
    description: 'Food and garden waste',
    unit: 'kg'
  },
  {
    id: 'electronic',
    label: 'E-Waste',
    icon: '📱',
    description: 'Electronic devices',
    unit: 'kg'
  }
];

const disposalOptions: Record<WasteType, DisposalOption[]> = {
  general: [
    {
      id: 'landfill',
      label: 'Landfill',
      co2PerKg: 0.587,
      image: '/images/waste/landfill.svg',
      description: 'Waste sent to landfill'
    },
    {
      id: 'recycle',
      label: 'Mixed Recycling',
      co2PerKg: 0.233,
      image: '/images/waste/recycle.svg',
      description: 'Basic sorting for recycling'
    }
  ],
  recycling: [
    {
      id: 'recycle',
      label: 'Sorted Recycling',
      co2PerKg: 0.121,
      image: '/images/waste/recycle.svg',
      description: 'Properly sorted materials'
    },
    {
      id: 'special',
      label: 'Advanced Recycling',
      co2PerKg: 0.089,
      image: '/images/waste/recycle.svg',
      description: 'Specialized recycling process'
    }
  ],
  organic: [
    {
      id: 'landfill',
      label: 'Regular Bin',
      co2PerKg: 0.622,
      image: '/images/waste/landfill.svg',
      description: 'Disposed with regular waste'
    },
    {
      id: 'compost',
      label: 'Composting',
      co2PerKg: 0.091,
      image: '/images/waste/compost.svg',
      description: 'Organic waste composting'
    }
  ],
  electronic: [
    {
      id: 'landfill',
      label: 'Regular Disposal',
      co2PerKg: 0.892,
      image: '/images/waste/landfill.svg',
      description: 'Disposed with regular waste'
    },
    {
      id: 'special',
      label: 'E-Waste Recycling',
      co2PerKg: 0.234,
      image: '/images/waste/recycle.svg',
      description: 'Specialized e-waste handling'
    }
  ]
};

export function WasteForm() {
  const [selectedWaste, setSelectedWaste] = useState<WasteType | ''>('');
  const [selectedDisposal, setSelectedDisposal] = useState<DisposalType | ''>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const handleSubmit = async () => {
    if (!selectedWaste || !selectedDisposal || !amount) return;
    
    setIsLoading(true);
    try {
      const disposalOption = disposalOptions[selectedWaste].find(f => f.id === selectedDisposal);
      if (!disposalOption) throw new Error('Invalid disposal type');
      
      const emissions = disposalOption.co2PerKg * amount;
      
      await addCarbonEntry({
        date: getCurrentUTCDate(),
        category: 'waste',
        activity_type: `${selectedWaste}_${selectedDisposal}`,
        amount,
        emissions
      });
      
      // Invalidate the carbon data cache to refresh the chart
      queryClient.invalidateQueries({ queryKey: ['dailySummaries'] });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added for your ${amount}kg of ${selectedWaste} waste`);
      refreshProfile();
      // Reset selections after successful submission
      setSelectedWaste('');
      setSelectedDisposal('');
      setAmount(0);
    } catch (error) {
      console.error('Error adding waste entry:', error);
      toast.error("Failed to log waste. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (amount > 0) {
      setAmount(0);
    } else if (selectedDisposal) {
      setSelectedDisposal('');
    } else {
      setSelectedWaste('');
    }
  };

  return (
    <div className="space-y-6">
      {!selectedWaste ? (
        // Waste Type Selection
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-4">Select Waste Type</label>
          <div className="grid grid-cols-2 gap-6">
            {wasteOptions.map((waste) => (
              <Card
                key={waste.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200 hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedWaste(waste.id)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">{waste.icon}</span>
                  <h3 className="font-medium text-lg text-[#2D3436] mb-2">{waste.label}</h3>
                  <p className="text-sm text-[#636E72]">{waste.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedDisposal ? (
        // Disposal Method Selection
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-[#2D3436]">
              Select Disposal Method for {wasteOptions.find(w => w.id === selectedWaste)?.label}
            </label>
            <button
              onClick={() => setSelectedWaste('')}
              className="text-sm text-[#2F6B4A] hover:underline flex items-center"
            >
              ← Back to waste selection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {disposalOptions[selectedWaste].map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200",
                  selectedDisposal === option.id 
                    ? "ring-2 ring-[#2F6B4A] shadow-lg" 
                    : "hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedDisposal(option.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder-waste.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className="font-medium text-white">{option.label}</h3>
                    <p className="text-white/90 text-sm">
                      {option.co2PerKg} kg CO<sub>2</sub>/kg
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
            <h3 className="font-medium text-[#2D3436] mb-2">Selected Waste Disposal</h3>
            <p className="text-[#636E72]">
              {wasteOptions.find(w => w.id === selectedWaste)?.label} - {
                disposalOptions[selectedWaste].find(d => d.id === selectedDisposal)?.label
              }
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2D3436]">Amount (kg)</label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount in kilograms"
              className="w-full"
            />
            {amount > 0 && (
              <p className="text-sm text-[#636E72]">
                Estimated impact: {(amount * (disposalOptions[selectedWaste].find(d => d.id === selectedDisposal)?.co2PerKg || 0)).toFixed(2)} kg CO₂
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
