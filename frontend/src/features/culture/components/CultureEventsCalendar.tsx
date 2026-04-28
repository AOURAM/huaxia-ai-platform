import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useCultureEvents } from '@/features/culture/hooks/useCultureEvents';
import type { CultureEvent } from '@/types/cultureEvent';

function parseEventDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`);
}

function formatEventMonth(dateValue: string) {
  return new Intl.DateTimeFormat('en', { month: 'short' }).format(parseEventDate(dateValue));
}

function formatEventDay(dateValue: string) {
  return new Intl.DateTimeFormat('en', { day: '2-digit' }).format(parseEventDate(dateValue));
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTag(tag: string) {
  return tag.replace(/_/g, ' ');
}

function getCalendarDays(year: number, monthIndex: number) {
  const firstDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const firstDay = firstDate.getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  const emptyCells = Array.from({ length: mondayOffset }, (_, index) => ({
    key: `empty-${index}`,
    day: null as number | null,
  }));

  const dayCells = Array.from({ length: daysInMonth }, (_, index) => ({
    key: `day-${index + 1}`,
    day: index + 1,
  }));

  return [...emptyCells, ...dayCells];
}

function groupEventsByDay(events: CultureEvent[], year: number, monthIndex: number) {
  const grouped = new Map<number, CultureEvent[]>();

  events.forEach((event) => {
    const eventDate = parseEventDate(event.event_date);

    if (eventDate.getFullYear() !== year || eventDate.getMonth() !== monthIndex) {
      return;
    }

    const day = eventDate.getDate();
    const existingEvents = grouped.get(day) ?? [];

    grouped.set(day, [...existingEvents, event]);
  });

  return grouped;
}

export function CultureEventsCalendar() {
  const { data: events = [], isLoading, isError } = useCultureEvents();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    if (events.length === 0) {
      setSelectedEventId(null);
      return;
    }

    const selectedEventExists = events.some((event) => event.id === selectedEventId);

    if (!selectedEventExists) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? events[0] ?? null;

  const displayedDate = selectedEvent ? parseEventDate(selectedEvent.event_date) : new Date();
  const displayedYear = displayedDate.getFullYear();
  const displayedMonthIndex = displayedDate.getMonth();

  const calendarCells = useMemo(
    () => getCalendarDays(displayedYear, displayedMonthIndex),
    [displayedYear, displayedMonthIndex],
  );

  const eventsByDay = useMemo(
    () => groupEventsByDay(events, displayedYear, displayedMonthIndex),
    [events, displayedYear, displayedMonthIndex],
  );

  return (
    <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2 border-b border-brand-outline/40 pb-4">
        <CalendarDays className="h-5 w-5 text-brand-primary" />
        <div>
          <h3 className="font-serif text-xl font-bold text-brand-on-surface">
            Culture event calendar
          </h3>
          <p className="text-xs font-semibold text-brand-on-surface/50">
            Events loaded from the Huaxia backend.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-brand-outline bg-brand-neutral-soft p-4 text-sm font-semibold text-brand-on-surface/60">
          Loading culture events...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
          Could not load culture events. Check the backend server.
        </div>
      ) : null}

      {!isLoading && !isError && events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-outline bg-brand-neutral-soft p-4 text-sm font-semibold text-brand-on-surface/60">
          No culture events found in the backend.
        </div>
      ) : null}

      {!isLoading && !isError && events.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-serif text-lg font-bold text-brand-on-surface">
              {formatMonthTitle(displayedDate)}
            </h4>

            <span className="rounded-full bg-brand-neutral-soft px-3 py-1 text-[11px] font-black uppercase text-brand-primary">
              {events.length} events
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-brand-on-surface/45">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {calendarCells.map((cell) => {
              if (!cell.day) {
                return <div key={cell.key} className="h-9" />;
              }

              const dayEvents = eventsByDay.get(cell.day) ?? [];
              const firstEvent = dayEvents[0];
              const active = Boolean(
                firstEvent && selectedEvent && firstEvent.id === selectedEvent.id,
              );

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => {
                    if (firstEvent) {
                      setSelectedEventId(firstEvent.id);
                    }
                  }}
                  className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                    active
                      ? 'bg-brand-primary text-white shadow-sm'
                      : firstEvent
                        ? 'border border-brand-outline bg-brand-neutral-soft text-brand-primary hover:border-brand-primary'
                        : 'text-brand-on-surface/35 hover:bg-brand-neutral-soft'
                  }`}
                  aria-label={firstEvent ? `Open event ${firstEvent.title}` : `Day ${cell.day}`}
                >
                  {cell.day}

                  {firstEvent ? (
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${
                        active ? 'bg-white' : 'bg-brand-primary'
                      }`}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {selectedEvent ? (
            <div className="mt-5 rounded-xl border border-brand-outline bg-brand-neutral-soft p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-brand-outline bg-white shadow-sm">
                  <span className="text-[10px] font-black uppercase text-brand-primary">
                    {formatEventMonth(selectedEvent.event_date)}
                  </span>
                  <span className="font-serif text-2xl font-bold leading-none text-brand-on-surface">
                    {formatEventDay(selectedEvent.event_date)}
                  </span>
                </div>

                <div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-brand-primary">
                    {formatTag(selectedEvent.tag)}
                  </span>

                  <h4 className="mt-2 text-sm font-bold text-brand-on-surface">
                    {selectedEvent.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-brand-on-surface/55">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                  {selectedEvent.location}
                </p>

                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-brand-primary" />
                  {selectedEvent.start_time}
                </p>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/65">
                {selectedEvent.description}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}