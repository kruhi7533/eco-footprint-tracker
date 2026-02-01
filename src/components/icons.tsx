import {
  Home,
  Timer,
  LineChart,
  Trophy,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  home: Home,
  track: Timer,
  progress: LineChart,
  trophy: Trophy,
  settings: Settings,
} as const; 