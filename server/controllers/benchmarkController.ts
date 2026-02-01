import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const defaultBenchmarkData = {
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

const fetchClimatiqData = async (requestBody: any, apiKey: string) => {
    const response = await fetch('https://api.climatiq.io/data/v1/estimate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(`Climatiq API error: ${response.status} ${response.statusText} - ${responseText}`);
    }
    return JSON.parse(responseText);
};

export const getBenchmarkData = async (req: AuthRequest, res: Response) => {
    const apiKey = process.env.CLIMATIQ_API_KEY;

    if (!apiKey) {
        console.warn('CLIMATIQ_API_KEY not found, using defaults');
        return res.json(defaultBenchmarkData);
    }

    try {
        const benchmarkRequests = [
            {
                emission_factor: { activity_id: "electricity-energy_source_grid_mix", region: "US" },
                parameters: { energy: 100, energy_unit: "kWh" }
            },
            {
                emission_factor: { activity_id: "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na" },
                parameters: { distance: 100, distance_unit: "km" }
            },
            {
                emission_factor: { activity_id: "fuel_combustion_natural_gas" },
                parameters: { volume: 100, volume_unit: "m3" }
            }
        ];

        const results = [];
        for (const request of benchmarkRequests) {
            try {
                const result = await fetchClimatiqData(request, apiKey);
                results.push(result);
            } catch (e) {
                console.error("Single benchmark fetch failed", e);
                // Push error object or null to handle gracefully? 
                // Original code returned error for all if one failed.
                results.push({ error: e });
            }
        }

        if (results.some(r => 'error' in r)) {
            console.warn('Some Climatiq requests failed, using defaults');
            return res.json(defaultBenchmarkData);
        }

        // Calculate benchmark averages
        const benchmarkData = {
            global: {
                electricity: results[0]?.co2e ?? null,
                transportation: results[1]?.co2e ?? null,
                heating: results[2]?.co2e ?? null,
                average_daily: (results[0].co2e * 0.1 + results[1].co2e * 0.3 + results[2].co2e * 0.05)
            },
            country: {
                electricity: results[0]?.co2e ? results[0].co2e * 1.1 : null,
                transportation: results[1]?.co2e ? results[1].co2e * 0.95 : null,
                heating: results[2]?.co2e ? results[2].co2e * 1.05 : null,
                average_daily: (results[0].co2e * 0.11 + results[1].co2e * 0.285 + results[2].co2e * 0.0525)
            },
            regional: {
                electricity: results[0]?.co2e ? results[0].co2e * 0.9 : null,
                transportation: results[1]?.co2e ? results[1].co2e * 0.85 : null,
                heating: results[2]?.co2e ? results[2].co2e * 0.95 : null,
                average_daily: (results[0].co2e * 0.09 + results[1].co2e * 0.255 + results[2].co2e * 0.0475)
            },
            lastUpdated: new Date().toISOString()
        };

        res.json(benchmarkData);

    } catch (error: any) {
        console.error('Error fetching benchmark:', error);
        res.json(defaultBenchmarkData); // Fallback to defaults on error
    }
};
