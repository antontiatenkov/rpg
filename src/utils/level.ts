export const LEVEL_TITLES: Record<number, string> = {
  1: 'Новичок',
  2: 'Искатель приключений',
  3: 'Следопыт',
  4: 'Воин рутины',
  5: 'Мастер привычек',
  6: 'Рыцарь дисциплины',
  7: 'Чемпион фокусировки',
  8: 'Повелитель времени',
  9: 'Архимаг продуктивности',
  10: 'Легенда самоконтроля'
}

export function getLevelTitle(level: number): string {
  if (level >= 10) return LEVEL_TITLES[10]
  return LEVEL_TITLES[level] || 'Герой'
}

/**
 * Calculates XP required to progress from `level` to `level + 1`.
 */
export function getXpRequiredForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.35))
}

/**
 * Bonus gold awarded upon reaching `level`.
 */
export function getLevelUpGoldBonus(newLevel: number): number {
  return newLevel * 25
}
