
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Edit,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock users data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@wolfhunt.com",
      phone: "+1 (555) 123-4567",
      role: "Sales Manager",
      department: "Sales",
      status: "Active",
      lastLogin: "2024-12-15T09:30:00",
      joinDate: "2023-01-15",
      permissions: ["manage_deals", "view_reports", "manage_team"],
      avatar: "JD",
      dealsAssigned: 15,
      dealsWon: 12,
      revenue: 245000
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@wolfhunt.com",
      phone: "+1 (555) 987-6543",
      role: "Sales Representative",
      department: "Sales",
      status: "Active",
      lastLogin: "2024-12-15T10:15:00",
      joinDate: "2023-03-22",
      permissions: ["manage_deals", "view_clients"],
      avatar: "SS",
      dealsAssigned: 12,
      dealsWon: 10,
      revenue: 198000
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@wolfhunt.com",
      phone: "+1 (555) 456-7890",
      role: "Senior Sales Rep",
      department: "Sales",
      status: "Active",
      lastLogin: "2024-12-14T16:45:00",
      joinDate: "2022-08-10",
      permissions: ["manage_deals", "view_clients", "mentor_team"],
      avatar: "MJ",
      dealsAssigned: 10,
      dealsWon: 8,
      revenue: 156000
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@wolfhunt.com",
      phone: "+1 (555) 321-0987",
      role: "Customer Success",
      department: "Support",
      status: "Active",
      lastLogin: "2024-12-15T08:20:00",
      joinDate: "2023-06-05",
      permissions: ["manage_clients", "view_support"],
      avatar: "ED",
      dealsAssigned: 0,
      dealsWon: 0,
      revenue: 0
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@wolfhunt.com",
      phone: "+1 (555) 654-3210",
      role: "Sales Representative",
      department: "Sales",
      status: "Inactive",
      lastLogin: "2024-12-10T14:30:00",
      joinDate: "2023-09-12",
      permissions: ["manage_deals", "view_clients"],
      avatar: "DW",
      dealsAssigned: 6,
      dealsWon: 4,
      revenue: 98000
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@wolfhunt.com",
      phone: "+1 (555) 789-0123",
      role: "Admin",
      department: "IT",
      status: "Active",
      lastLogin: "2024-12-15T11:00:00",
      joinDate: "2022-11-20",
      permissions: ["manage_users", "manage_settings", "view_all", "system_admin"],
      avatar: "LA",
      dealsAssigned: 0,
      dealsWon: 0,
      revenue: 0
    },
    {
      id: 7,
      name: "Robert Brown",
      email: "robert.brown@wolfhunt.com",
      phone: "+1 (555) 246-8135",
      role: "Marketing Manager",
      department: "Marketing",
      status: "Active",
      lastLogin: "2024-12-15T09:45:00",
      joinDate: "2023-02-28",
      permissions: ["manage_campaigns", "view_leads", "view_reports"],
      avatar: "RB",
      dealsAssigned: 0,
      dealsWon: 0,
      revenue: 0
    }
  ];

  const roles = [
    {
      name: "Admin",
      description: "Full system access and user management",
      permissions: ["manage_users", "manage_settings", "view_all", "system_admin"],
      userCount: 1
    },
    {
      name: "Sales Manager",
      description: "Manage sales team and view all sales data",
      permissions: ["manage_deals", "view_reports", "manage_team"],
      userCount: 1
    },
    {
      name: "Sales Representative",
      description: "Manage assigned deals and clients",
      permissions: ["manage_deals", "view_clients"],
      userCount: 3
    },
    {
      name: "Customer Success",
      description: "Manage client relationships and support",
      permissions: ["manage_clients", "view_support"],
      userCount: 1
    },
    {
      name: "Marketing Manager",
      description: "Manage marketing campaigns and leads",
      permissions: ["manage_campaigns", "view_leads", "view_reports"],
      userCount: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Inactive": return "bg-red-500";
      case "Pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-800";
      case "Sales Manager": return "bg-blue-100 text-blue-800";
      case "Sales Representative": return "bg-green-100 text-green-800";
      case "Customer Success": return "bg-orange-100 text-orange-800";
      case "Marketing Manager": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsers = filteredUsers.filter(user => user.status === "Active");
  const salesUsers = filteredUsers.filter(user => user.department === "Sales");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User & Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members, roles, and permissions.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{salesUsers.length}</p>
              <p className="text-sm text-muted-foreground">Sales Team</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{roles.length}</p>
              <p className="text-sm text-muted-foreground">Roles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                      
                      <div>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{user.department}</p>
                      </div>
                      
                      <div className="text-center">
                        <Badge className={`${getStatusColor(user.status)} text-white`}>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last login: {formatLastLogin(user.lastLogin)}
                        </p>
                      </div>
                      
                      {user.department === "Sales" && (
                        <div className="text-center">
                          <p className="font-medium">{user.dealsWon}/{user.dealsAssigned}</p>
                          <p className="text-xs text-muted-foreground">Deals Won</p>
                          <p className="text-xs text-green-600">${(user.revenue / 1000).toFixed(0)}k revenue</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>Joined: {formatDate(user.joinDate)}</p>
                          <p>{user.permissions.length} permissions</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Manage Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            {user.status === "Active" ? (
                              <DropdownMenuItem className="text-red-600">
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Roles & Permissions
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Create Role
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roles.map((role, index) => (
                  <div key={index} className="p-6 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                        <p className="text-muted-foreground">{role.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {role.userCount} user{role.userCount !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit Role
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Duplicate Role</DropdownMenuItem>
                            <DropdownMenuItem>View Users</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete Role</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Permissions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission, permIndex) => (
                          <Badge key={permIndex} variant="secondary">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Sarah Smith", action: "Logged in", time: "5 minutes ago", type: "login" },
                  { user: "John Doe", action: "Created new deal with Acme Corp", time: "1 hour ago", type: "action" },
                  { user: "Lisa Anderson", action: "Added new user: Robert Brown", time: "2 hours ago", type: "admin" },
                  { user: "Mike Johnson", action: "Updated client information", time: "3 hours ago", type: "action" },
                  { user: "Emily Davis", action: "Sent email to support ticket #1234", time: "4 hours ago", type: "action" },
                  { user: "David Wilson", action: "Logged out", time: "1 day ago", type: "logout" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "login" ? "bg-green-500" :
                      activity.type === "logout" ? "bg-red-500" :
                      activity.type === "admin" ? "bg-purple-500" :
                      "bg-blue-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
