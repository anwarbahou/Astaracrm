import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { NewEventSheet } from "@/components/calendar/NewEventModal";
import { EventDetailSheet } from "@/components/calendar/EventDetailDrawer";
import { EditEventSheet } from "@/components/calendar/EditEventSheet";
import { ExtendedAgendaView } from "@/components/calendar/ExtendedAgendaView";
import { useCalendar } from "@/hooks/useCalendar";
import { withPageTitle } from '@/components/withPageTitle';
import { TableSkeleton } from "@/components/ui/skeleton-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type CreateCalendarEventInput, type CalendarEvent } from "@/services/calendarService";
import { useToast } from "@/hooks/use-toast";
import { calendarService } from "@/services/calendarService";
import { useState } from "react";

function Calendar() {
  const { toast } = useToast();
  const {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    calendarView,
    setCalendarView,
    searchQuery,
    setSearchQuery,
    isNewEventModalOpen,
    selectedEvent,
    isEventDetailOpen,
    filteredEvents,
    isLoading,
    error,
    handleEventClick,
    handleCreateEvent,
    openNewEventModal,
    closeNewEventModal,
    closeEventDetail,
  } = useCalendar();

  // Edit event state
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  const handleSaveEvent = async (eventData: CreateCalendarEventInput) => {
    console.log("Creating event:", eventData);
    try {
      const events = await calendarService.createEvent(eventData);
      toast({
        title: "Event created",
        description: events.length > 1 
          ? `Created ${events.length} recurring events successfully.`
          : "Event created successfully.",
      });
      // Refresh the calendar data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsEditEventOpen(true);
    closeEventDetail();
  };

  const handleUpdateEvent = async (eventId: string, eventData: CreateCalendarEventInput) => {
    try {
      await calendarService.updateEvent(eventId, eventData);
      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
      });
      // Refresh the calendar data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await calendarService.deleteEvent(eventId);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      // Refresh the calendar data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error deleting event",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateEvent = (event: any) => {
    // Create a new event with the same data but different dates
    const newEvent = {
      ...event,
      title: `${event.title} (Copy)`,
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
    };
    handleCreateEvent(newEvent);
  };

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewEvent={openNewEventModal}
      />

      {/* Main Content */}
      <div className="p-2 sm:p-4 md:p-6">
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading calendar events: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {calendarView === "calendar" ? (
          <CalendarGrid
            currentDate={currentDate}
            viewMode={viewMode}
            events={filteredEvents}
            onEventClick={handleEventClick}
            isLoading={isLoading}
          />
        ) : (
          <ExtendedAgendaView
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Sheets and Drawers */}
      <NewEventSheet
        isOpen={isNewEventModalOpen}
        onClose={closeNewEventModal}
        onSave={handleSaveEvent}
      />

      <EventDetailSheet
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={closeEventDetail}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
      />

      <EditEventSheet
        event={eventToEdit}
        isOpen={isEditEventOpen}
        onClose={() => {
          setIsEditEventOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleUpdateEvent}
      />
    </div>
  );
}

export default withPageTitle(Calendar, 'calendar');
