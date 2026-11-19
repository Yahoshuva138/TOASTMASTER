/**
 * Format due date and time cleanly for display across Toastmasters Task Hub.
 * Handles:
 * - '2026-11-20T18:00' -> 'Nov 20, 2026 • 6:00 PM'
 * - '2026-11-20' -> 'Nov 20, 2026'
 * - undefined -> 'Flexible'
 */
export function formatDueDateTime(dateStr?: string): string {
  if (!dateStr) return 'Flexible';

  try {
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const datePart = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const timePart = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return `${datePart} • ${timePart}`;
      }
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Check if a task is overdue taking exact time into account.
 */
export function isTaskOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === 'approved') return false;
  try {
    const due = new Date(dueDate.includes('T') ? dueDate : `${dueDate}T23:59:59`);
    return due.getTime() < Date.now();
  } catch {
    return false;
  }
}
