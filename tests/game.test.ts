import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../src/stores/gameStore'
import { getLogicalDate, getPreviousLogicalDate, getDaysDifference } from '../src/utils/date'
import { getXpRequiredForLevel, getLevelUpGoldBonus, getLevelTitle } from '../src/utils/level'

describe('Date & Day Rollover Logic', () => {
  it('handles standard midnight day reset', () => {
    const morning = new Date('2026-10-20T09:00:00')
    expect(getLogicalDate(morning, 0)).toBe('2026-10-20')
  })

  it('handles custom night owl day reset hour (e.g. 04:00 AM)', () => {
    // 03:30 AM on Oct 20 should still belong to Oct 19 when resetHour is 4
    const lateNight = new Date('2026-10-20T03:30:00')
    expect(getLogicalDate(lateNight, 4)).toBe('2026-10-19')

    // 04:05 AM on Oct 20 belongs to Oct 20
    const earlyMorning = new Date('2026-10-20T04:05:00')
    expect(getLogicalDate(earlyMorning, 4)).toBe('2026-10-20')
  })

  it('calculates previous logical date correctly', () => {
    expect(getPreviousLogicalDate('2026-10-20')).toBe('2026-10-19')
    expect(getPreviousLogicalDate('2026-03-01')).toBe('2026-02-28')
    expect(getPreviousLogicalDate('2026-01-01')).toBe('2025-12-31')
  })

  it('calculates days difference correctly', () => {
    expect(getDaysDifference('2026-10-19', '2026-10-20')).toBe(1)
    expect(getDaysDifference('2026-10-15', '2026-10-20')).toBe(5)
  })
})

describe('Level & Progression Formula', () => {
  it('calculates XP progression correctly', () => {
    expect(getXpRequiredForLevel(1)).toBe(100)
    expect(getXpRequiredForLevel(2)).toBeGreaterThan(200)
    expect(getXpRequiredForLevel(3)).toBeGreaterThan(getXpRequiredForLevel(2))
  })

  it('awards level titles and gold bonus', () => {
    expect(getLevelTitle(1)).toBe('Новичок')
    expect(getLevelTitle(2)).toBe('Искатель приключений')
    expect(getLevelUpGoldBonus(2)).toBe(50)
    expect(getLevelUpGoldBonus(3)).toBe(75)
  })
})

describe('Game Store Mechanics', () => {
  let mockStorage: Record<string, string> = {}

  beforeEach(() => {
    mockStorage = {}
    globalThis.localStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => { mockStorage[key] = String(value) },
      removeItem: (key: string) => { delete mockStorage[key] },
      clear: () => { mockStorage = {} },
      length: 0,
      key: () => null
    } as any

    globalThis.window = {
      matchMedia: () => ({ matches: true })
    } as any

    globalThis.document = {
      documentElement: {
        classList: {
          add: () => {},
          remove: () => {}
        }
      }
    } as any

    setActivePinia(createPinia())
  })

  it('starts with level 1 and 0 gold', () => {
    const store = useGameStore()
    store.initApp()
    expect(store.level).toBe(1)
    expect(store.gold).toBe(0)
    expect(store.currentXp).toBe(0)
  })

  it('adds and completes a daily task, updating streak and XP', () => {
    const store = useGameStore()
    store.initApp()

    const task = store.addTask({
      title: 'Утренняя зарядка',
      type: 'daily',
      difficulty: 'easy'
    })

    expect(store.dailyTasks.length).toBe(1)
    expect(task.streak).toBe(0)
    expect(task.completedToday).toBe(false)

    // Complete task
    const res = store.completeTask(task.id)
    expect(res).not.toBeNull()
    expect(res?.xpGained).toBe(15)
    expect(res?.goldGained).toBe(5)

    expect(store.gold).toBe(5)
    expect(store.currentXp).toBe(15)
    expect(task.completedToday).toBe(true)
    expect(task.streak).toBe(1)
    expect(store.longestDailyStreak).toBe(1)

    // Completing again today should do nothing
    const res2 = store.completeTask(task.id)
    expect(res2).toBeNull()
    expect(store.gold).toBe(5)
  })

  it('handles level up when XP crosses threshold', () => {
    const store = useGameStore()
    store.initApp()

    // Add hard quest (+75 XP, +40 gold)
    const q1 = store.addTask({
      title: 'Сложный проект 1',
      type: 'quest',
      difficulty: 'hard'
    })
    const q2 = store.addTask({
      title: 'Сложный проект 2',
      type: 'quest',
      difficulty: 'hard'
    })

    // Level 1 requires 100 XP
    store.completeTask(q1.id)
    expect(store.level).toBe(1)
    expect(store.currentXp).toBe(75)

    // Completing q2 gives another 75 XP -> 150 XP total -> level up to 2!
    // Remaining XP = 150 - 100 = 50 XP
    // Gold = 40 (q1) + 40 (q2) + 50 (level 2 bonus) = 130 gold
    store.completeTask(q2.id)
    expect(store.level).toBe(2)
    expect(store.currentXp).toBe(50)
    expect(store.gold).toBe(130)
    expect(store.levelUpModal.show).toBe(true)
    expect(store.levelUpModal.newLevel).toBe(2)
  })

  it('handles rewards creation and purchase', () => {
    const store = useGameStore()
    store.initApp()

    const reward = store.addReward({
      title: 'Посмотреть фильм',
      cost: 50,
      icon: '🎬'
    })

    expect(store.rewards.length).toBe(1)

    // Cannot afford with 0 gold
    expect(store.redeemReward(reward.id)).toBe(false)

    // Give some gold via tasks
    store.gold = 60
    expect(store.redeemReward(reward.id)).toBe(true)
    expect(store.gold).toBe(10)
    expect(reward.redemptionCount).toBe(1)
    expect(store.redeemedHistory.length).toBe(1)
    expect(store.redeemedHistory[0].rewardTitle).toBe('Посмотреть фильм')
  })

  it('exports and imports backup JSON correctly', () => {
    const store = useGameStore()
    store.initApp()

    store.addTask({ title: 'Привычка A', type: 'daily', difficulty: 'medium' })
    store.addReward({ title: 'Награда B', cost: 100, icon: '☕' })
    store.gold = 250
    store.level = 3

    const json = store.exportData()
    expect(json).toContain('Привычка A')
    expect(json).toContain('Награда B')

    // Reset
    store.resetAllProgress()
    expect(store.level).toBe(1)
    expect(store.tasks.length).toBe(0)

    // Import
    const success = store.importData(json)
    expect(success).toBe(true)
    expect(store.level).toBe(3)
    expect(store.gold).toBe(250)
    expect(store.tasks.length).toBe(1)
    expect(store.rewards.length).toBe(1)
  })
})
