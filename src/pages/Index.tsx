import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { TrackingForm } from "@/components/TrackingForm";
import { Progress } from "@/components/Progress";
import { Achievements } from "@/components/Achievements";
import { Settings } from "@/components/Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="min-h-screen flex bg-ecoLight">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="track" className="mt-0">
            <TrackingForm />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <Progress />
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-0">
            <Achievements />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default Index;
