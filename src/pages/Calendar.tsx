
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { EventDetailDrawer } from "@/components/calendar/EventDetailDrawer";
import { ExtendedAgendaView } from "@/components/calendar/ExtendedAgendaView";
import { useCalendar } from "@/hooks/useCalendar";

export default function Calendar() {
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
    handleEventClick,
    handleCreateEvent,
    openNewEventModal,
    closeNewEventModal,
    closeEventDetail,
  } = useCalendar();

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
      <div className="p-6">
        {calendarView === "calendar" ? (
          <CalendarGrid
            currentDate={currentDate}
            viewMode={viewMode}
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        ) : (
          <ExtendedAgendaView
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Modals */}
      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={closeNewEventModal}
        onSave={handleCreateEvent}
      />

      <EventDetailDrawer
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={closeEventDetail}
      />
    </div>
  );
}
