import React, { useState, useEffect } from 'react';
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
import { Database } from '@/integrations/supabase/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, User, Crown } from 'lucide-react';

type UserRole = Database['public']['Enums']['user_role'];
type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole | null;
  status: Database['public']['Enums']['user_status'] | null;
  created_at: string | null;
};

const getRoleIcon = (role: UserRole | null) => {
  switch (role) {
    case 'admin':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'manager':
      return <Shield className="h-4 w-4 text-blue-500" />;
    case 'user':
      return <User className="h-4 w-4 text-gray-500" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
};

const getRoleColor = (role: UserRole | null) => {
  switch (role) {
    case 'admin':
      return 'bg-yellow-100 text-yellow-800';
    case 'manager':
      return 'bg-blue-100 text-blue-800';
    case 'user':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { updateUserRole, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, status, created_at')
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

      setUsers(data || []);
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

      // Update local state
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

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Add real-time subscription for user role changes
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to changes in the users table
    const usersSubscription = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('Users table changed:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Add new user to the list
            setUsers(prev => [payload.new as UserProfile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Update existing user
            setUsers(prev => prev.map(user => 
              user.id === payload.new.id ? payload.new as UserProfile : user
            ));
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted user
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
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-500">You need admin privileges to manage user roles.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Role Management</h2>
        <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email.split('@')[0]
                      }
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{user.email}</TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                    {getRoleIcon(user.role)}
                    {user.role || 'user'}
                  </Badge>
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
                      </SelectContent>
                    </Select>
                    {updatingUserId === user.id && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-500">No users have been created yet.</p>
        </div>
      )}
    </div>
  );
}; 