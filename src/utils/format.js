/**
 * Форматирование длительности из минут в "Xч Yм"
 * @param {number} minutes - длительность в минутах
 * @returns {string}
 */
export function formatDuration(minutes) {
  if (minutes == null || Number.isNaN(Number(minutes))) return '—'
  const m = Number(minutes)
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h === 0) return `${rem}м`
  if (rem === 0) return `${h}ч`
  return `${h}ч ${rem}м`
}

/**
 * Форматирование рейтинга для отображения (одна цифра после запятой)
 * @param {number} value
 * @returns {string}
 */
export function formatRating(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toFixed(1)
}
