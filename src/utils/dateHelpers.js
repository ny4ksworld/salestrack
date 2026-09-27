// Date / time helper utilities

const DISPLAY_LOCALE = 'en-KE';

/**
 * Format a date as "Mon, 14 Jul 2025"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
  }).format(new Date(date));
}

/**
 * Format a date as "24 Sep 2026, 2:35 PM"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Format time only: "09:15"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTime(date) {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

/**
 * Return "YYYY-MM-DD" string for a Date (or today if omitted).
 * Used for date-picker values and comparisons.
 * @param {Date} [date]
 * @returns {string}
 */
export function toDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Check whether an ISO timestamp string falls on the given "YYYY-MM-DD" date.
 * @param {string} timestamp  ISO string
 * @param {string} dateStr    "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isSameDay(timestamp, dateStr) {
  return toDateString(new Date(timestamp)) === dateStr;
}

/**
 * Return a human-friendly relative label: "Today", "Yesterday", or "14 Jul".
 * @param {string|Date} date
 * @returns {string}
 */
export function relativeDay(date) {
  const today = toDateString();
  const d     = new Date(date);
  const ds    = toDateString(d);
  if (ds === today) return 'Today';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (ds === toDateString(yesterday)) return 'Yesterday';

  return new Intl.DateTimeFormat(DISPLAY_LOCALE, { day: 'numeric', month: 'short' }).format(d);
}

/**
 * Get the last N days as "YYYY-MM-DD" strings (most recent first).
 * Useful for building time-series chart axes.
 * @param {number} n
 * @returns {string[]}
 */
export function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return toDateString(d);
  });
}
