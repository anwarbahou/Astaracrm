import { type CreateCalendarEventInput } from "@/services/calendarService";

export interface RecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  count?: number;
  until?: string;
  byDay?: string[];
  byMonth?: number[];
  byMonthDay?: number[];
}

export function parseRecurrenceRule(rule: string): RecurrenceRule | null {
  try {
    const parts = rule.split(';');
    const ruleObj: RecurrenceRule = { freq: 'DAILY' };

    for (const part of parts) {
      const [key, value] = part.split('=');
      switch (key) {
        case 'FREQ':
          ruleObj.freq = value as RecurrenceRule['freq'];
          break;
        case 'INTERVAL':
          ruleObj.interval = parseInt(value);
          break;
        case 'COUNT':
          ruleObj.count = parseInt(value);
          break;
        case 'UNTIL':
          ruleObj.until = value;
          break;
        case 'BYDAY':
          ruleObj.byDay = value.split(',');
          break;
        case 'BYMONTH':
          ruleObj.byMonth = value.split(',').map(v => parseInt(v));
          break;
        case 'BYMONTHDAY':
          ruleObj.byMonthDay = value.split(',').map(v => parseInt(v));
          break;
      }
    }

    return ruleObj;
  } catch (error) {
    console.error('Error parsing recurrence rule:', error);
    return null;
  }
}

export function generateRecurringEvents(
  baseEvent: CreateCalendarEventInput,
  recurrenceRule: string,
  maxOccurrences: number = 52 // Default to 1 year of weekly events
): CreateCalendarEventInput[] {
  const rule = parseRecurrenceRule(recurrenceRule);
  if (!rule) return [baseEvent];

  const events: CreateCalendarEventInput[] = [baseEvent];
  const startDate = new Date(baseEvent.start_time);
  const endDate = new Date(baseEvent.end_time);
  const duration = endDate.getTime() - startDate.getTime();

  let currentDate = new Date(startDate);
  let occurrenceCount = 1;

  while (occurrenceCount < maxOccurrences) {
    // Calculate next occurrence based on frequency
    const nextDate = calculateNextOccurrence(currentDate, rule);
    
    if (!nextDate) break;

    // Check if we've reached the end date
    if (rule.until && new Date(rule.until) < nextDate) break;
    if (rule.count && occurrenceCount >= rule.count) break;

    // Create the recurring event
    const nextEndDate = new Date(nextDate.getTime() + duration);
    
    const recurringEvent: CreateCalendarEventInput = {
      ...baseEvent,
      title: `${baseEvent.title} (Recurring)`,
      start_time: nextDate.toISOString(),
      end_time: nextEndDate.toISOString(),
      is_recurring: true,
      recurrence_rule: recurrenceRule,
    };

    events.push(recurringEvent);
    currentDate = nextDate;
    occurrenceCount++;
  }

  return events;
}

function calculateNextOccurrence(currentDate: Date, rule: RecurrenceRule): Date | null {
  const nextDate = new Date(currentDate);
  const interval = rule.interval || 1;

  switch (rule.freq) {
    case 'DAILY':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    
    case 'WEEKLY':
      nextDate.setDate(nextDate.getDate() + (7 * interval));
      break;
    
    case 'MONTHLY':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    
    case 'YEARLY':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
    
    default:
      return null;
  }

  return nextDate;
}

export function generateSimpleRecurringEvents(
  baseEvent: CreateCalendarEventInput,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
  count: number = 10
): CreateCalendarEventInput[] {
  const events: CreateCalendarEventInput[] = [baseEvent];
  const startDate = new Date(baseEvent.start_time);
  const endDate = new Date(baseEvent.end_time);
  const duration = endDate.getTime() - startDate.getTime();

  let currentDate = new Date(startDate);

  for (let i = 1; i < count; i++) {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    const nextEndDate = new Date(nextDate.getTime() + duration);

    const recurringEvent: CreateCalendarEventInput = {
      ...baseEvent,
      title: baseEvent.title,
      start_time: nextDate.toISOString(),
      end_time: nextEndDate.toISOString(),
      is_recurring: true,
      recurrence_rule: `FREQ=${frequency.toUpperCase()}`,
    };

    events.push(recurringEvent);
    currentDate = nextDate;
  }

  return events;
} 