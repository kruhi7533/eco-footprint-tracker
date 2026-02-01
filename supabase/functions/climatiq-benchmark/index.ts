import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClimatiqRequest {
  emission_factor: {
    activity_id: string;
    region?: string;
  };
  parameters: {
    [key: string]: number | string;
  };
}

interface ClimatiqResponse {
  co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  emission_factor: {
    activity_id: string;
    region?: string;
  };
}

async function fetchClimatiqData(requestBody: ClimatiqRequest): Promise<ClimatiqResponse | { error: string }> {
  const climatiqApiKey = Deno.env.get('CLIMATIQ_API_KEY');
  
  if (!climatiqApiKey) {
    return { error: 'CLIMATIQ_API_KEY not found in environment variables' };
  }

  // Log the outgoing request
  console.log("Sending payload to Climatiq:", JSON.stringify(requestBody));

  const response = await fetch('https://api.climatiq.io/data/v1/estimate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${climatiqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log("Climatiq raw response:", responseText);

  if (!response.ok) {
    // Return the actual error detail from Climatiq!
    return { error: `Climatiq API error: ${response.status} ${response.statusText} - ${responseText}` };
  }

  return JSON.parse(responseText);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Carefully construct benchmark requests with correct parameters
    const benchmarkRequests: ClimatiqRequest[] = [
      // Global electricity average (see https://www.climatiq.io/explore/electricity-energy_source_grid_mix)
      {
        emission_factor: { activity_id: "electricity-energy_source_grid_mix", region: "US" },
        parameters: { energy: 100, energy_unit: "kWh" }
      },
      // Transportation - average car (see https://www.climatiq.io/explore/passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na)
      {
        emission_factor: { activity_id: "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na" },
        parameters: { distance: 100, distance_unit: "km" }
      },
      // Natural gas for heating (see https://www.climatiq.io/explore/fuel_combustion_natural_gas)
      {
        emission_factor: { activity_id: "fuel_combustion_natural_gas" },
        parameters: { volume: 100, volume_unit: "m3" }
      }
    ];

    // Log the benchmark requests
    console.log("Benchmark requests:", JSON.stringify(benchmarkRequests));

    // Fetch data from Climatiq and log each response
    const results = [];
    for (const req of benchmarkRequests) {
      const res = await fetchClimatiqData(req);
      results.push(res);
    }

    // If any request failed, return the error details
    if (results.some(r => 'error' in r)) {
      return new Response(
        JSON.stringify({ error: "One or more Climatiq requests failed", details: results }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Calculate benchmark averages (these would typically come from larger datasets)
    const benchmarkData = {
      global: {
        electricity: (results[0] as ClimatiqResponse)?.co2e ?? null, // kg CO2e per 100 kWh
        transportation: (results[1] as ClimatiqResponse)?.co2e ?? null, // kg CO2e per 100 km
        heating: (results[2] as ClimatiqResponse)?.co2e ?? null, // kg CO2e per 100 m3
        average_daily: results.every(r => (r as ClimatiqResponse)?.co2e !== undefined)
          ? ((results[0] as ClimatiqResponse).co2e * 0.1 + (results[1] as ClimatiqResponse).co2e * 0.3 + (results[2] as ClimatiqResponse).co2e * 0.05)
          : null,
      },
      country: {
        electricity: (results[0] as ClimatiqResponse)?.co2e ? (results[0] as ClimatiqResponse).co2e * 1.1 : null,
        transportation: (results[1] as ClimatiqResponse)?.co2e ? (results[1] as ClimatiqResponse).co2e * 0.95 : null,
        heating: (results[2] as ClimatiqResponse)?.co2e ? (results[2] as ClimatiqResponse).co2e * 1.05 : null,
        average_daily: results.every(r => (r as ClimatiqResponse)?.co2e !== undefined)
          ? ((results[0] as ClimatiqResponse).co2e * 0.11 + (results[1] as ClimatiqResponse).co2e * 0.285 + (results[2] as ClimatiqResponse).co2e * 0.0525)
          : null,
      },
      regional: {
        electricity: (results[0] as ClimatiqResponse)?.co2e ? (results[0] as ClimatiqResponse).co2e * 0.9 : null,
        transportation: (results[1] as ClimatiqResponse)?.co2e ? (results[1] as ClimatiqResponse).co2e * 0.85 : null,
        heating: (results[2] as ClimatiqResponse)?.co2e ? (results[2] as ClimatiqResponse).co2e * 0.95 : null,
        average_daily: results.every(r => (r as ClimatiqResponse)?.co2e !== undefined)
          ? ((results[0] as ClimatiqResponse).co2e * 0.09 + (results[1] as ClimatiqResponse).co2e * 0.255 + (results[2] as ClimatiqResponse).co2e * 0.0475)
          : null,
      },
      lastUpdated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(benchmarkData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
