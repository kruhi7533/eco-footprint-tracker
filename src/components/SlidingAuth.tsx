import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Leaf, ArrowRight, ArrowLeft, User, Mail, Lock } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const SlidingAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success("Account created successfully! Please check your email to verify your account.");
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        await signIn(email, password);
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ecoLight via-white to-green-50 p-4 overflow-hidden dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Switcher - positioned at top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-4xl relative">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-ecoPrimary rounded-full shadow-glow">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-ecoPrimary mb-2 gradient-text">EcoStep</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isSignUp ? "Join the movement for a greener future" : "Track your carbon footprint"}
          </p>
        </div>
        
        {/* Sliding Card Container */}
        <div className="relative">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90">
            <CardContent className="p-0">
              {/* Background sliding panels */}
              <div className="relative h-[600px]">
                {/* Login Background Panel */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br from-ecoPrimary to-ecoSecondary transition-transform duration-700 ease-in-out ${
                    isSignUp ? "translate-x-full" : "translate-x-0"
                  }`}
                >
                  <div className="flex items-center justify-center h-full text-white p-8">
                    <div className="text-center max-w-md">
                      <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
                      <p className="text-white/90 mb-6">
                        Continue your eco-journey and track your carbon footprint reduction.
                      </p>
                      <div className="space-y-3 text-sm text-white/80">
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Track daily emissions
                        </div>
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          View progress reports
                        </div>
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Earn eco points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signup Background Panel */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br from-ecoAccent to-ecoForest transition-transform duration-700 ease-in-out ${
                    isSignUp ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="flex items-center justify-center h-full text-white p-8">
                    <div className="text-center max-w-md">
                      <h3 className="text-3xl font-bold mb-4">Start Your Journey!</h3>
                      <p className="text-white/90 mb-6">
                        Join thousands of users making a positive impact on the environment.
                      </p>
                      <div className="space-y-3 text-sm text-white/80">
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Monitor your carbon footprint
                        </div>
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Get personalized tips
                        </div>
                        <div className="flex items-center justify-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Make a difference
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forms Container */}
                <div 
                  className={`relative z-10 flex transition-transform duration-700 ease-in-out h-full ${
                    isSignUp ? "-translate-x-1/2" : "translate-x-0"
                  }`}
                  style={{ width: "200%" }}
                >
                  {/* Login Form */}
                  <div className="w-1/2 bg-white dark:bg-gray-800 p-8 flex items-center">
                    <div className="w-full max-w-md mx-auto space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-ecoPrimary">Sign In</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Access your eco dashboard</p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Label>
                          <Input 
                            id="login-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Password
                          </Label>
                          <Input 
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary transition-all duration-200"
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 eco-gradient hover:scale-105 transition-all duration-200" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                      
                      <div className="text-center">
                        <button
                          onClick={toggleMode}
                          className="text-ecoSecondary hover:text-ecoPrimary font-medium transition-colors underline-animated"
                        >
                          New to EcoStep? Create account
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sign Up Form */}
                  <div className="w-1/2 bg-white dark:bg-gray-800 p-8 flex items-center">
                    <div className="w-full max-w-md mx-auto space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-ecoPrimary">Create Account</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Start your sustainability journey</p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                          </Label>
                          <Input 
                            id="signup-name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Label>
                          <Input 
                            id="signup-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Password
                          </Label>
                          <Input 
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary transition-all duration-200"
                            minLength={6}
                            required
                          />
                          <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 eco-gradient hover:scale-105 transition-all duration-200" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                      
                      <div className="text-center">
                        <button
                          onClick={toggleMode}
                          className="text-ecoSecondary hover:text-ecoPrimary font-medium transition-colors underline-animated flex items-center justify-center"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Already have an account? Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-ecoAccent/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-ecoSecondary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-1/2 -left-10 w-20 h-20 bg-ecoMint/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/4 -right-8 w-16 h-16 bg-ecoForest/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default SlidingAuth;
