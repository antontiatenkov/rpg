<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { getLogicalDate } from '../utils/date'

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
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Статистика
      </h2>
      <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        Обзор вашей активности и прогресса
      </p>
    </div>

    <!-- Clean Metric Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
      <!-- Level Card -->
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Уровень</div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          {{ store.level }}
        </div>
        <p class="text-xs text-zinc-500 mt-0.5 truncate">
          {{ store.currentTitle }}
        </p>
      </div>

      <!-- Total XP -->
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Всего XP</div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          {{ store.totalXpEarned.toLocaleString() }}
        </div>
        <p class="text-xs text-zinc-500 mt-0.5">
          {{ store.currentXp }} в текущем уровне
        </p>
      </div>

      <!-- Longest Streak -->
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Серия привычек</div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          {{ store.longestDailyStreak }} <span class="text-xs font-normal text-zinc-400">дней</span>
        </div>
        <p class="text-xs text-zinc-500 mt-0.5">
          Лучший результат
        </p>
      </div>

      <!-- Total Tasks Done -->
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Задач выполнено</div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          {{ store.totalTasksCompleted.toLocaleString() }}
        </div>
        <p class="text-xs text-zinc-500 mt-0.5">
          {{ store.totalDailiesCompleted }} рутин, {{ store.totalQuestsCompleted }} квестов
        </p>
      </div>
    </div>

    <!-- Last 7 Days Activity Chart -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Опыт за 7 дней
          </h3>
          <p class="text-xs text-zinc-400 mt-0.5">Динамика набранного опыта по дням</p>
        </div>
      </div>

      <!-- Chart Bars -->
      <div class="grid grid-cols-7 gap-2.5 sm:gap-4 pt-4 pb-1 items-end min-h-[140px]">
        <div
          v-for="day in last7Days"
          :key="day.dateStr"
          class="flex flex-col items-center gap-2 h-full justify-end group"
        >
          <!-- Tooltip info on hover -->
          <div class="text-[10px] font-medium text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
            +{{ day.xp }}
          </div>

          <!-- Bar -->
          <div class="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden h-24 flex items-end">
            <div
              class="w-full bg-zinc-900 dark:bg-zinc-200 rounded-md transition-all duration-300"
              :style="{ height: `${Math.max(4, Math.round((day.xp / maxXp) * 100))}%` }"
            ></div>
          </div>

          <!-- Date Label -->
          <div class="text-[10px] sm:text-xs text-zinc-400 text-center font-medium capitalize truncate w-full">
            {{ day.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
