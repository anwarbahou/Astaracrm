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

type UserRole = 'admin' | 'manager' | 'user';

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
      console.log('📤 Calling create-user function with:', { ...formData, avatarUrl, password: '[REDACTED]' });
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { ...formData, avatarUrl },
      });
      let errorMsg = error?.message || error?.error || data?.error;

      // Debugging: log error and context
      console.log('Supabase function error:', error);
      if (error?.context) {
        console.log('Supabase function error context:', error.context);
      }

      // Try to extract the error message from the response body if available
      if (
        error &&
        error instanceof FunctionsHttpError &&
        error.context &&
        error.context.response
      ) {
        try {
          // Always read as text
          const errorText = await error.context.response.text();
          let parsedError = errorText;
          if (errorText && errorText.trim().length > 0) {
            try {
              const parsed = JSON.parse(errorText);
              if (parsed && typeof parsed === 'object' && parsed.error) {
                parsedError = parsed.error;
              }
            } catch {
              parsedError = errorText;
            }
          }
          // Force user-friendly message for any 400 error
          if (error.context.response.status === 400) {
            errorMsg = 'This email is already in use. Please use a different email.';
          } else {
            errorMsg = parsedError;
          }
        } catch (e) {
          errorMsg = `HTTP ${error.context.response.status} at ${error.context.response.url}`;
        }
      }

      if (errorMsg) {
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

      // Call the callback to refresh the users list
      onUserCreated?.();

      onOpenChange(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        password: '',
      });
      setAvatarSeed(Math.random().toString());
    } catch (error: any) {
      console.error('🔥 An error occurred during the user creation process:', error);
      let userMessage = error?.message || 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Error',
        description: typeof userMessage === 'string' ? userMessage : JSON.stringify(userMessage, null, 2),
        variant: 'destructive',
      });
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
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
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