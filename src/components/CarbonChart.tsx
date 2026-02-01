import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { DailySummary } from "@/lib/api";
import { formatDateForDisplay } from "@/lib/utils";

interface CarbonChartProps {
  carbonData?: DailySummary[];
}

const formatDate = (dateStr: string) => {
  return formatDateForDisplay(dateStr);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm">
        <p className="font-bold">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)} kg CO₂
          </p>
        ))}
        <p className="font-semibold mt-1">
          Total: {payload.reduce((sum: number, item: any) => sum + item.value, 0).toFixed(2)} kg CO₂
        </p>
      </div>
    );
  }
  return null;
};

export function CarbonChart({ carbonData = [] }: CarbonChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Carbon Footprint Breakdown</CardTitle>
        <CardDescription>
          Your daily carbon emissions over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={carbonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${value} kg`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar name="Transportation" dataKey="transportation" stackId="a" fill="#40916C" radius={[0, 0, 0, 0]} />
              <Bar name="Energy" dataKey="energy" stackId="a" fill="#48CAE4" radius={[0, 0, 0, 0]} />
              <Bar name="Diet" dataKey="diet" stackId="a" fill="#B08968" radius={[0, 0, 0, 0]} />
              <Bar name="Waste" dataKey="waste" stackId="a" fill="#6A994E" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
