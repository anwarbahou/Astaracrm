import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, User, Crown, Mail, Calendar, Trash2, Edit, RefreshCw, Upload, X } from 'lucide-react';
import { Dialog as EmailDialog, DialogContent as EmailDialogContent, DialogHeader as EmailDialogHeader, DialogFooter as EmailDialogFooter, DialogTitle as EmailDialogTitle, DialogDescription as EmailDialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
// Dialog components
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Dialog as EditDialog, DialogContent as EditDialogContent, DialogHeader as EditDialogHeader, DialogFooter as EditDialogFooter, DialogTitle as EditDialogTitle, DialogDescription as EditDialogDescription } from "@/components/ui/dialog";
import { createAvatar } from '@dicebear/core';
import * as micah from '@dicebear/micah';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';

type UserRole = 'admin' | 'manager' | 'team_leader' | 'user';
type UserProfile = Database['public']['Tables']['users']['Row'];

interface UserRoleManagerProps {
  searchQuery?: string;
}

const getRoleIcon = (role: UserRole | null) => {
  switch (role) {
    case 'admin':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'manager':
      return <Shield className="h-4 w-4 text-blue-500" />;
    case 'team_leader':
      return <Shield className="h-4 w-4 text-green-500" />;
    case 'user':
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
};

const getRoleColor = (role: UserRole | null) => {
  switch (role) {
    case 'admin':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    case 'manager':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    case 'team_leader':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    case 'user':
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  }
};

export const UserRoleManager: React.FC<UserRoleManagerProps> = ({ searchQuery = "" }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', avatar_url: '', role: 'user' as UserRole });
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString());
  const [savingEdit, setSavingEdit] = useState(false);
  const { updateUserRole, isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState<UserProfile | null>(null);
  const [emailType, setEmailType] = useState('welcome');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [includeHtml, setIncludeHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState('<p><strong>Hi</strong>,<br>Welcome to <span style="color:#2e7d32">Skultix</span>!</p>');

  const avatarSvg = useMemo(() => {
    return createAvatar(micah, {
      seed: avatarSeed,
      radius: 50,
    }).toString();
  }, [avatarSeed]);

  useEffect(() => {
    if (emailType !== 'custom') setCustomEmail('');
  }, [emailType, emailTarget]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, avatar_url, created_at, updated_at, last_login_at, phone, preferences, status, timezone')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match UserProfile type
      const transformedData = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at || null,
        phone: user.phone || null,
        preferences: user.preferences || null,
        status: user.status || 'active',
        timezone: user.timezone || null
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    
    try {
      const { error } = await updateUserRole(userId, newRole);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive",
        });
        return;
      }

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      // Get the current user's access token (if needed for auth)
      let accessToken = undefined;
      const sessionResult = await supabase.auth.getSession();
      accessToken = sessionResult.data.session?.access_token;
      // Call the edge function to delete user from both Auth and users table
      const res = await fetch('https://purgvbzgbdinporjahra.functions.supabase.co/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ userId }),
      });
      let responseJson: any = {};
      try {
        responseJson = await res.json();
      } catch (e) {
        throw new Error('Invalid server response. Please try again.');
      }
      if (!res.ok) {
        toast({
          title: 'Error',
          description: responseJson.error || 'Failed to delete user.',
          variant: 'destructive',
        });
        return;
      }
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      console.error('[DeleteUser] Exception:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user: ' + (error instanceof Error ? error.message : String(error)),
        variant: 'destructive',
      });
    } finally {
      setDeletingUserId(null);
      setConfirmDialogOpen(false);
      setPendingDeleteUser(null);
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      avatar_url: user.avatar_url || '',
      role: user.role || 'user',
    });
    setAvatarSeed(Math.random().toString());
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setEditForm(prev => ({ ...prev, role: value }));
  };

  const handleAvatarUpload = async () => {
    // Upload the SVG avatar to Supabase Storage
    const avatarFileName = `public/${Date.now()}_${Math.random().toString(36).substring(2)}.svg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarFileName, avatarSvg, {
        contentType: 'image/svg+xml',
        upsert: false,
      });
    if (uploadError) {
      toast({ title: 'Error', description: uploadError.message, variant: 'destructive' });
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);
    setEditForm(prev => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
    toast({ title: 'Success', description: 'Avatar updated!' });
  };

  const handleNewAvatar = async () => {
    // Generate a new avatar SVG
    const newSeed = Math.random().toString();
    setAvatarSeed(newSeed);
    const newAvatarSvg = createAvatar(micah, { seed: newSeed, radius: 50 }).toString();
    // Upload the new avatar SVG to Supabase Storage
    const avatarFileName = `public/${Date.now()}_${Math.random().toString(36).substring(2)}.svg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarFileName, newAvatarSvg, {
        contentType: 'image/svg+xml',
        upsert: false,
      });
    if (uploadError) {
      toast({ title: 'Error', description: uploadError.message, variant: 'destructive' });
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);
    setEditForm(prev => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
    toast({ title: 'Success', description: 'Avatar updated!' });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      let accessToken = undefined;
      const sessionResult = await supabase.auth.getSession();
      accessToken = sessionResult.data.session?.access_token;
      const payload: any = {
        userId: editingUser.id,
        firstName: editForm.firstName,
        email: editForm.email,
        role: editForm.role,
        avatarUrl: editForm.avatar_url,
      };
      if (editForm.lastName) payload.lastName = editForm.lastName;
      const res = await fetch('https://purgvbzgbdinporjahra.functions.supabase.co/update-user', {
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
        throw new Error('Invalid server response. Please try again.');
      }
      if (!res.ok) {
        toast({
          title: 'Error',
          description: responseJson.error || 'Failed to update user.',
          variant: 'destructive',
        });
        return;
      }
      // Update user in local state
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        email: editForm.email,
        avatar_url: editForm.avatar_url,
        role: editForm.role,
      } : u));
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user: ' + (error instanceof Error ? error.message : String(error)),
        variant: 'destructive',
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const openEmailDialog = (user: UserProfile) => {
    setEmailTarget(user);
    setEmailType('welcome');
    setEmailDialogOpen(true);
  };
  // Add your anon key here or import from env
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '<YOUR_ANON_KEY_HERE>';

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      const res = await fetch('https://purgvbzgbdinporjahra.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }),
        body: JSON.stringify({
          to: emailTarget.email,
          subject:
            emailType === 'welcome'
              ? 'Welcome to Skultix!'
              : emailType === 'reset'
              ? 'Reset Your Password'
              : emailType === 'promo'
              ? 'Exciting News from Skultix'
              : 'A Message from Skultix',
          text: !includeHtml ? (emailType === 'custom' ? customEmail : emailPreviews[emailType]) : undefined,
          html: includeHtml ? htmlContent : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      setEmailDialogOpen(false);
      toast({ title: 'Email sent', description: `A ${emailType} email was sent to ${emailTarget?.email}.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to send email', variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  };
  const emailPreviews = {
    welcome: `Hi ${emailTarget?.first_name || ''},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`,
    reset: `Hi ${emailTarget?.first_name || ''},\n\nClick the link below to reset your password:\n[Reset Password Link]\n\nIf you didn't request this, please ignore this email.`,
    promo: `Hi ${emailTarget?.first_name || ''},\n\nCheck out our latest features and promotions!\n\nBest,\nThe Team`,
    custom: customEmail || `Hi ${emailTarget?.first_name || ''},\n\n[Write your custom message here...]`
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.email.toLowerCase().includes(query) ||
      (user.first_name?.toLowerCase() || '').includes(query) ||
      (user.last_name?.toLowerCase() || '').includes(query) ||
      (user.role?.toLowerCase() || '').includes(query)
    );
  }, [users, searchQuery]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const usersSubscription = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        (payload: any) => {
          
          const processUserData = (data: any): UserProfile => ({
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            avatar_url: data.avatar_url,
            created_at: data.created_at,
            updated_at: data.updated_at || null,
            last_login_at: data.last_login_at || null,
            phone: data.phone || null,
            preferences: data.preferences || null,
            status: data.status || 'active',
            timezone: data.timezone || null
          });

          if (payload.eventType === 'INSERT') {
            setUsers(prev => [processUserData(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(user => 
              user.id === payload.new.id ? processUserData(payload.new) : user
            ));
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(user => user.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          You need admin privileges to manage user roles.
          Please contact your administrator for access.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <User className="h-8 w-8" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          <div onClick={() => openEditDialog(user)}>{user.first_name} {user.last_name}</div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                      {getRoleIcon(user.role)}
                      {user.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role || 'user'}
                        onValueChange={(value: UserRole) => handleRoleUpdate(user.id, value)}
                        disabled={updatingUserId === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="team_leader">Team Leader</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingUserId === user.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                        aria-label="Edit user"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Send email"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => openEmailDialog(user)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {currentUser?.id !== user.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPendingDeleteUser(user);
                            setConfirmDialogOpen(true);
                          }}
                          disabled={deletingUserId === user.id}
                          aria-label="Delete user"
                        >
                          {deletingUserId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-muted-foreground">
            <User className="h-8 w-8" />
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 space-y-4">
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-sm">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-base">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                  {getRoleIcon(user.role)}
                  {user.role || 'user'}
                </Badge>
              </div>

              {/* User Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Select
                  value={user.role || 'user'}
                  onValueChange={(value: UserRole) => handleRoleUpdate(user.id, value)}
                  disabled={updatingUserId === user.id}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="team_leader">Team Leader</SelectItem>
                  </SelectContent>
                </Select>
                {updatingUserId === user.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(user)}
                  aria-label="Edit user"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  aria-label="Send email"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <a href={`mailto:${user.email}`} title="Send Email">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                {currentUser?.id !== user.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setPendingDeleteUser(user);
                      setConfirmDialogOpen(true);
                    }}
                    disabled={deletingUserId === user.id}
                    aria-label="Delete user"
                  >
                    {deletingUserId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {pendingDeleteUser?.first_name || pendingDeleteUser?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDialogOpen(false)} disabled={!!deletingUserId}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => pendingDeleteUser && handleDeleteUser(pendingDeleteUser.id)} disabled={!!deletingUserId}>
              {deletingUserId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditDialogContent>
          <EditDialogHeader>
            <EditDialogTitle>Edit User Profile</EditDialogTitle>
            <EditDialogDescription>Update user details below.</EditDialogDescription>
          </EditDialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={editForm.avatar_url ? editForm.avatar_url : `data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" onClick={handleNewAvatar}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Avatar
              </Button>
              <Button type="button" variant="outline" onClick={handleAvatarUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" value={editForm.email} onChange={handleEditChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input id="firstName" name="firstName" value={editForm.firstName} onChange={handleEditChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last Name (optional)</label>
                <Input id="lastName" name="lastName" value={editForm.lastName} onChange={handleEditChange} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <Select value={editForm.role} onValueChange={handleRoleChange}>
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
          <EditDialogFooter>
            <Button variant="secondary" onClick={() => setEditDialogOpen(false)} disabled={savingEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={savingEdit}>
              {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </EditDialogFooter>
        </EditDialogContent>
      </EditDialog>
      <Sheet open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <SheetContent side="right" className="h-full w-full max-w-full sm:max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col">
          <SheetHeader className="px-4 sm:px-6 py-4 border-b">
            <SheetTitle className="text-lg sm:text-2xl font-bold truncate flex items-center gap-2">
              Send Email to {emailTarget?.first_name} {emailTarget?.last_name}
            </SheetTitle>
            <SheetDescription className="mt-2">Choose the type of email to send. You can preview the message before sending.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            <RadioGroup value={emailType} onValueChange={setEmailType} className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="welcome" /> Welcome Email
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="reset" /> Reset Password
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="promo" /> Promotional
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="custom" /> Custom
              </label>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="include-html" checked={includeHtml} onCheckedChange={checked => setIncludeHtml(!!checked)} />
              <label htmlFor="include-html" className="text-sm">Include HTML and style the email</label>
            </div>
            {includeHtml ? (
              <div>
                <div className="font-semibold text-sm mb-1">HTML Content</div>
                <textarea
                  className="w-full min-h-[120px] max-h-[500px] rounded border p-2 text-sm bg-muted font-mono resize-y"
                  value={htmlContent}
                  onChange={e => setHtmlContent(e.target.value)}
                  style={{ minHeight: 120, maxHeight: 500 }}
                />
                <div className="font-semibold text-sm mb-1 mt-4">HTML Preview</div>
                <div
                  className="rounded-md p-3 text-sm border email-preview bg-background"
                  style={{ minHeight: 120, maxHeight: 300, overflow: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
                />
              </div>
            ) : (
              <div>
                <div className="font-semibold text-sm mb-1">Preview</div>
                <textarea
                  className="w-full min-h-[120px] rounded border p-2 text-sm bg-muted"
                  value={emailType === 'custom' ? customEmail : emailPreviews[emailType]}
                  readOnly={emailType !== 'custom'}
                  onChange={e => emailType === 'custom' && setCustomEmail(e.target.value)}
                  disabled={emailType !== 'custom'}
                />
              </div>
            )}
          </div>
          <SheetFooter className="px-4 sm:px-6 py-4 border-t flex gap-2">
            <Button variant="secondary" onClick={() => setEmailDialogOpen(false)} disabled={sendingEmail}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={sendingEmail} className="bg-green-600 text-white hover:bg-green-700">
              {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Email'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserRoleManager; 