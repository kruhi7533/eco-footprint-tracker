import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

type TabType = 'Transport' | 'Energy' | 'Diet' | 'Waste';
type DietType = 'meat-heavy' | 'average' | 'vegetarian' | 'vegan';

interface DietImpact {
  label: string;
  co2: number;
  image: string;
  description: string;
}

const Tracking: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>('Diet');
  const [selectedDiet, setSelectedDiet] = useState<DietType | ''>('');

  const tabs: TabType[] = ['Transport', 'Energy', 'Diet', 'Waste'];

  const dietImpacts: Record<DietType, DietImpact> = {
    'meat-heavy': {
      label: 'Meat Heavy',
      co2: 7.19,
      image: '/images/diets/meat-heavy.jpg',
      description: 'High in animal products and red meat'
    },
    'average': {
      label: 'Average Diet',
      co2: 5.63,
      image: '/images/diets/average.jpg',
      description: 'Balanced mix of meat and vegetables'
    },
    'vegetarian': {
      label: 'Vegetarian',
      co2: 3.81,
      image: '/images/diets/vegetarian.jpg',
      description: 'No meat, includes dairy and eggs'
    },
    'vegan': {
      label: 'Vegan',
      co2: 2.89,
      image: '/images/diets/vegan.jpg',
      description: '100% plant-based foods'
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#2D3436] mb-2">Track Your Carbon Footprint</h1>
          <p className="text-[#636E72] mb-8">Log your daily activities to calculate your carbon emissions</p>

          {/* Tabs */}
          <div className="flex bg-[#F5F7F6] rounded-lg mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "flex-1 px-6 py-3 text-[#636E72] text-sm font-medium",
                  selectedTab === tab && "text-[#2D3436] bg-white rounded-lg"
                )}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Diet Content */}
          {selectedTab === 'Diet' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-4">Select Your Diet Type</label>
                <div className="grid grid-cols-2 gap-6">
                  {(Object.entries(dietImpacts) as [DietType, DietImpact][]).map(([key, impact]) => (
                    <Card
                      key={key}
                      className={cn(
                        "cursor-pointer overflow-hidden transition-all duration-200 group bg-white border-gray-200",
                        selectedDiet === key 
                          ? "ring-2 ring-[#2F6B4A] shadow-lg" 
                          : "hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-[#2F6B4A]"
                      )}
                      onClick={() => setSelectedDiet(key)}
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img 
                          src={impact.image} 
                          alt={impact.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/images/placeholder-diet.jpg';
                          }}
                        />
                        {selectedDiet === key && (
                          <div className="absolute inset-0 bg-[#2F6B4A] bg-opacity-20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                              <svg 
                                className="w-6 h-6 text-[#2F6B4A]" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                          <h3 className="font-medium text-white">{impact.label}</h3>
                          <p className="text-white/90 text-sm">
                            {impact.co2} kg CO<sub>2</sub> per day
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-[#F8FAF8]">
                        <p className="text-sm text-[#636E72]">{impact.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedDiet && (
                <button 
                  className="w-full bg-[#2F6B4A] hover:bg-[#408860] text-white py-4 rounded-lg font-medium text-lg transition-colors duration-200"
                >
                  Log Diet
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-[#636E72] mt-6">
          Track your daily activities to get an accurate carbon footprint calculation.
        </p>
      </div>
    </div>
  );
};

export default Tracking; 