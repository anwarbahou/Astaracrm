
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { buttonVariants, fadeVariants, springConfig } from "@/lib/animations";

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
      <motion.header 
        className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex h-16 items-center px-6 gap-4">
          <div className="flex-1 flex items-center justify-between">
            <motion.div 
              key={location.pathname}
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <motion.h1 
                className="text-xl font-semibold text-foreground"
                layoutId="pageTitle"
              >
                {getPageTitle()}
              </motion.h1>
              <AnimatePresence mode="wait">
                {getPageDescription() && (
                  <motion.p 
                    key={getPageDescription()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-muted-foreground"
                  >
                    {getPageDescription()}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Enhanced Search Bar */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={springConfig}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 crm-input border-border/50 focus:border-primary/50 transition-all duration-200 focus:shadow-md"
                />
              </motion.div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Enhanced Notifications with animated bell */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9 hover:bg-muted/50 transition-colors duration-200 rounded-xl"
                  onClick={() => setNotificationOpen(true)}
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 transition-transform duration-200" />
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={springConfig}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 p-0 text-xs bg-red-500 text-white border-0 flex items-center justify-center">
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {notificationCount}
                          </motion.span>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  size="sm" 
                  className="gap-2 crm-button-primary shadow-md hover:shadow-lg transition-shadow duration-200" 
                  onClick={() => setQuickAddOpen(true)}
                >
                  <Plus size={16} />
                  Quick Add
                </Button>
              </motion.div>
              
              {/* Enhanced User Menu with Profile Image */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
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
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-popover border border-border shadow-xl rounded-xl z-50" 
                  align="end" 
                  forceMount
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">john@wolfhunt.com</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-destructive/10 text-destructive focus:text-destructive transition-colors duration-200 rounded-lg mx-1">
                      Sign out
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Modals and Sidebars */}
      <AnimatePresence>
        {quickAddOpen && (
          <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
        )}
        {notificationOpen && (
          <NotificationSidebar open={notificationOpen} onOpenChange={setNotificationOpen} />
        )}
      </AnimatePresence>
    </>
  );
}
