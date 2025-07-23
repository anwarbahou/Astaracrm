import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Loader2, RefreshCw } from "lucide-react";
import { createAvatar } from '@dicebear/core';
import * as micah from '@dicebear/micah';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserRole = 'admin' | 'manager' | 'team_leader' | 'user';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function AddUserModal({ open, onOpenChange, onUserCreated }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString());
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "user" as UserRole,
    password: "",
  });
  const { toast } = useToast();

  const avatarSvg = useMemo(() => {
    return createAvatar(micah, {
      seed: avatarSeed,
      radius: 50,
    }).toString();
  }, [avatarSeed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload avatar to Supabase Storage
      const avatarFileName = `public/${Date.now()}_${Math.random().toString(36).substring(2)}.svg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(avatarFileName, avatarSvg, {
          contentType: 'image/svg+xml',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL of the avatar
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);

      const avatarUrl = publicUrlData.publicUrl;

      // 3. Call the Edge Function to create the user
      const payload = { ...formData, avatarUrl };
      if (!payload.lastName) delete payload.lastName;
      // Get the current user's access token
      let accessToken = undefined;
      if (supabase.auth.getSession) {
        const sessionResult = await supabase.auth.getSession();
        accessToken = sessionResult.data.session?.access_token;
      }
      // Use fetch directly for more control over error handling
      const res = await fetch('https://purgvbzgbdinporjahra.functions.supabase.co/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      let responseJson: any = {};
      try {
        responseJson = await res.json();
      } catch (e) {
        // If response is not JSON, treat as error
        throw new Error('Invalid server response. Please try again.');
      }
      if (!res.ok) {
        let errorMsg = responseJson.error || 'An error occurred while creating the user.';
        if (
          typeof errorMsg === 'string' &&
          (errorMsg.toLowerCase().includes('email') ||
           errorMsg.toLowerCase().includes('already in use') ||
           errorMsg.toLowerCase().includes('duplicate'))
        ) {
          errorMsg = 'This email is already in use. Please use a different email.';
        }
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Success',
        description: 'User has been created successfully',
      });
      onOpenChange(false); // Close the modal immediately after success toast
      // Call the callback to refresh the users list
      onUserCreated?.();
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        password: '',
      });
      setAvatarSeed(Math.random().toString());
    } catch (error: any) {
      // Only show error toast if we are sure the user was not created
      if (error?.message && error.message.toLowerCase().includes('already in use')) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Log unexpected errors for debugging, but do not show a toast if creation succeeded
        console.error('Unexpected error during user creation:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. They will receive an email to set their password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAvatarSeed(Math.random().toString())}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name (optional)</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  // No required attribute here
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 