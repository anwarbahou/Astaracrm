
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  RefreshCw,
  Upload,
  X
} from "lucide-react";
import { googleCalendarService } from "@/services/googleCalendarService";
import { supabase } from "@/integrations/supabase/client";

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewMode: "month" | "week" | "day";
  setViewMode: (mode: "month" | "week" | "day") => void;
  calendarView: "calendar" | "extended";
  setCalendarView: (view: "calendar" | "extended") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  calendarView,
  setCalendarView,
  searchQuery,
  setSearchQuery,
  onNewEvent
}: CalendarHeaderProps) {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const [isConnected, setIsConnected] = useState(googleCalendarService.isAuthenticated());

  // Update connection status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (googleCalendarService.isAuthenticated()) {
        // Validate the token to ensure it's still valid
        const isValid = await googleCalendarService.validateToken();
        setIsConnected(isValid);
      } else {
        setIsConnected(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSyncWithGoogle = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      // Check if Google Client ID is configured
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        toast({
          title: "Configuration Error",
          description: "Google Client ID is not configured. Please check your .env file.",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting Google Calendar sync...');
      console.log('Current user session:', await supabase.auth.getUser());
      
      const result = await googleCalendarService.syncEvents();
      
      if (result.success) {
        // Update connection status after successful sync
        const isValid = await googleCalendarService.validateToken();
        setIsConnected(isValid);
        toast({
          title: "Sync Successful",
          description: result.message,
        });
        // Optionally refresh the calendar data here
      } else {
        console.error('Sync failed:', result.message);
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncToGoogle = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await googleCalendarService.syncToGoogle();
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Error",
        description: "An unexpected error occurred during export",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBidirectionalSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await googleCalendarService.bidirectionalSync();
      
      if (result.success) {
        toast({
          title: "Bidirectional Sync Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Bidirectional Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Bidirectional sync error:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectGoogle = () => {
    googleCalendarService.clearAuth();
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Google Calendar connection removed",
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your meetings, calls, and appointments.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* New Event Button */}
            <Button onClick={onNewEvent} className="gap-2">
              <Plus size={16} />
              New Event
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            {/* Sync/Disconnect Google Button */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleSyncToGoogle}
                  disabled={isSyncing}
                >
                  <Upload size={14} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "Exporting..." : "Export to Google"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleBidirectionalSync}
                  disabled={isSyncing}
                >
                  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "Syncing..." : "Bidirectional Sync"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleDisconnectGoogle}
                >
                  <X size={14} />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleSyncWithGoogle}
                disabled={isSyncing}
              >
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Syncing..." : "Sync with Google"}
              </Button>
            )}
            
            {/* Calendar vs Extended View */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button 
                size="sm" 
                variant={calendarView === "calendar" ? "default" : "ghost"}
                onClick={() => setCalendarView("calendar")}
              >
                <CalendarIcon size={14} className="mr-1" />
                Calendar
              </Button>
              <Button 
                size="sm" 
                variant={calendarView === "extended" ? "default" : "ghost"}
                onClick={() => setCalendarView("extended")}
              >
                Extended
              </Button>
            </div>

            {/* Month/Week/Day View */}
            {calendarView === "calendar" && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button 
                  size="sm" 
                  variant={viewMode === "month" ? "default" : "ghost"}
                  onClick={() => setViewMode("month")}
                >
                  Month
                </Button>
                <Button 
                  size="sm" 
                  variant={viewMode === "week" ? "default" : "ghost"}
                  onClick={() => setViewMode("week")}
                >
                  Week
                </Button>
                <Button 
                  size="sm" 
                  variant={viewMode === "day" ? "default" : "ghost"}
                  onClick={() => setViewMode("day")}
                >
                  Day
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
