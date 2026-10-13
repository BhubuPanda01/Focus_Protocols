// Time and Timezone utilities for Asia/Kolkata (IST: UTC+05:30)

export const TIMEZONE = 'Asia/Kolkata';

// Get current date string in Asia/Kolkata YYYY-MM-DD
export function getKolkataDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // e.g. "2026-10-13"
}

// Get current time string in Asia/Kolkata HH:mm
export function getKolkataTimeString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date); // e.g. "22:15"
}

// Calculate days, hours, minutes, seconds to exam
export interface CountdownResult {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function calculateExamCountdown(examDateStr: string = '2027-02-06'): CountdownResult {
  // Target midnight IST on exam date
  const targetDate = new Date(`${examDateStr}T09:00:00+05:30`);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
}

// Format seconds into MM:SS
export function formatMinutesSeconds(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.floor(Math.max(0, seconds) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Parse "HH:mm" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Check if a given time is inside an interval (supports crossing midnight)
export function isTimeInRange(currentHHmm: string, startHHmm: string, endHHmm: string): boolean {
  const current = timeToMinutes(currentHHmm);
  const start = timeToMinutes(startHHmm);
  const end = timeToMinutes(endHHmm);

  if (start <= end) {
    return current >= start && current <= end;
  } else {
    // Crosses midnight, e.g. 23:00 to 06:00
    return current >= start || current <= end;
  }
}

// Check sleep schedule conflict with current time
export function isCurrentlyInSleepWindow(wakeUpTime: string, sleepTime: string): boolean {
  const current = getKolkataTimeString();
  return isTimeInRange(current, sleepTime, wakeUpTime);
}

// Calculate campaign day number (1 to 30) from campaign start date
export function calculateCampaignDayIndex(startDateStr: string, activeDateStr: string): number {
  const start = new Date(`${startDateStr}T00:00:00+05:30`);
  const active = new Date(`${activeDateStr}T00:00:00+05:30`);
  const diffDays = Math.floor((active.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(30, diffDays + 1));
}

// Add minutes to "HH:mm" string
export function addMinutesToTime(timeStr: string, minsToAdd: number): string {
  const total = (timeToMinutes(timeStr) + minsToAdd + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
