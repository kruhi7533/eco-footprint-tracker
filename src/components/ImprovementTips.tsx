import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

const ecoTips = [
  {
    id: 1,
    title: "Renewable Energy",
    description: "Switch to renewable energy sources for your home",
    link: "https://www.energy.gov/clean-energy",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 2,
    title: "Sustainable Transport",
    description: "Choose eco-friendly transportation methods",
    link: "https://www.epa.gov/transportation-air-pollution-and-climate-change",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 3,
    title: "Zero Waste Living",
    description: "Adopt zero waste practices in daily life",
    link: "https://www.epa.gov/transforming-waste-tool",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 4,
    title: "Plant-Based Diet",
    description: "Reduce carbon footprint through diet choices",
    link: "https://www.un.org/en/actnow/food-choices",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 5,
    title: "Water Conservation",
    description: "Save water with efficient practices",
    link: "https://www.epa.gov/watersense",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 6,
    title: "Energy Efficiency",
    description: "Optimize home energy usage",
    link: "https://www.energy.gov/energysaver/energy-saver",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 7,
    title: "Sustainable Shopping",
    description: "Make eco-conscious purchasing decisions",
    link: "https://www.epa.gov/greenerproducts",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 8,
    title: "Green Gardening",
    description: "Create an eco-friendly garden",
    link: "https://www.epa.gov/green-infrastructure",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 9,
    title: "Waste Recycling",
    description: "Learn proper recycling methods",
    link: "https://www.epa.gov/recycle",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
];

export function ImprovementTips() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {ecoTips.map((tip) => (
        <Card
          key={tip.id}
          className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${tip.gradient} group`}
        >
          <div className="p-6 text-white min-h-[180px] flex flex-col justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-bold mb-3">{tip.title}</h3>
              <p className="text-white/90 text-base leading-relaxed mb-6">{tip.description}</p>
            </div>
            
            {/* Learn More Link */}
            <div className="flex items-center">
              <a
                href={tip.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white font-medium hover:text-white/90 transition-colors"
              >
                Learn More
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Large Number Watermark */}
            <div className="absolute -right-4 bottom-0 text-[140px] font-bold opacity-10 select-none pointer-events-none leading-none">
              {String(tip.id).padStart(2, '0')}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 