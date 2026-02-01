import React from 'react';
import { Card } from "@/components/ui/card";
import { Lightbulb } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

interface EcoTip {
  id: string;
  title: string;
  impactLevel: number;
  category: 'transportation' | 'energy' | 'diet' | 'waste';
  link: string;
}

const defaultTips: EcoTip[] = [
  {
    id: '1',
    title: 'Consider switching to an electric or hybrid vehicle',
    category: 'transportation',
    link: '/tracking/transportation',
    impactLevel: 4,
  },
  {
    id: '2',
    title: 'For short trips, walk or cycle instead of driving',
    category: 'transportation',
    link: '/tracking/transportation',
    impactLevel: 3,
  },
  {
    id: '3',
    title: 'Use public transportation instead of driving alone',
    category: 'transportation',
    link: '/tracking/transportation',
    impactLevel: 3,
  },
  {
    id: '4',
    title: 'Install smart thermostats to optimize energy usage',
    category: 'energy',
    link: '/tracking/energy',
    impactLevel: 4,
  },
];

interface EcoTipsGridProps {
  tips?: EcoTip[];
  className?: string;
}

export function EcoTipsGrid({ tips = defaultTips, className }: EcoTipsGridProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Improvement Tips
        </h2>
        <p className="text-muted-foreground">
          Personalized suggestions to reduce your carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <Card
            key={tip.id}
            className="p-4 cursor-pointer hover:bg-ecoLight transition-all duration-200"
            onClick={() => navigate(tip.link)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-ecoLight flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-ecoPrimary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-2">{tip.title}</p>
                <div className="flex space-x-1">
                  {Array.from({ length: tip.impactLevel }, (_, i) => (
                    <div
                      key={i}
                      className="h-1 w-3 rounded-full bg-ecoPrimary"
                    />
                  ))}
                  {Array.from({ length: 5 - tip.impactLevel }, (_, i) => (
                    <div
                      key={i + tip.impactLevel}
                      className="h-1 w-3 rounded-full bg-ecoLight"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}