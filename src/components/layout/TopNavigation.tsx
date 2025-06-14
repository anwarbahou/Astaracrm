import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { QuickAddModal } from "@/components/modals/QuickAddModal";
import { NotificationSidebar } from "./NotificationSidebar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function TopNavigation() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount] = useState(3); // Mock unread count
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
    if (path === "/ai-leads") return "AI Lead Intelligence";
    return "WOLFHUNT CRM";
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === "/") return "Overview of your CRM performance";
    if (path.startsWith("/clients")) return "Manage your client relationships";
    if (path === "/contacts") return "Keep track of all your contacts";
    if (path === "/deals") return "Monitor your sales pipeline";
    if (path === "/tasks") return "Stay on top of your tasks";
    if (path === "/calendar") return "Schedule and manage appointments";
    if (path === "/email") return "Communicate with your clients";
    if (path === "/notes") return "Capture important information";
    if (path === "/ai-leads") return "Génération de leads MENA et Europe avec IA avancée";
    return "";
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 transition-colors duration-300">
        <div className="flex h-16 items-center px-6 gap-4">
          <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          
          <div className="flex-1 flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
              {getPageDescription() && (
                <p className="text-sm text-muted-foreground mt-0.5">{getPageDescription()}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Enhanced Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 crm-input border-border/50 focus:border-primary/50 transition-colors duration-200"
                />
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Enhanced Notifications with animated bell */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 hover:bg-muted/50 transition-colors duration-200"
                onClick={() => setNotificationOpen(true)}
                aria-label="Notifications"
              >
                <Bell className={`h-4 w-4 transition-transform duration-200 ${notificationCount > 0 ? 'animate-pulse' : ''}`} />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0 flex items-center justify-center animate-bounce">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              
              {/* Quick Actions */}
              <Button 
                size="sm" 
                className="gap-2 crm-button-primary" 
                onClick={() => setQuickAddOpen(true)}
              >
                <Plus size={16} />
                Quick Add
              </Button>
              
              {/* Enhanced User Menu with Profile Image */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-colors duration-200"
                    aria-label="User menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                        alt="John Doe Profile"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-popover border border-border animate-scale-in z-50" 
                  align="end" 
                  forceMount
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@wolfhunt.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-muted/50 text-destructive focus:text-destructive transition-colors duration-200">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Modals and Sidebars */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      <NotificationSidebar open={notificationOpen} onOpenChange={setNotificationOpen} />
    </>
  );
}
