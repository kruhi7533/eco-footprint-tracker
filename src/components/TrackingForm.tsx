
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportForm } from "@/components/tracking/TransportForm";
import { EnergyForm } from "@/components/tracking/EnergyForm";
import { DietForm } from "@/components/tracking/DietForm";
import { WasteForm } from "@/components/tracking/WasteForm";

export function TrackingForm() {
  const [activeTab, setActiveTab] = useState<string>("transport");

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Carbon Footprint</CardTitle>
          <CardDescription>
            Log your daily activities to calculate your carbon emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="diet">Diet</TabsTrigger>
              <TabsTrigger value="waste">Waste</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transport" className="space-y-4">
              <TransportForm />
            </TabsContent>
            
            <TabsContent value="energy" className="space-y-4">
              <EnergyForm />
            </TabsContent>
            
            <TabsContent value="diet" className="space-y-4">
              <DietForm />
            </TabsContent>
            
            <TabsContent value="waste" className="space-y-4">
              <WasteForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground mb-2">
            Track your daily activities to get an accurate carbon footprint calculation.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
