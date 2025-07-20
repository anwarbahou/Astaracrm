import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, Bell, LogOut, RefreshCw, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QuickAddModal } from "@/components/modals/QuickAddModal";
import { NotificationSidebar } from "./NotificationSidebar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants, springConfig } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SimpleSidebarContent } from "@/components/layout/SimpleSidebarContent";

const getRoleIcon = (role: string | null) => {
  switch (role) {
    case 'admin':
      return '👑';
    case 'manager':
      return '🛡️';
    case 'user':
      return '👤';
    default:
      return '👤';
  }
};

const getRoleColor = (role: string | null) => {
  switch (role) {
    case 'admin':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'manager':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'user':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function TopNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();
  const { 
    user, 
    userProfile, 
    signOut, 
    isAdmin, 
    isManager,
    forceRefresh 
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: t('auth.signOut.error.title'),
          description: t('auth.signOut.error.description'),
          variant: "destructive",
        });
      } else {
        navigate("/login", { replace: true });
        toast({
          title: t('auth.signOut.success.title'),
          description: t('auth.signOut.success.description'),
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: t('auth.signOut.error.title'),
        description: t('auth.signOut.error.description'),
        variant: "destructive",
      });
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    if (userProfile?.first_name) {
      return userProfile.first_name[0].toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };
  
  return (
    <>
      <motion.header 
        className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex h-14 sm:h-16 items-center px-3 sm:px-6 gap-2 sm:gap-4">
          {/* Left side - Theme Toggle, Language Switcher, and Notifications */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Mobile Menu Button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="xl:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted/50 transition-colors duration-200 rounded-xl"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-80 max-w-[85vw] p-0 bg-[#232323] border-[#000000] overflow-hidden"
              >
                  <SimpleSidebarContent />
              </SheetContent>
            </Sheet>
            
            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* Enhanced Notifications with animated bell */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted/50 transition-colors duration-200 rounded-xl"
                onClick={() => setShowNotifications(true)}
                aria-label={t('app.topNav.notifications.ariaLabel')}
              >
                <Bell className="h-4 w-4 transition-transform duration-200" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={springConfig}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs bg-red-500 text-white border-0 flex items-center justify-center">
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {unreadCount}
                        </motion.span>
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Search, User Role Badge, Quick Actions, and User Profile */}
          <div className="flex-1 flex items-center justify-end">
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Enhanced Search Bar - Responsive */}
              <motion.div 
                className="relative hidden sm:block"
                whileHover={{ scale: 1.02 }}
                transition={springConfig}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 rtl:right-3 rtl:left-auto" />
                <Input
                  placeholder={t("app.topNav.searchPlaceholder")}
                  className="pl-10 w-60 lg:w-80 border-border/50 focus:border-primary/50 transition-all duration-200 focus:shadow-md rtl:pr-10 rtl:pl-4 text-sm"
                />
              </motion.div>
              
              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="sm:hidden h-8 w-8 rounded-lg"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {/* User Role Badge - Hidden on small screens */}
              {userProfile?.role && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:block"
                >
                  <Badge className={`${getRoleColor(userProfile.role)} text-xs px-2 py-1 font-medium`}>
                    <span className="mr-1">{getRoleIcon(userProfile.role)}</span>
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </Badge>
                </motion.div>
              )}
              
              {/* Quick Actions - Hidden on mobile */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="hidden sm:block"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 hover:bg-muted/50 transition-colors duration-200 rounded-xl"
                  onClick={() => setShowQuickAdd(true)}
                  aria-label={t('app.topNav.quickAdd.ariaLabel')}
                >
                  <Plus className="h-4 w-4 transition-transform duration-200" />
                </Button>
              </motion.div>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted/50 transition-colors duration-200 p-0"
                      aria-label={t('app.topNav.userMenu.ariaLabel')}
                    >
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage src={userProfile?.avatar_url || ""} />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || ""} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      {userProfile?.role && (
                        <Badge className={`${getRoleColor(userProfile.role)} text-xs w-fit px-1 py-0`}>
                          {userProfile.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Mobile-only items */}
                  <div className="sm:hidden">
                    <DropdownMenuItem onClick={() => setShowQuickAdd(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('app.topNav.quickAdd.label')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                  
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {t('app.topNav.userMenu.profile')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={forceRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('app.topNav.userMenu.refresh')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('app.topNav.userMenu.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <QuickAddModal open={showQuickAdd} onOpenChange={setShowQuickAdd} />
      <NotificationSidebar 
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />
    </>
  );
}
