
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAchievements, getAchievementDefinitions, type AchievementDefinition } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCarbonData } from "@/hooks/useCarbonData";

export function Achievements() {
  const { profile } = useAuth();
  const { summaries } = useCarbonData(30); // Get last 30 days of data

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  });

  const { data: definitions, isLoading: definitionsLoading, error } = useQuery({
    queryKey: ['achievement-definitions'],
    queryFn: getAchievementDefinitions,
  });

  const isLoading = achievementsLoading || definitionsLoading;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.Award className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icons.Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
            <span className="ml-2">Loading achievements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.Award className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-600 py-8">
            Error loading achievements: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Create dynamic achievements based on user data
  const dynamicAchievements = [
    {
      id: 'first_entry',
      title: 'Getting Started',
      description: 'Log your first carbon footprint entry',
      icon_name: 'Leaf',
      level: 1,
      points: 10,
      earned: (summaries && summaries.length > 0),
      progress: summaries && summaries.length > 0 ? 100 : 0,
      category: 'general',
      earned_at: summaries && summaries.length > 0 ? summaries[0].created_at : null
    },
    {
      id: 'week_streak',
      title: 'Weekly Warrior',
      description: 'Log entries for 7 consecutive days',
      icon_name: 'Calendar',
      level: 2,
      points: 50,
      earned: (profile?.consecutive_days || 0) >= 7,
      progress: Math.min(100, ((profile?.consecutive_days || 0) / 7) * 100),
      category: 'streak',
      earned_at: (profile?.consecutive_days || 0) >= 7 ? new Date().toISOString() : null
    },
    {
      id: 'transport_reducer',
      title: 'Transport Hero',
      description: 'Reduce transportation emissions by 50kg',
      icon_name: 'Car',
      level: 2,
      points: 75,
      earned: (profile?.transportation_reductions || 0) >= 50,
      progress: Math.min(100, ((profile?.transportation_reductions || 0) / 50) * 100),
      category: 'transportation',
      earned_at: (profile?.transportation_reductions || 0) >= 50 ? new Date().toISOString() : null
    },
    {
      id: 'energy_saver',
      title: 'Energy Master',
      description: 'Reduce energy emissions by 100kg',
      icon_name: 'Zap',
      level: 3,
      points: 100,
      earned: (profile?.energy_savings || 0) >= 100,
      progress: Math.min(100, ((profile?.energy_savings || 0) / 100) * 100),
      category: 'energy',
      earned_at: (profile?.energy_savings || 0) >= 100 ? new Date().toISOString() : null
    },
    {
      id: 'month_streak',
      title: 'Monthly Champion',
      description: 'Log entries for 30 consecutive days',
      icon_name: 'Trophy',
      level: 4,
      points: 200,
      earned: (profile?.consecutive_days || 0) >= 30,
      progress: Math.min(100, ((profile?.consecutive_days || 0) / 30) * 100),
      category: 'streak',
      earned_at: (profile?.consecutive_days || 0) >= 30 ? new Date().toISOString() : null
    },
    {
      id: 'eco_warrior',
      title: 'Eco Warrior',
      description: 'Reach 1000 eco points',
      icon_name: 'Star',
      level: 5,
      points: 500,
      earned: (profile?.eco_points || 0) >= 1000,
      progress: Math.min(100, ((profile?.eco_points || 0) / 1000) * 100),
      category: 'points',
      earned_at: (profile?.eco_points || 0) >= 1000 ? new Date().toISOString() : null
    }
  ];

  // Combine with database achievements if they exist
  const allAchievements = definitions ?
    [...dynamicAchievements, ...definitions.map(def => ({
      ...def,
      earned: achievements?.some(a => a.achievement_id === def.achievement_id) || false,
      progress: calculateProgress(def, profile, achievements),
      earned_at: achievements?.find(a => a.achievement_id === def.achievement_id)?.earned_at
    }))] :
    dynamicAchievements;

  // Sort by level and then by earned status
  const sortedAchievements = allAchievements.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.earned !== b.earned) return b.earned ? 1 : -1;
    return b.points - a.points;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icons.Award className="h-5 w-5 text-yellow-500" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>
          Complete eco-friendly actions to unlock achievements. You have {profile?.eco_points || 0} eco points!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAchievements.map((achievement, index) => {
            const Icon = (Icons as any)[achievement.icon_name] || Icons.Award;
            return (
              <div
                key={achievement.id || index}
                className={cn(
                  "flex items-start p-4 border rounded-lg transition-all duration-200",
                  achievement.earned
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 opacity-80"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full w-12 h-12 mr-4 flex-shrink-0",
                  achievement.earned ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-xs text-gray-500">Level {achievement.level} • {achievement.points} points</p>
                    </div>
                    {achievement.earned && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                  {/* Progress bar */}
                  {!achievement.earned && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-ecoPrimary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, achievement.progress)}%` }}
                      />
                    </div>
                  )}

                  {!achievement.earned && (
                    <p className="text-xs text-gray-500">
                      Progress: {achievement.progress.toFixed(0)}%
                    </p>
                  )}

                  {achievement.earned && achievement.earned_at && (
                    <p className="text-xs text-green-600">
                      Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate achievement progress
function calculateProgress(
  definition: AchievementDefinition,
  profile: any,
  achievements: any[]
): number {
  if (!profile) return 0;

  switch (definition.requirements?.type) {
    case 'single':
      if (!definition.requirements.metric || !definition.requirements.threshold) return 0;
      const currentValue = profile[definition.requirements.metric] || 0;
      return Math.min(100, (currentValue / definition.requirements.threshold) * 100);

    case 'multiple':
      if (!definition.requirements.requirements) return 0;
      const progressValues = definition.requirements.requirements.map(req => {
        const value = profile[req.metric] || 0;
        return Math.min(100, (value / req.threshold) * 100);
      });
      return progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;

    case 'achievements':
      if (!definition.requirements.required) return 0;
      const earnedCount = definition.requirements.required.filter(id =>
        achievements?.some(a => a.achievement_id === id)
      ).length;
      return (earnedCount / definition.requirements.required.length) * 100;

    default:
      return 0;
  }
}
