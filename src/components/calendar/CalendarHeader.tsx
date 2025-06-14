
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";

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
