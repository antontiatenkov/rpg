/**
 * Returns logical date in YYYY-MM-DD taking into account user's day reset hour.
 * For example, if resetHour is 4, then 03:00 on Oct 20 belongs to Oct 19.
 */
export function getLogicalDate(date: Date = new Date(), resetHour: number = 0): string {
  const adjusted = new Date(date)
  if (adjusted.getHours() < resetHour) {
    adjusted.setDate(adjusted.getDate() - 1)
  }
  
  const year = adjusted.getFullYear()
  const month = String(adjusted.getMonth() + 1).padStart(2, '0')
  const day = String(adjusted.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns previous day's logical date string
 */
export function getPreviousLogicalDate(logicalDateStr: string): string {
  const [year, month, day] = logicalDateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  d.setDate(d.getDate() - 1)
  
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dt = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dt}`
}

/**
 * Returns difference in days between two YYYY-MM-DD dates (d2 - d1)
 */
export function getDaysDifference(d1: string, d2: string): number {
  const date1 = new Date(d1).getTime()
  const date2 = new Date(d2).getTime()
  return Math.round((date2 - date1) / (1000 * 60 * 60 * 24))
}

/**
 * Human-friendly date formatting in Russian
 */
export function formatDateRu(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Format timestamp into time + date
 */
export function formatDateTimeRu(isoStr: string): string {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
