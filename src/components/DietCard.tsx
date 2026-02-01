import React from 'react';
import { Card } from "@/components/ui/card";

interface DietCardProps {
  title: string;
  co2: number;
  image: string;
  isSelected: boolean;
  onClick: () => void;
}

export const DietCard: React.FC<DietCardProps> = ({
  title,
  co2,
  image,
  isSelected,
  onClick,
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected ? 'ring-2 ring-[#2F6B4A]' : 'hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#2F6B4A] bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
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
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#2D3436]">{title}</h3>
        <p className="text-sm text-[#636E72] mt-1">
          {co2} kg CO<sub>2</sub> per day
        </p>
      </div>
    </Card>
  );
}; 