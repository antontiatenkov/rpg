export type TaskType = 'daily' | 'quest'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  difficulty: Difficulty
  streak: number
  completedToday: boolean
  lastCompletedDate: string | null // YYYY-MM-DD logical date
  isCompleted: boolean // for quests
  createdAt: string
  completedAt?: string
}

export interface Reward {
  id: string
  title: string
  description?: string
  cost: number
  icon: string
  redemptionCount: number
  createdAt: string
}

export interface RedeemedReward {
  id: string
  rewardId: string
  rewardTitle: string
  cost: number
  icon: string
  redeemedAt: string // ISO string
}

export interface DayHistory {
  date: string // YYYY-MM-DD
  xpGained: number
  goldGained: number
  tasksCompleted: number
  rewardsPurchased: number
}

export interface UserSettings {
  dayResetHour: number // 0-23
  theme: 'dark' | 'light' | 'system'
  celebrationsEnabled: boolean
}

export interface GameState {
  level: number
  currentXp: number
  gold: number
  totalXpEarned: number
  totalTasksCompleted: number
  totalQuestsCompleted: number
  totalDailiesCompleted: number
  longestDailyStreak: number
  lastActiveLogicalDate: string
  settings: UserSettings
  tasks: Task[]
  rewards: Reward[]
  redeemedHistory: RedeemedReward[]
  history: Record<string, DayHistory> // key is YYYY-MM-DD
}

export interface DifficultyConfig {
  xp: number
  gold: number
  label: string
  color: string
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    xp: 15,
    gold: 5,
    label: 'Легкая',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  },
  medium: {
    xp: 35,
    gold: 15,
    label: 'Средняя',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  hard: {
    xp: 75,
    gold: 40,
    label: 'Сложная',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  }
}
