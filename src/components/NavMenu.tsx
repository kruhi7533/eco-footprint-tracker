import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Activity, BarChart2, Cog, Home, LogOut, Medal, PlusCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface NavMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavMenu({ activeTab, onTabChange }: NavMenuProps) {
  const { profile, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-ecoPrimary text-white sticky top-0 z-50 shadow-md">
      {/* Mobile header */}
      <div className="md:hidden p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cog className="h-5 w-5" />
          <h1 className="font-bold text-lg">EcoStep</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Avatar className="h-8 w-8" key={profile?.avatar_url}>
                <AvatarImage src={profile?.avatar_url || "/images/default-avatar.svg"} alt={profile?.name || "User"} />
                <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <p className="font-medium">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onTabChange("dashboard")}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTabChange("track")}>Track Activity</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTabChange("progress")}>Progress</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTabChange("achievements")}>Achievements</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTabChange("settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600" 
              disabled={isLoggingOut}
              onSelect={handleSignOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop navbar */}
      <div className="hidden md:flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Cog className="h-6 w-6" />
          <h1 className="font-bold text-xl">EcoStep</h1>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="text-white"
            onClick={() => onTabChange("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={activeTab === "track" ? "secondary" : "ghost"}
            className="text-white"
            onClick={() => onTabChange("track")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Track
          </Button>
          
          <Button
            variant={activeTab === "progress" ? "secondary" : "ghost"}
            className="text-white"
            onClick={() => onTabChange("progress")}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Progress
          </Button>
          
          <Button
            variant={activeTab === "achievements" ? "secondary" : "ghost"}
            className="text-white"
            onClick={() => onTabChange("achievements")}
          >
            <Medal className="mr-2 h-4 w-4" />
            Achievements
          </Button>
          
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="text-white"
            onClick={() => onTabChange("settings")}
          >
            <Activity className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs opacity-70">Level {profile?.level}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 rounded-full p-0 border border-white/30">
                <Avatar className="h-8 w-8" key={profile?.avatar_url}>
                  <AvatarImage src={profile?.avatar_url || "/images/default-avatar.svg"} alt={profile?.name || "User"} />
                  <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onTabChange("settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onTabChange("settings")}>
                <Cog className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                disabled={isLoggingOut}
                onSelect={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
