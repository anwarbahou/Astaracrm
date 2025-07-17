import { UserRoleManager } from "@/components/UserRoleManager";
import { withPageTitle } from '@/components/withPageTitle';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { AddUserModal } from "@/components/modals/AddUserModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Users() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <UsersIcon className="h-6 w-6" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddUserModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-background"
              />
            </div>
          </div>
          <UserRoleManager searchQuery={searchQuery} />
        </CardContent>
      </Card>
      <AddUserModal 
        open={isAddUserModalOpen} 
        onOpenChange={setIsAddUserModalOpen}
        onUserCreated={() => {
          // The UserRoleManager has real-time subscriptions that will automatically update
          // but we could add additional logic here if needed
          console.log('User created, UserRoleManager should auto-update via subscription');
        }}
      />
    </div>
  );
}

export default withPageTitle(Users, 'User Management');
