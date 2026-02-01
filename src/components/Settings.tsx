import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { api, changePassword, deleteAccount } from "@/lib/api";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

type MeasurementUnit = 'metric' | 'imperial';
type Language = 'en' | 'es' | 'fr';

export function Settings() {
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userName, setUserName] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>('metric');
  const [language, setLanguage] = useState<Language>('en');
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [canRequestReset, setCanRequestReset] = useState(true);
  const [resetCountdown, setResetCountdown] = useState(0);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsUpdating(false);
      setIsChangingPassword(false);
      setIsDeletingAccount(false);
      setCanRequestReset(true);
      setResetCountdown(0);
      if (resetTimer) {
        clearInterval(resetTimer);
      }
    };
  }, [resetTimer]);

  // Profile initialization effect
  useEffect(() => {
    if (!authLoading && profile) {
      setUserName(profile.name || '');
      setMeasurementUnit(profile.measurement_unit as MeasurementUnit || 'metric');
      setLanguage(profile.language || 'en');
      setNotifications(profile.notifications_enabled ?? true);
      setDataSharing(profile.data_sharing_enabled ?? false);
      setIsInitialized(true);
      setIsUpdating(false);
    }
  }, [profile, authLoading]);

  // Dialog close effect
  useEffect(() => {
    if (!isPasswordDialogOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }
  }, [isPasswordDialogOpen]);

  const handleDialogClose = useCallback(() => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordDialogOpen(false);
    toast.dismiss();
  }, []);

  const startResetTimer = useCallback(() => {
    setCanRequestReset(false);
    setResetCountdown(30);

    if (resetTimer) {
      clearInterval(resetTimer);
    }

    const timer = setInterval(() => {
      setResetCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanRequestReset(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setResetTimer(timer);
  }, [resetTimer]);

  const handleForgotPassword = useCallback(async () => {
    try {
      if (!profile?.email) {
        toast.error("No email address found.");
        return;
      }

      if (!canRequestReset) {
        toast.error(`Please wait ${resetCountdown} seconds before requesting another reset.`);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      startResetTimer();
      toast.success("Password reset link sent to your email!");
      handleDialogClose();
    } catch (err: any) {
      console.error('Error sending reset password email:', err);
      toast.error(err.message || 'Failed to send reset password email. Please try again.');
    }
  }, [profile?.email, canRequestReset, resetCountdown, startResetTimer, handleDialogClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    await handleUpdateProfile();
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    if (isUpdating || !profile?.id) {
      return;
    }

    try {
      setIsUpdating(true);

      await api.put('/profile', {
        name: userName.trim(),
        measurement_unit: measurementUnit,
        language: language,
        notifications_enabled: notifications,
        data_sharing_enabled: dataSharing
      });

      await refreshProfile();
      toast.success('Settings updated successfully!');
    } catch (err: any) {
      console.error('Error updating settings:', err);
      toast.error(err.message || 'Failed to update settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, profile?.id, userName, measurementUnit, language, notifications, dataSharing, refreshProfile]);

  const handlePasswordChange = async () => {
    // Dismiss any existing toasts
    toast.dismiss();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    try {
      setIsChangingPassword(true);

      // Call API to change password
      await changePassword({
        currentPassword,
        newPassword
      });

      // API throws error if status is not 200

      // Success - clear everything and close dialog
      handleDialogClose();
      // Wait a brief moment before showing success message to ensure previous toasts are cleared
      setTimeout(() => {
        toast.success("Password updated successfully!");
      }, 100);
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast.error(err.message || 'Failed to update password. Please try again.');
      setIsChangingPassword(false);
    }
  };

  const handleDataDownload = async () => {
    try {
      // Fetch all user data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch carbon entries
      const { data: carbonEntries } = await supabase
        .from('carbon_entries')
        .select('*')
        .eq('user_id', user.id);

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      // Combine all data
      const userData = {
        profile,
        carbonEntries,
        achievements,
        exportDate: new Date().toISOString()
      };

      // Create and download file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ecostep-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success('Your data has been downloaded!');
    } catch (err: any) {
      console.error('Error downloading data:', err);
      toast.error('Failed to download your data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword) {
      toast.error("Please enter your password to confirm deletion");
      return;
    }

    try {
      setIsDeletingAccount(true);

      await deleteAccount({ password: deleteAccountPassword });

      toast.success('Your account has been deleted');
      // Sign out and redirect to home
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error deleting account:', err);
      toast.error(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
      setDeleteAccountPassword('');
    }
  };

  const handleMeasurementUnitChange = useCallback((value: string) => {
    if (value === 'metric' || value === 'imperial') {
      setMeasurementUnit(value as MeasurementUnit);
    }
  }, []);

  if (authLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">Unable to load profile</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your EcoStep experience and manage your account preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage your account details and preferences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label>Password</Label>
                      <Dialog
                        open={isPasswordDialogOpen}
                        onOpenChange={(open) => {
                          if (!open) {
                            handleDialogClose();
                          } else {
                            setIsPasswordDialogOpen(true);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" className="w-full">
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            await handlePasswordChange();
                          }}>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                  id="current-password"
                                  name="current-password"
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  disabled={isChangingPassword}
                                  required
                                  autoComplete="current-password"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                  id="new-password"
                                  name="new-password"
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  disabled={isChangingPassword}
                                  required
                                  minLength={6}
                                  autoComplete="new-password"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                  id="confirm-password"
                                  name="confirm-password"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  disabled={isChangingPassword}
                                  required
                                  autoComplete="new-password"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 mb-6">
                              <Button
                                type="button"
                                variant="link"
                                className="text-sm text-primary hover:text-primary/90 p-0 h-auto font-normal"
                                onClick={handleForgotPassword}
                                disabled={isChangingPassword || !canRequestReset}
                              >
                                Forgot your password?
                              </Button>
                              {!canRequestReset && (
                                <span className="text-sm text-muted-foreground">
                                  Wait {resetCountdown}s to request again
                                </span>
                              )}
                            </div>
                            <DialogFooter className="gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleDialogClose}
                                disabled={isChangingPassword}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                variant="default"
                                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                              >
                                {isChangingPassword ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Updating...</span>
                                  </>
                                ) : (
                                  'Update Password'
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="units">Measurement Units</Label>
                      <Select
                        value={measurementUnit}
                        onValueChange={handleMeasurementUnitChange}
                        disabled={isUpdating}
                      >
                        <SelectTrigger id="units">
                          <SelectValue placeholder="Select measurement system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Metric (kg, kilometers)</SelectItem>
                          <SelectItem value="imperial">Imperial (lbs, miles)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={isUpdating}
                    >
                      <div className="flex items-center justify-center">
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your app experience.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                  </div>
                  <ThemeSwitcher />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates and reminders</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your data and privacy preferences.
                </p>
              </div>

              <div className="space-y-4">
                <TooltipProvider>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Share anonymous usage data</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Switch
                          checked={dataSharing}
                          onCheckedChange={setDataSharing}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Help us improve by sharing anonymous usage data</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full mb-2"
                    onClick={handleDataDownload}
                  >
                    Download My Data
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </p>
                          <div className="pt-3">
                            <Label htmlFor="delete-password">
                              Please enter your password to confirm:
                            </Label>
                            <Input
                              id="delete-password"
                              type="password"
                              value={deleteAccountPassword}
                              onChange={(e) => setDeleteAccountPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="mt-2"
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteAccountPassword('')}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount || !deleteAccountPassword}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}