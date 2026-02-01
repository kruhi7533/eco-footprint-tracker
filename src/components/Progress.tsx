
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { CalendarDays, TrendingDown, TrendingUp, Target, Loader2, ExternalLink, Car, Lightbulb, Utensils, Leaf } from "lucide-react";
import { useProgressData } from "@/hooks/useProgressData";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { memo, useCallback } from "react";

interface ProgressProps {
  progress?: any;
}

// Memoized improvement tips component for better performance
const ImprovementTipsSection = memo(() => {
  const improvementTips = [
    {
      id: 1,
      title: "Renewable Energy",
      description: "Switch to renewable energy sources for your home",
      link: "https://www.energy.gov/clean-energy",
    },
    {
      id: 2,
      title: "Sustainable Transport",
      description: "Choose eco-friendly transportation methods",
      link: "https://www.epa.gov/transportation-air-pollution-and-climate-change",
    },
    {
      id: 3,
      title: "Zero Waste Living",
      description: "Adopt zero waste practices in daily life",
      link: "https://www.epa.gov/transforming-waste-tool",
    },
    {
      id: 4,
      title: "Plant-Based Diet",
      description: "Reduce carbon footprint through diet choices",
      link: "https://www.un.org/en/actnow/food-choices",
    },
    {
      id: 5,
      title: "Water Conservation",
      description: "Save water with efficient practices",
      link: "https://www.epa.gov/watersense",
    },
    {
      id: 6,
      title: "Energy Efficiency",
      description: "Optimize home energy usage",
      link: "https://www.energy.gov/energysaver/energy-saver",
    },
  ];

  const handleTipClick = useCallback((link: string) => {
    window.open(link, '_blank');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-white">
          <Lightbulb className="h-6 w-6" />
          Improvement Tips
        </h2>
        <p className="text-green-100">
          Personalized suggestions to reduce your carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {improvementTips.map((tip) => (
          <Card
            key={tip.id}
            className="relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl bg-ecoPrimary border-ecoSecondary group"
            onClick={() => handleTipClick(tip.link)}
          >
            <div className="p-6 text-white min-h-[160px] flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
                <p className="text-green-100 text-sm leading-relaxed mb-4">{tip.description}</p>
              </div>
              
              <div className="flex items-center">
                <span className="inline-flex items-center text-white font-medium hover:text-green-100 transition-colors text-sm">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              <div className="absolute -right-2 bottom-0 text-[80px] font-bold opacity-10 select-none pointer-events-none leading-none text-green-300">
                {String(tip.id).padStart(2, '0')}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

ImprovementTipsSection.displayName = 'ImprovementTipsSection';

// Memoized category card component
const CategoryCard = memo(({ category }: { category: any }) => {
  const getCategoryIcon = useCallback((categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'transportation':
        return <Car className="h-5 w-5" />;
      case 'energy':
        return <Lightbulb className="h-5 w-5" />;
      case 'diet':
        return <Utensils className="h-5 w-5" />;
      case 'waste':
        return <Leaf className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  }, []);

  return (
    <Card className="bg-ecoPrimary border-ecoSecondary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium capitalize flex items-center gap-2 text-white">
            {getCategoryIcon(category.category)}
            {category.category}
          </CardTitle>
        </div>
        {category.percentage > 0 ? (
          <TrendingDown className="h-4 w-4 text-green-400" />
        ) : (
          <TrendingUp className="h-4 w-4 text-red-400" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-green-200">Current: {category.current_emissions.toFixed(1)} kg</div>
            <div className="text-sm text-green-200">Baseline: {category.baseline_emissions.toFixed(1)} kg</div>
          </div>
          
          <div className="w-full bg-ecoSecondary/30 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.abs(category.percentage))}%` }}
            />
          </div>
          
          <div className={`text-sm font-medium ${category.percentage > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {category.percentage > 0 ? '-' : '+'}{Math.abs(category.percentage).toFixed(1)}% reduction
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard';

export function Progress({ progress }: ProgressProps = {}) {
  const { progressData, isLoading, error } = useProgressData();
  const { profile } = useAuth();

  const dataToUse = progress || progressData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ecoPrimary">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-green-400" />
          <span className="ml-2 text-green-100">Loading progress data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ecoPrimary p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Progress Overview</h2>
        <Card className="bg-ecoSecondary border-ecoAccent">
          <CardContent className="pt-6">
            <p className="text-center text-red-400">
              Error loading progress data: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dataToUse || dataToUse.length === 0) {
    return (
      <div className="min-h-screen bg-ecoPrimary p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Progress Overview</h2>
        <div className="text-center py-8">
          <p className="text-green-200">No progress data available yet.</p>
          <p className="text-sm text-green-300 mt-2">Start tracking your carbon footprint to see your progress!</p>
        </div>
      </div>
    );
  }

  // Calculate total reduction across all categories
  const totalReduction = dataToUse.reduce((sum: number, category: any) => {
    return sum + (category.reduction || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-ecoPrimary">
      {/* Header Section */}
      <div className="bg-ecoPrimary text-white p-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Your Progress</h1>
          <p className="text-green-200 mb-8">
            Track your carbon reduction journey and see your improvements over time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-ecoSecondary/30 backdrop-blur-sm rounded-lg p-6 border border-ecoAccent">
              <h3 className="text-sm font-medium text-green-200 mb-2">Current Level</h3>
              <div className="text-3xl font-bold text-white">{profile?.level || 1}</div>
            </div>
            <div className="bg-ecoSecondary/30 backdrop-blur-sm rounded-lg p-6 border border-ecoAccent">
              <h3 className="text-sm font-medium text-green-200 mb-2">Total Reductions</h3>
              <div className="text-3xl font-bold text-white">{totalReduction.toFixed(1)} kg CO₂</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dataToUse.map((category: any) => (
            <CategoryCard key={category.category} category={category} />
          ))}
        </div>

        {/* Emissions Trend Chart */}
        <Card className="bg-ecoSecondary border-ecoAccent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingDown className="h-5 w-5" />
              Emissions Trend
            </CardTitle>
            <CardDescription className="text-green-200">Your carbon footprint by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataToUse}>
                  <XAxis 
                    dataKey="category" 
                    stroke="#bbf7d0"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#bbf7d0"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} kg`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1B4332',
                      border: '1px solid #2D6A4F',
                      borderRadius: '8px',
                      color: '#bbf7d0'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="current_emissions"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={{ fill: "#4ade80", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline_emissions"
                    stroke="#a3a3a3"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={{ fill: "#a3a3a3", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Tips Section */}
        <ImprovementTipsSection />
      </div>
    </div>
  );
}
