import { useQuery } from '@tanstack/react-query';
import { getLiveBenchmarkData } from '@/lib/api';

interface BenchmarkData {
  global: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  country: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  regional: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  lastUpdated: string;
}

export function useLiveBenchmarkData() {
  return useQuery({
    queryKey: ['live-benchmark-data'],
    queryFn: async (): Promise<BenchmarkData> => {
      console.log('Fetching live benchmark data...');

      try {
        const data = await getLiveBenchmarkData();
        return data as BenchmarkData;
      } catch (err) {
        console.error('Error in benchmark data fetch:', err);
        return getDefaultBenchmarkData();
      }
    },
    retry: false,
  });
}

// Default benchmark data for fallback
function getDefaultBenchmarkData(): BenchmarkData {
  return {
    global: {
      electricity: 2.5,
      transportation: 4.0,
      heating: 1.5,
      average_daily: 8.0
    },
    country: {
      electricity: 2.0,
      transportation: 3.5,
      heating: 1.2,
      average_daily: 6.7
    },
    regional: {
      electricity: 1.8,
      transportation: 3.0,
      heating: 1.0,
      average_daily: 5.8
    },
    lastUpdated: new Date().toISOString()
  };
}
