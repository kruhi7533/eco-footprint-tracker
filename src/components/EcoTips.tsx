import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Leaf, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getEcoTips, getCarbonEntries } from "@/lib/api";

// Update type to match database values
type TipCategory = 'transportation' | 'energy' | 'diet' | 'waste';

interface Tip {
  id: string;
  category: TipCategory;
  content: string;
  impact_level: number;
  created_at: string;
}

interface CategoryData {
  hasEntries: boolean;
  totalEmissions: number;
  averageEmissions: number;
}

export function EcoTips() {
  const { profile } = useAuth();
  const [tips, setTips] = useState<Record<TipCategory, Tip[]>>({
    transportation: [],
    energy: [],
    diet: [],
    waste: []
  });
  const [categoryData, setCategoryData] = useState<Record<TipCategory, CategoryData>>({
    transportation: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
    energy: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
    diet: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
    waste: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TipCategory>('transportation');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTips();
  }, [profile?.id]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's carbon entries from the past week to analyze recent behavior
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get user's carbon entries
      // We'll filter for one week ago in memory or backend. Backend checks user._id.
      // For now let's fetch recent entries.
      const carbonEntries = await getCarbonEntries(50); // Fetch last 50 entries
      // Filter for last week
      const recentEntries = carbonEntries.filter((e: any) => new Date(e.created_at) >= oneWeekAgo);

      // Calculate category statistics only for recent entries
      const categoryStats = calculateCategoryStatistics(recentEntries || []);
      setCategoryData(categoryStats);

      // Find the first category with recent entries to set as default selected
      const firstCategoryWithEntries = Object.entries(categoryStats)
        .find(([_, data]) => data.hasEntries)?.[0] as TipCategory;

      if (firstCategoryWithEntries) {
        setSelectedCategory(firstCategoryWithEntries);
      }

      // Get all tips
      const allTips = await getEcoTips();

      if (!allTips) {
        throw new Error('No tips found');
      }

      // Organize and filter tips by category - only for categories with recent entries
      const organizedTips = {
        transportation: [],
        energy: [],
        diet: [],
        waste: []
      } as Record<TipCategory, Tip[]>;

      allTips.forEach((tip: any) => {
        const category = tip.category as TipCategory;
        // Only add tips for categories where user has recent entries
        if (organizedTips[category] && categoryStats[category].hasEntries) {
          organizedTips[category].push({
            id: tip.id,
            category: category,
            content: tip.content,
            impact_level: tip.impact_level * (categoryStats[category].averageEmissions || 1),
            created_at: tip.created_at
          });
        }
      });

      // Sort tips by impact level within each category
      Object.keys(organizedTips).forEach((category) => {
        organizedTips[category as TipCategory].sort((a, b) => b.impact_level - a.impact_level);
      });

      setTips(organizedTips);
    } catch (err: any) {
      console.error('Error in fetchTips:', err);
      setError(err.message || 'Failed to fetch tips');
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryStatistics = (entries: any[]): Record<TipCategory, CategoryData> => {
    const stats: Record<TipCategory, CategoryData> = {
      transportation: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
      energy: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
      diet: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 },
      waste: { hasEntries: false, totalEmissions: 0, averageEmissions: 0 }
    };

    // Calculate totals and averages only for entries that exist
    entries.forEach(entry => {
      const category = entry.category as TipCategory;
      if (stats[category]) {
        stats[category].hasEntries = true;
        stats[category].totalEmissions += entry.emissions;
      }
    });

    // Calculate averages and normalize
    let maxAverage = 0;
    Object.keys(stats).forEach(category => {
      const entriesForCategory = entries.filter(e => e.category === category).length;
      if (entriesForCategory > 0) {
        stats[category as TipCategory].averageEmissions =
          stats[category as TipCategory].totalEmissions / entriesForCategory;
        maxAverage = Math.max(maxAverage, stats[category as TipCategory].averageEmissions);
      }
    });

    // Normalize averages to be between 1 and 2
    if (maxAverage > 0) {
      Object.keys(stats).forEach(category => {
        if (stats[category as TipCategory].hasEntries) {
          stats[category as TipCategory].averageEmissions =
            1 + (stats[category as TipCategory].averageEmissions / maxAverage);
        }
      });
    }

    return stats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Failed to load tips: {error}</p>
          <button
            onClick={fetchTips}
            className="mt-4 text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  // Filter out categories with no entries
  const availableCategories = Object.entries(categoryData)
    .filter(([_, data]) => data.hasEntries)
    .map(([category]) => category as TipCategory);

  if (availableCategories.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Data Available</h3>
            <p className="text-muted-foreground">
              Start tracking your carbon footprint to receive personalized eco tips.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Eco Tips</h2>
          <p className="text-muted-foreground">
            Personalized recommendations to reduce your carbon footprint
          </p>
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as TipCategory)}
        >
          <TabsList className="grid w-full" style={{
            gridTemplateColumns: `repeat(${availableCategories.length}, 1fr)`
          }}>
            {availableCategories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableCategories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              {tips[category].map((tip) => (
                <div key={tip.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Leaf className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{tip.content}</p>
                </div>
              ))}
              {tips[category].length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No tips available for this category
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
}
