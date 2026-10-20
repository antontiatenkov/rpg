import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  GameState, 
  Task, 
  Reward, 
  RedeemedReward, 
  UserSettings, 
  Difficulty, 
  TaskType,
  DayHistory
} from '../types'
import { DIFFICULTY_SETTINGS } from '../types'
import { getLogicalDate, getPreviousLogicalDate } from '../utils/date'
import { getXpRequiredForLevel, getLevelUpGoldBonus, getLevelTitle } from '../utils/level'
import { triggerConfetti, triggerLevelUpConfetti, triggerRewardConfetti } from '../utils/confetti'

const STORAGE_KEY = 'rpg_quest_state_v1'

export const useGameStore = defineStore('game', () => {
  // State
  const level = ref(1)
  const currentXp = ref(0)
  const gold = ref(0)
  const totalXpEarned = ref(0)
  const totalTasksCompleted = ref(0)
  const totalQuestsCompleted = ref(0)
  const totalDailiesCompleted = ref(0)
  const longestDailyStreak = ref(0)
  const lastActiveLogicalDate = ref('')
  
  const settings = ref<UserSettings>({
    dayResetHour: 0,
    theme: 'dark',
    celebrationsEnabled: true
  })
  
  const tasks = ref<Task[]>([])
  const rewards = ref<Reward[]>([])
  const redeemedHistory = ref<RedeemedReward[]>([])
  const history = ref<Record<string, DayHistory>>({})

  // Modal Level Up Notification
  const levelUpModal = ref<{
    show: boolean
    newLevel: number
    levelTitle: string
    goldBonus: number
  }>({
    show: false,
    newLevel: 1,
    levelTitle: '',
    goldBonus: 0
  })

  // Computed
  const xpNeededForNextLevel = computed(() => getXpRequiredForLevel(level.value))
  const xpPercentage = computed(() => {
    const required = xpNeededForNextLevel.value
    if (required <= 0) return 100
    return Math.min(100, Math.round((currentXp.value / required) * 100))
  })
  const currentTitle = computed(() => getLevelTitle(level.value))

  const dailyTasks = computed(() => tasks.value.filter(t => t.type === 'daily'))
  const questTasks = computed(() => tasks.value.filter(t => t.type === 'quest'))
  const activeQuests = computed(() => questTasks.value.filter(t => !t.isCompleted))
  const completedQuests = computed(() => questTasks.value.filter(t => t.isCompleted))

  // Helpers
  function getTodayKey(): string {
    return getLogicalDate(new Date(), settings.value.dayResetHour)
  }

  function ensureHistoryEntry(dateKey: string): DayHistory {
    if (!history.value[dateKey]) {
      history.value[dateKey] = {
        date: dateKey,
        xpGained: 0,
        goldGained: 0,
        tasksCompleted: 0,
        rewardsPurchased: 0
      }
    }
    return history.value[dateKey]
  }

  function saveState() {
    try {
      const stateToSave: GameState = {
        level: level.value,
        currentXp: currentXp.value,
        gold: gold.value,
        totalXpEarned: totalXpEarned.value,
        totalTasksCompleted: totalTasksCompleted.value,
        totalQuestsCompleted: totalQuestsCompleted.value,
        totalDailiesCompleted: totalDailiesCompleted.value,
        longestDailyStreak: longestDailyStreak.value,
        lastActiveLogicalDate: lastActiveLogicalDate.value,
        settings: settings.value,
        tasks: tasks.value,
        rewards: rewards.value,
        redeemedHistory: redeemedHistory.value,
        history: history.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {
      console.error('Failed to save state to localStorage:', e)
    }
  }

  function applyTheme(themeValue: 'dark' | 'light' | 'system') {
    const root = document.documentElement
    if (themeValue === 'dark') {
      root.classList.add('dark')
    } else if (themeValue === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  // Check day rollover and streak persistence
  function checkDayRollover() {
    const currentLogical = getTodayKey()
    const prevLogical = getPreviousLogicalDate(currentLogical)

    if (lastActiveLogicalDate.value !== currentLogical) {
      // It's a new day! Update dailies
      for (const task of tasks.value) {
        if (task.type === 'daily') {
          // If task was completed on previous logical day, streak stays intact!
          // If it was completed before yesterday, the streak is broken
          if (task.lastCompletedDate === prevLogical) {
            // Streak preserved, just ready for today
            task.completedToday = false
          } else if (task.lastCompletedDate === currentLogical) {
            // Already done today in this new session
            task.completedToday = true
          } else {
            // Missed yesterday! Streak breaks
            task.streak = 0
            task.completedToday = false
          }
        }
      }
      lastActiveLogicalDate.value = currentLogical
      saveState()
    }
  }

  function initApp() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const loaded: GameState = JSON.parse(raw)
        level.value = loaded.level ?? 1
        currentXp.value = loaded.currentXp ?? 0
        gold.value = loaded.gold ?? 0
        totalXpEarned.value = loaded.totalXpEarned ?? 0
        totalTasksCompleted.value = loaded.totalTasksCompleted ?? 0
        totalQuestsCompleted.value = loaded.totalQuestsCompleted ?? 0
        totalDailiesCompleted.value = loaded.totalDailiesCompleted ?? 0
        longestDailyStreak.value = loaded.longestDailyStreak ?? 0
        lastActiveLogicalDate.value = loaded.lastActiveLogicalDate ?? ''
        
        if (loaded.settings) {
          settings.value = { ...settings.value, ...loaded.settings }
        }
        tasks.value = loaded.tasks ?? []
        rewards.value = loaded.rewards ?? []
        redeemedHistory.value = loaded.redeemedHistory ?? []
        history.value = loaded.history ?? {}
      }
    } catch (e) {
      console.error('Failed to load saved state:', e)
    }

    applyTheme(settings.value.theme)
    checkDayRollover()
  }

  // Task Actions
  function addTask(params: {
    title: string
    description?: string
    type: TaskType
    difficulty: Difficulty
  }) {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: params.title.trim(),
      description: params.description?.trim(),
      type: params.type,
      difficulty: params.difficulty,
      streak: 0,
      completedToday: false,
      lastCompletedDate: null,
      isCompleted: false,
      createdAt: new Date().toISOString()
    }
    tasks.value.unshift(newTask)
    saveState()
    return newTask
  }

  function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      Object.assign(task, updates)
      saveState()
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveState()
  }

  function completeTask(id: string): { xpGained: number; goldGained: number; leveledUp: boolean } | null {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return null

    if (task.type === 'daily' && task.completedToday) return null
    if (task.type === 'quest' && task.isCompleted) return null

    const diff = DIFFICULTY_SETTINGS[task.difficulty]
    const xpReward = diff.xp
    const goldReward = diff.gold
    const todayKey = getTodayKey()

    // Mark task
    if (task.type === 'daily') {
      task.completedToday = true
      task.lastCompletedDate = todayKey
      task.streak += 1
      if (task.streak > longestDailyStreak.value) {
        longestDailyStreak.value = task.streak
      }
      totalDailiesCompleted.value += 1
    } else {
      task.isCompleted = true
      task.completedAt = new Date().toISOString()
      totalQuestsCompleted.value += 1
    }

    totalTasksCompleted.value += 1
    gold.value += goldReward
    totalXpEarned.value += xpReward

    // Update history
    const dayStat = ensureHistoryEntry(todayKey)
    dayStat.xpGained += xpReward
    dayStat.goldGained += goldReward
    dayStat.tasksCompleted += 1

    // Add XP and check Level up
    currentXp.value += xpReward
    let leveledUp = false
    let totalGoldBonus = 0

    while (currentXp.value >= xpNeededForNextLevel.value) {
      currentXp.value -= xpNeededForNextLevel.value
      level.value += 1
      leveledUp = true
      const bonus = getLevelUpGoldBonus(level.value)
      gold.value += bonus
      totalGoldBonus += bonus
    }

    if (leveledUp) {
      levelUpModal.value = {
        show: true,
        newLevel: level.value,
        levelTitle: getLevelTitle(level.value),
        goldBonus: totalGoldBonus
      }
      if (settings.value.celebrationsEnabled) {
        triggerLevelUpConfetti()
      }
    } else if (settings.value.celebrationsEnabled) {
      triggerConfetti()
    }

    saveState()
    return { xpGained: xpReward, goldGained: goldReward, leveledUp }
  }

  function closeLevelUpModal() {
    levelUpModal.value.show = false
  }

  // Reward Actions
  function addReward(params: {
    title: string
    description?: string
    cost: number
    icon: string
  }) {
    const newReward: Reward = {
      id: 'reward_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: params.title.trim(),
      description: params.description?.trim(),
      cost: Math.max(1, Math.round(params.cost)),
      icon: params.icon || '🎁',
      redemptionCount: 0,
      createdAt: new Date().toISOString()
    }
    rewards.value.unshift(newReward)
    saveState()
    return newReward
  }

  function updateReward(id: string, updates: Partial<Omit<Reward, 'id' | 'createdAt'>>) {
    const reward = rewards.value.find(r => r.id === id)
    if (reward) {
      Object.assign(reward, updates)
      saveState()
    }
  }

  function deleteReward(id: string) {
    rewards.value = rewards.value.filter(r => r.id !== id)
    saveState()
  }

  function redeemReward(id: string): boolean {
    const reward = rewards.value.find(r => r.id === id)
    if (!reward || gold.value < reward.cost) return false

    gold.value -= reward.cost
    reward.redemptionCount += 1

    const historyRecord: RedeemedReward = {
      id: 'redeem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      rewardId: reward.id,
      rewardTitle: reward.title,
      cost: reward.cost,
      icon: reward.icon,
      redeemedAt: new Date().toISOString()
    }
    redeemedHistory.value.unshift(historyRecord)

    const todayKey = getTodayKey()
    const dayStat = ensureHistoryEntry(todayKey)
    dayStat.rewardsPurchased += 1

    if (settings.value.celebrationsEnabled) {
      triggerRewardConfetti()
    }

    saveState()
    return true
  }

  // Settings Actions
  function updateSettings(newSettings: Partial<UserSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    if (newSettings.theme !== undefined) {
      applyTheme(newSettings.theme)
    }
    if (newSettings.dayResetHour !== undefined) {
      checkDayRollover()
    }
    saveState()
  }

  // Backup & Restore
  function exportData(): string {
    const fullState: GameState = {
      level: level.value,
      currentXp: currentXp.value,
      gold: gold.value,
      totalXpEarned: totalXpEarned.value,
      totalTasksCompleted: totalTasksCompleted.value,
      totalQuestsCompleted: totalQuestsCompleted.value,
      totalDailiesCompleted: totalDailiesCompleted.value,
      longestDailyStreak: longestDailyStreak.value,
      lastActiveLogicalDate: lastActiveLogicalDate.value,
      settings: settings.value,
      tasks: tasks.value,
      rewards: rewards.value,
      redeemedHistory: redeemedHistory.value,
      history: history.value
    }
    return JSON.stringify(fullState, null, 2)
  }

  function importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as Partial<GameState>
      if (typeof parsed.level !== 'number') {
        throw new Error('Invalid format: missing level')
      }

      level.value = parsed.level ?? 1
      currentXp.value = parsed.currentXp ?? 0
      gold.value = parsed.gold ?? 0
      totalXpEarned.value = parsed.totalXpEarned ?? 0
      totalTasksCompleted.value = parsed.totalTasksCompleted ?? 0
      totalQuestsCompleted.value = parsed.totalQuestsCompleted ?? 0
      totalDailiesCompleted.value = parsed.totalDailiesCompleted ?? 0
      longestDailyStreak.value = parsed.longestDailyStreak ?? 0
      lastActiveLogicalDate.value = parsed.lastActiveLogicalDate ?? ''
      
      if (parsed.settings) {
        settings.value = { ...settings.value, ...parsed.settings }
      }
      tasks.value = parsed.tasks ?? []
      rewards.value = parsed.rewards ?? []
      redeemedHistory.value = parsed.redeemedHistory ?? []
      history.value = parsed.history ?? {}

      applyTheme(settings.value.theme)
      checkDayRollover()
      saveState()
      return true
    } catch (e) {
      console.error('Import failed:', e)
      return false
    }
  }

  function resetAllProgress() {
    level.value = 1
    currentXp.value = 0
    gold.value = 0
    totalXpEarned.value = 0
    totalTasksCompleted.value = 0
    totalQuestsCompleted.value = 0
    totalDailiesCompleted.value = 0
    longestDailyStreak.value = 0
    tasks.value = []
    rewards.value = []
    redeemedHistory.value = []
    history.value = {}
    lastActiveLogicalDate.value = getTodayKey()
    saveState()
  }

  return {
    // State
    level,
    currentXp,
    gold,
    totalXpEarned,
    totalTasksCompleted,
    totalQuestsCompleted,
    totalDailiesCompleted,
    longestDailyStreak,
    lastActiveLogicalDate,
    settings,
    tasks,
    rewards,
    redeemedHistory,
    history,
    levelUpModal,

    // Computed
    xpNeededForNextLevel,
    xpPercentage,
    currentTitle,
    dailyTasks,
    questTasks,
    activeQuests,
    completedQuests,

    // Actions
    initApp,
    checkDayRollover,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    closeLevelUpModal,
    addReward,
    updateReward,
    deleteReward,
    redeemReward,
    updateSettings,
    exportData,
    importData,
    resetAllProgress
  }
})
