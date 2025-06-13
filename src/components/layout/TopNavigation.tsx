
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { QuickAddModal } from "@/components/modals/QuickAddModal";

export function TopNavigation() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/clients")) return "Client Management";
    if (path === "/contacts") return "Contact Management";
    if (path === "/deals") return "Deal Management";
    if (path === "/tasks") return "Task Management";
    if (path === "/calendar") return "Calendar";
    if (path === "/email") return "Email Center";
    if (path === "/notes") return "Notes";
    if (path === "/reports") return "Reports & Analytics";
    if (path === "/users") return "User Management";
    if (path === "/workflows") return "Workflows";
    if (path === "/activity-logs") return "Activity Logs";
    if (path === "/settings") return "Settings";
    return "WOLFHUNT CRM";
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 gap-4">
          <SidebarTrigger className="-ml-2" />
          
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80"
                />
              </div>
              
              {/* Quick Actions */}
              <Button size="sm" className="gap-2" onClick={() => setQuickAddOpen(true)}>
                <Plus size={16} />
                Quick Add
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </>
  );
}
