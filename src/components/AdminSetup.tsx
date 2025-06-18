import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const AdminSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAdminExists, setCheckingAdminExists] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();

  // Check if any admin exists
  const checkForExistingAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking for admin:', error);
        return;
      }

      setAdminExists(data && data.length > 0);
    } catch (error) {
      console.error('Error checking for admin:', error);
    } finally {
      setCheckingAdminExists(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to promote to admin",
          variant: "destructive",
        });
        return;
      }

      // Refresh the user profile to get the updated role
      await refreshUserProfile();

      toast({
        title: "Success! 👑",
        description: "You are now an admin! The page will refresh.",
      });

      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast({
        title: "Error",
        description: "Failed to promote to admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkForExistingAdmin();
  }, []);

  if (checkingAdminExists) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Checking system setup...</span>
      </div>
    );
  }

  // Don't show if admin already exists or user is already admin
  if (adminExists || userProfile?.role === 'admin') {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardHeader className="text-center">
          <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-yellow-800">
            Setup Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-yellow-700">
            <p className="mb-2">
              No admin account exists yet. As the first user, you can promote yourself to admin.
            </p>
            <p className="font-medium">
              Current Role: <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {userProfile?.role || 'user'}
              </span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-2">Admin privileges include:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Manage all users and their roles</li>
              <li>• Access system settings</li>
              <li>• View all reports and data</li>
              <li>• Configure workflows and automation</li>
            </ul>
          </div>

          <Button 
            onClick={promoteToAdmin}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Promoting to Admin...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Become Admin
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This option will only appear when no admin exists
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 