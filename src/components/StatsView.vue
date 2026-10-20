<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { getLogicalDate } from '../utils/date'
import { 
  Shield, 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  Flame, 
  Gift, 
  TrendingUp
} from '@lucide/vue'

const store = useGameStore()

// Generate last 7 logical days
const last7Days = computed(() => {
  const days: { dateStr: string; label: string; xp: number; tasks: number; gold: number }[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = getLogicalDate(d, store.settings.dayResetHour)
    const dayStat = store.history[dateStr] || {
      xpGained: 0,
      goldGained: 0,
      tasksCompleted: 0,
      rewardsPurchased: 0
    }

    const weekday = d.toLocaleDateString('ru-RU', { weekday: 'short' })
    const dayNum = d.getDate()

    days.push({
      dateStr,
      label: `${weekday}, ${dayNum}`,
      xp: dayStat.xpGained,
      tasks: dayStat.tasksCompleted,
      gold: dayStat.goldGained
    })
  }
  return days
})

const maxXp = computed(() => {
  const max = Math.max(...last7Days.value.map(d => d.xp))
  return max > 0 ? max : 100
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <span>Статистика и достижения</span>
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        Обзор вашей продуктивности, набранного опыта и серий привычек
      </p>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      <!-- Level Card -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-indigo-400 mb-2">
          <Shield class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Уровень героя</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100">
          {{ store.level }}
        </div>
        <p class="text-xs text-indigo-500 dark:text-indigo-400 font-medium truncate mt-0.5">
          {{ store.currentTitle }}
        </p>
      </div>

      <!-- Total XP -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-purple-400 mb-2">
          <Sparkles class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Всего опыта (XP)</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100">
          {{ store.totalXpEarned.toLocaleString() }}
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          {{ store.currentXp }} в текущем уровне
        </p>
      </div>

      <!-- Longest Streak -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-orange-400 mb-2">
          <Flame class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Рекорд серии</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <span>{{ store.longestDailyStreak }}</span>
          <span class="text-xs font-normal text-slate-400">дней</span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Подряд без пропуска
        </p>
      </div>

      <!-- Dailies Completed -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-emerald-400 mb-2">
          <Calendar class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Рутин выполнено</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100">
          {{ store.totalDailiesCompleted.toLocaleString() }}
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Ежедневных повторений
        </p>
      </div>

      <!-- Quests Completed -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-blue-400 mb-2">
          <CheckSquare class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Квестов закрыто</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100">
          {{ store.totalQuestsCompleted.toLocaleString() }}
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Разовых задач
        </p>
      </div>

      <!-- Rewards Claimed -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 text-amber-400 mb-2">
          <Gift class="w-4 h-4" />
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Куплено наград</span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-slate-100">
          {{ store.redeemedHistory.length }}
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          В магазине наград
        </p>
      </div>
    </div>

    <!-- Last 7 Days Activity Chart -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-indigo-400" />
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">
            Опыт за последние 7 дней
          </h3>
        </div>
        <span class="text-xs text-slate-400">XP по дням</span>
      </div>

      <!-- Chart Bars -->
      <div class="grid grid-cols-7 gap-2 pt-6 pb-2 items-end min-h-[160px]">
        <div
          v-for="day in last7Days"
          :key="day.dateStr"
          class="flex flex-col items-center gap-2 h-full justify-end group"
        >
          <!-- Tooltip info -->
          <div class="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
            +{{ day.xp }}
          </div>

          <!-- Bar -->
          <div class="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden h-28 flex items-end p-0.5">
            <div
              class="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-lg transition-all duration-500 group-hover:brightness-110"
              :style="{ height: `${Math.max(4, Math.round((day.xp / maxXp) * 100))}%` }"
            ></div>
          </div>

          <!-- Date Label -->
          <div class="text-[10px] sm:text-xs text-slate-400 text-center font-medium capitalize truncate w-full">
            {{ day.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
