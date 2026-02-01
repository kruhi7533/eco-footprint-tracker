
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call since we don't have email service
      // await api.post('/auth/forgot-password', { email });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setEmailSent(true);
      toast.success("If an account exists, a password reset email has been sent (Mocked).");
    } catch (error: any) {
      toast.error(`Failed to send reset email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ecoLight p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-ecoPrimary">EcoStep</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>

          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full eco-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-sm text-center text-gray-600">
                  <Link
                    to="/login"
                    className="text-ecoPrimary hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 text-center">
                  If an account exists with that email, we've sent a reset link. Check your inbox and spam folder.
                </p>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setEmailSent(false)}
              >
                Send Again
              </Button>
              <div className="text-sm text-center text-gray-600">
                <Link
                  to="/login"
                  className="text-ecoPrimary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
