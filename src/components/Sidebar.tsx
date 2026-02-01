import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Activity, BarChart2, Cog, Home, LogOut, Medal, PlusCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate("/"); // Navigate to landing page after successful logout
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={cn(
      "bg-ecoPrimary text-white h-screen sticky top-0 flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <Cog className="h-6 w-6 flex-shrink-0" />
        {!isCollapsed && <h1 className="font-bold text-xl">EcoStep</h1>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <Button
          variant={activeTab === "dashboard" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={() => onTabChange("dashboard")}
        >
          <Home className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Dashboard"}
        </Button>
        
        <Button
          variant={activeTab === "track" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={() => onTabChange("track")}
        >
          <PlusCircle className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Track"}
        </Button>
        
        <Button
          variant={activeTab === "progress" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={() => onTabChange("progress")}
        >
          <BarChart2 className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Progress"}
        </Button>
        
        <Button
          variant={activeTab === "achievements" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={() => onTabChange("achievements")}
        >
          <Medal className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Achievements"}
        </Button>
        
        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={() => onTabChange("settings")}
        >
          <Activity className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Settings"}
        </Button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8" key={profile?.avatar_url}>
                <AvatarImage src={profile?.avatar_url || "/images/default-avatar.svg"} alt={profile?.name || "User"} />
                <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{profile?.name}</p>
                  <p className="text-xs opacity-70">Level {profile?.level}</p>
                </div>
              )}
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

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 rounded-full bg-ecoPrimary border border-white/10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? "→" : "←"}
      </Button>
    </div>
  );
} 