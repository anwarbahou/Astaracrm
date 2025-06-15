
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
import { useTranslation } from "react-i18next";
import { navigationItems } from "@/data/navigationData";

export function TopNavigation() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount] = useState(3); // Mock unread count
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') {
      return t('app.topNav.pageTitle.dashboard');
    }

    const currentNavItem = navigationItems
      .filter(item => item.path !== '/' && path.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0];

    if (currentNavItem) {
      const key = `app.topNav.pageTitle.${currentNavItem.labelKey}`;
      if (i18n.exists(key)) {
        return t(key);
      }
    }
    
    return t("app.topNav.pageTitle.fallback");
  };

  const getPageDescription = () => {
    const path = location.pathname;

    if (path === '/') {
      return t('app.topNav.pageDescription.dashboard');
    }

    const currentNavItem = navigationItems
      .filter(item => item.path !== '/' && path.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0];

    if (currentNavItem) {
      const key = `app.topNav.pageDescription.${currentNavItem.labelKey}`;
      if (i18n.exists(key)) {
        return t(key);
      }
    }

    return "";
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-sm"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 rtl:right-3 rtl:left-auto" />
                <Input
                  placeholder={t("app.topNav.searchPlaceholder")}
                  className="pl-10 w-80 border-border/50 focus:border-primary/50 transition-all duration-200 focus:shadow-md rtl:pr-10 rtl:pl-4"
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
                  aria-label={t('app.topNav.notifications.ariaLabel')}
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
                  className="gap-2 shadow-md hover:shadow-lg transition-shadow duration-200" 
                  onClick={() => setQuickAddOpen(true)}
                >
                  <Plus size={16} />
                  {t('app.topNav.quickAdd')}
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
                      aria-label={t('app.topNav.userMenu.ariaLabel')}
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
                      <p className="text-sm font-medium">{t('app.topNav.userMenu.name')}</p>
                      <p className="text-xs text-muted-foreground">{t('app.topNav.userMenu.email')}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1">
                      <User className="mr-2 h-4 w-4" />
                      {t('app.topNav.userMenu.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1">
                      {t('app.topNav.userMenu.settings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-destructive/10 text-destructive focus:text-destructive transition-colors duration-200 rounded-lg mx-1">
                      {t('app.topNav.userMenu.signOut')}
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      <NotificationSidebar open={notificationOpen} onOpenChange={setNotificationOpen} />
    </>
  );
}
