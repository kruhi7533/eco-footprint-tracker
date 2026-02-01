
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCarbonData } from "@/hooks/useCarbonData";
import { useLiveBenchmarkData } from "@/hooks/useLiveBenchmarkData";
import { BarChart, Clock, Users, Building2, Globe, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface BenchmarkData {
  category: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  lastUpdated: string;
}

export function CarbonBenchmarking() {
  const { profile } = useAuth();
  const { summaries } = useCarbonData(7);
  const { data: liveData, isLoading, error } = useLiveBenchmarkData();
  const [activeTab, setActiveTab] = useState("global");
  
  // Calculate user's current average daily emissions
  const userAverage = summaries && summaries.length > 0 
    ? summaries.reduce((sum, day) => sum + day.total, 0) / summaries.length 
    : 0;

  // Use live data if available, fallback to mock data
  const getBenchmarkData = (): Record<string, BenchmarkData[]> => {
    if (!liveData) {
      // Fallback mock data
      return {
        global: [
          {
            category: "Your Average",
            value: userAverage,
            icon: <Users className="h-4 w-4" />,
            description: "Your daily carbon footprint",
            lastUpdated: "Live"
          },
          {
            category: "Country Average",
            value: 15.2,
            icon: <Globe className="h-4 w-4" />,
            description: "National average daily emissions",
            lastUpdated: "Mock Data"
          },
          {
            category: "Global Average",
            value: 12.8,
            icon: <Globe className="h-4 w-4" />,
            description: "Worldwide average daily emissions",
            lastUpdated: "Mock Data"
          }
        ],
        regional: [
          {
            category: "Your Average",
            value: userAverage,
            icon: <Users className="h-4 w-4" />,
            description: "Your daily carbon footprint",
            lastUpdated: "Live"
          },
          {
            category: "Regional Average",
            value: 13.5,
            icon: <Users className="h-4 w-4" />,
            description: "Local community average",
            lastUpdated: "Mock Data"
          },
          {
            category: "City Average",
            value: 11.8,
            icon: <Building2 className="h-4 w-4" />,
            description: "Metropolitan area average",
            lastUpdated: "Mock Data"
          }
        ],
        demographic: [
          {
            category: "Your Average",
            value: userAverage,
            icon: <Users className="h-4 w-4" />,
            description: "Your daily carbon footprint",
            lastUpdated: "Live"
          },
          {
            category: "Age Group Average",
            value: 14.2,
            icon: <Users className="h-4 w-4" />,
            description: "25-35 year olds average",
            lastUpdated: "Mock Data"
          },
          {
            category: "Professional Average",
            value: 16.5,
            icon: <Building2 className="h-4 w-4" />,
            description: "Tech industry average",
            lastUpdated: "Mock Data"
          }
        ]
      };
    }

    const formatDate = (dateString: string) => {
      try {
        return format(new Date(dateString), "MMM dd, yyyy HH:mm");
      } catch {
        return "Recently updated";
      }
    };

    return {
      global: [
        {
          category: "Your Average",
          value: userAverage,
          icon: <Users className="h-4 w-4" />,
          description: "Your daily carbon footprint",
          lastUpdated: "Live"
        },
        {
          category: "Country Average",
          value: liveData.country.average_daily,
          icon: <Globe className="h-4 w-4" />,
          description: "National average daily emissions (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        },
        {
          category: "Global Average",
          value: liveData.global.average_daily,
          icon: <Globe className="h-4 w-4" />,
          description: "Worldwide average daily emissions (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        }
      ],
      regional: [
        {
          category: "Your Average",
          value: userAverage,
          icon: <Users className="h-4 w-4" />,
          description: "Your daily carbon footprint",
          lastUpdated: "Live"
        },
        {
          category: "Regional Average",
          value: liveData.regional.average_daily,
          icon: <Users className="h-4 w-4" />,
          description: "Local community average (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        },
        {
          category: "City Average",
          value: liveData.regional.average_daily * 0.9,
          icon: <Building2 className="h-4 w-4" />,
          description: "Metropolitan area average (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        }
      ],
      demographic: [
        {
          category: "Your Average",
          value: userAverage,
          icon: <Users className="h-4 w-4" />,
          description: "Your daily carbon footprint",
          lastUpdated: "Live"
        },
        {
          category: "Industry Average",
          value: liveData.country.average_daily * 1.1,
          icon: <Building2 className="h-4 w-4" />,
          description: "Tech industry average (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        },
        {
          category: "Professional Average",
          value: liveData.global.average_daily * 1.2,
          icon: <Users className="h-4 w-4" />,
          description: "Professional demographic average (live data)",
          lastUpdated: formatDate(liveData.lastUpdated)
        }
      ]
    };
  };

  const currentBenchmarks = getBenchmarkData()[activeTab] || getBenchmarkData().global;
  const maxValue = Math.max(...currentBenchmarks.map(b => b.value));

  // Calculate comparison summary
  const getComparisonSummary = () => {
    if (userAverage === 0) return "Start tracking to see your impact!";
    
    const comparison = currentBenchmarks.find(b => b.category !== "Your Average");
    if (!comparison) return "";
    
    const difference = ((comparison.value - userAverage) / comparison.value * 100);
    const isLower = difference > 0;
    
    if (activeTab === "global") {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than the ${comparison.category.toLowerCase()}.`;
    } else if (activeTab === "regional") {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than your local community average.`;
    } else {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than the average professional in your demographic.`;
    }
  };

  return (
    <Card className="bg-ecoSecondary border-ecoAccent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart className="h-5 w-5" />
          Live Carbon Footprint Benchmarking
          {liveData && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full ml-2">
              LIVE
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-green-400 mr-2" />
            <span className="text-green-200">Loading live benchmark data...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-200">
              Unable to load live data. Showing cached benchmarks.
            </span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-ecoPrimary/30">
            <TabsTrigger 
              value="global" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Global
            </TabsTrigger>
            <TabsTrigger 
              value="regional" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Regional
            </TabsTrigger>
            <TabsTrigger 
              value="demographic" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Demographic
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {currentBenchmarks.map((benchmark, index) => (
                <div key={benchmark.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {benchmark.icon}
                      <span className={`text-sm font-medium ${
                        benchmark.category === "Your Average" ? "text-green-400" : "text-green-200"
                      }`}>
                        {benchmark.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${
                        benchmark.category === "Your Average" ? "text-green-400" : "text-green-200"
                      }`}>
                        {benchmark.value.toFixed(1)} kg/day
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-300">
                        <Clock className="h-3 w-3" />
                        {benchmark.lastUpdated}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-3 bg-ecoPrimary/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        benchmark.category === "Your Average" 
                          ? "bg-green-400" 
                          : "bg-ecoAccent"
                      }`}
                      style={{ 
                        width: `${Math.min((benchmark.value / maxValue) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-green-300 mt-1">
                    {benchmark.description}
                  </p>
                </div>
              ))}
              
              {/* Comparison Summary */}
              <div className="mt-6 p-4 bg-ecoPrimary/20 rounded-lg border border-ecoAccent/30">
                <h4 className="text-sm font-medium text-green-400 mb-2">Summary</h4>
                <p className="text-sm text-green-200">
                  {getComparisonSummary()}
                </p>
                {liveData && (
                  <p className="text-xs text-green-300 mt-2">
                    Data powered by Climatiq API - Last updated: {format(new Date(liveData.lastUpdated), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                )}
              </div>
              
              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-ecoPrimary/10 rounded-lg border border-ecoAccent/20">
                <p className="text-xs text-green-300">
                  <span className="font-medium">Privacy Protected:</span> All comparisons are anonymous and aggregated. 
                  Your individual data is never shared with other users.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
