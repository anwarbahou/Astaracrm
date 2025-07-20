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
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 space-y-4 sm:space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                User Management
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage user accounts, roles, and permissions
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsAddUserModalOpen(true)} 
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background text-sm sm:text-base"
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
