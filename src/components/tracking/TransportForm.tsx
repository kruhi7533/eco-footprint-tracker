import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, getCurrentUTCDate } from "@/lib/utils";
import { toast } from "sonner";
import { addCarbonEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type TransportType = 'car' | 'bus' | 'train' | 'bike';
type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

interface TransportOption {
  id: TransportType;
  label: string;
  icon: string;
  description: string;
}

interface FuelOption {
  id: FuelType;
  label: string;
  co2PerKm: number;
  image: string;
  description: string;
}

const transportOptions: TransportOption[] = [
  {
    id: 'car',
    label: 'Car',
    icon: '🚗',
    description: 'Personal vehicle transport'
  },
  {
    id: 'bus',
    label: 'Bus',
    icon: '🚌',
    description: 'Public bus transportation'
  },
  {
    id: 'train',
    label: 'Train',
    icon: '🚂',
    description: 'Rail transport system'
  },
  {
    id: 'bike',
    label: 'Bicycle',
    icon: '🚲',
    description: 'Zero-emission cycling'
  }
];

const fuelOptions: Record<TransportType, FuelOption[]> = {
  car: [
    {
      id: 'petrol',
      label: 'Petrol',
      co2PerKm: 0.192,
      image: '/images/transport/car/petrol.svg',
      description: 'Standard petrol engine vehicle'
    },
    {
      id: 'diesel',
      label: 'Diesel',
      co2PerKm: 0.171,
      image: '/images/transport/car/diesel.svg',
      description: 'Diesel engine vehicle'
    },
    {
      id: 'hybrid',
      label: 'Hybrid',
      co2PerKm: 0.111,
      image: '/images/transport/car/hybrid.svg',
      description: 'Combined electric and fuel engine'
    },
    {
      id: 'electric',
      label: 'Electric',
      co2PerKm: 0.053,
      image: '/images/transport/car/electric.svg',
      description: 'Fully electric vehicle'
    }
  ],
  bus: [
    {
      id: 'diesel',
      label: 'Regular Bus',
      co2PerKm: 0.089,
      image: '/images/transport/bus/regular.svg',
      description: 'Standard diesel bus'
    },
    {
      id: 'electric',
      label: 'Electric Bus',
      co2PerKm: 0.045,
      image: '/images/transport/bus/electric.svg',
      description: 'Zero-emission electric bus'
    }
  ],
  train: [
    {
      id: 'electric',
      label: 'Electric Train',
      co2PerKm: 0.041,
      image: '/images/transport/train/electric.svg',
      description: 'Electric-powered train'
    },
    {
      id: 'diesel',
      label: 'Diesel Train',
      co2PerKm: 0.074,
      image: '/images/transport/train/diesel.svg',
      description: 'Diesel-powered train'
    }
  ],
  bike: [
    {
      id: 'electric',
      label: 'Regular Bike',
      co2PerKm: 0,
      image: '/images/transport/bike/regular.svg',
      description: 'Zero-emission bicycle'
    },
    {
      id: 'electric',
      label: 'Electric Bike',
      co2PerKm: 0.005,
      image: '/images/transport/bike/electric.svg',
      description: 'Electric-assisted bicycle'
    }
  ]
};

export function TransportForm() {
  const [selectedTransport, setSelectedTransport] = useState<TransportType | ''>('');
  const [selectedFuel, setSelectedFuel] = useState<FuelType | ''>('');
  const [distance, setDistance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const handleSubmit = async () => {
    if (!selectedTransport || !selectedFuel || !distance) return;
    
    setIsLoading(true);
    try {
      const fuelOption = fuelOptions[selectedTransport].find(f => f.id === selectedFuel);
      if (!fuelOption) throw new Error('Invalid fuel type');
      
      const emissions = fuelOption.co2PerKm * distance;
      
      await addCarbonEntry({
        date: getCurrentUTCDate(),
        category: 'transportation',
        activity_type: `${selectedTransport}_${selectedFuel}`,
        amount: distance,
        emissions
      });
      
      // Invalidate the carbon data cache to refresh the chart
      queryClient.invalidateQueries({ queryKey: ['dailySummaries'] });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added for your ${distance}km journey`);
      refreshProfile();
      // Reset selections after successful submission
      setSelectedTransport('');
      setSelectedFuel('');
      setDistance(0);
    } catch (error) {
      console.error('Error adding transport entry:', error);
      toast.error("Failed to log transport. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (distance > 0) {
      setDistance(0);
    } else if (selectedFuel) {
      setSelectedFuel('');
    } else {
      setSelectedTransport('');
    }
  };

  return (
    <div className="space-y-6">
      {!selectedTransport ? (
        // Transport Type Selection
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-4">Select Transport Type</label>
          <div className="grid grid-cols-2 gap-6">
            {transportOptions.map((transport) => (
              <Card
                key={transport.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200 hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedTransport(transport.id)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">{transport.icon}</span>
                  <h3 className="font-medium text-lg text-[#2D3436] mb-2">{transport.label}</h3>
                  <p className="text-sm text-[#636E72]">{transport.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedFuel ? (
        // Fuel Type Selection
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-[#2D3436]">
              Select Type for {transportOptions.find(t => t.id === selectedTransport)?.label}
            </label>
            <button
              onClick={() => setSelectedTransport('')}
              className="text-sm text-[#2F6B4A] hover:underline flex items-center"
            >
              ← Back to transport selection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {fuelOptions[selectedTransport].map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200",
                  selectedFuel === option.id 
                    ? "ring-2 ring-[#2F6B4A] shadow-lg" 
                    : "hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                )}
                onClick={() => setSelectedFuel(option.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder-transport.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className="font-medium text-white">{option.label}</h3>
                    <p className="text-white/90 text-sm">
                      {option.co2PerKm} kg CO<sub>2</sub>/km
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
        // Distance Input and Confirmation
        <div className="space-y-4">
          <div className="bg-[#F8FAF8] p-4 rounded-lg">
            <h3 className="font-medium text-[#2D3436] mb-2">Selected Transport</h3>
            <p className="text-[#636E72]">
              {transportOptions.find(t => t.id === selectedTransport)?.label} - {
                fuelOptions[selectedTransport].find(f => f.id === selectedFuel)?.label
              }
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2D3436]">Distance (km)</label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={distance || ''}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              placeholder="Enter distance in kilometers"
              className="w-full"
            />
            {distance > 0 && (
              <p className="text-sm text-[#636E72]">
                Estimated impact: {(distance * (fuelOptions[selectedTransport].find(f => f.id === selectedFuel)?.co2PerKm || 0)).toFixed(2)} kg CO₂
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
              disabled={isLoading || !distance}
            >
              {isLoading ? "Logging..." : "Confirm"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
