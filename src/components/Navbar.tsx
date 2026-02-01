import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { profile } = useAuth();
  
  // Get initials from profile name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  console.log('Profile in Navbar:', profile);
  console.log('Avatar URL:', profile?.avatar_url);

  return (
    <nav className="bg-[#2F6B4A] text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="EcoStep" className="w-8 h-8" />
            <span className="text-xl font-bold">EcoStep</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white">
                <Icons.home className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="ghost" className="text-white bg-[#408860]">
                <Icons.track className="w-5 h-5 mr-2" />
                Track
              </Button>
            </Link>
            <Link to="/progress">
              <Button variant="ghost" className="text-white">
                <Icons.progress className="w-5 h-5 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/achievements">
              <Button variant="ghost" className="text-white">
                <Icons.trophy className="w-5 h-5 mr-2" />
                Achievements
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" className="text-white">
                <Icons.settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-medium">{profile?.name || 'User'}</div>
              <div className="text-sm opacity-75">Level {profile?.level || 1}</div>
            </div>
            <Avatar className="border-2 border-white/20" key={profile?.avatar_url}>
              <AvatarImage 
                src={profile?.avatar_url || `/images/default-avatar.svg`} 
                alt={profile?.name || 'User'} 
              />
              <AvatarFallback>{profile?.name ? getInitials(profile.name) : 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}; 