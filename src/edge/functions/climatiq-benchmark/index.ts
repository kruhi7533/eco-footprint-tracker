import { createClient } from '@supabase/supabase-js';
import { createClient as createClimatiqClient } from '@climatiq/climatiq-api-client';
import { createRequestHandler } from '@remix-run/cloudflare';

// Initialize Supabase client for edge runtime
const supabaseUrl = 'https://uqvxekfividzcohphwqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdnhla2ZpdmlkemNvaHBod3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTY1NDYsImV4cCI6MjA2MjczMjU0Nn0.n2MBghl3RiifE8RSMoQdWgyiK-90PYvt3hb1Km8hOss';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Climatiq client
const climatiq = createClimatiqClient({
  apiKey: process.env.CLIMATIQ_API_KEY,
});

// Define benchmark data interface
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

// Get user's location data
async function getUserLocation(userId: string): Promise<{ country: string; region: string }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('country, region')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting user location:', error);
    throw new Error('Failed to get user location');
  }
  
  if (!data?.country || !data?.region) {
    throw new Error('User location data is incomplete');
  }

  return data;
}

// Get benchmark data from Climatiq
async function fetchBenchmarkData(location: { country: string; region: string }): Promise<BenchmarkData> {
  try {
    // Mock benchmark data for now (replace with actual API calls when Climatiq API is available)
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
  } catch (error) {
    console.error('Error fetching benchmark data:', error);
    throw error;
  }
}

// Main handler
export async function handler(request: Request): Promise<Response> {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession(token);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user location
    const location = await getUserLocation(session.user.id);
    
    // Fetch benchmark data
    const benchmarkData = await fetchBenchmarkData(location);
    
    return new Response(JSON.stringify(benchmarkData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in benchmark function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
