<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { 
  CheckSquare, 
  Gift, 
  BarChart2, 
  Settings, 
  Moon, 
  Sun, 
  Coins
} from '@lucide/vue'

defineProps<{
  activeTab: 'tasks' | 'rewards' | 'stats' | 'settings'
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'tasks' | 'rewards' | 'stats' | 'settings'): void
}>()

const store = useGameStore()

function toggleTheme() {
  const nextTheme = store.settings.theme === 'dark' ? 'light' : 'dark'
  store.updateSettings({ theme: nextTheme })
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <!-- Top Row: Title, Level & Gold -->
      <div class="flex items-center justify-between gap-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shrink-0">
            RPG
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Reach Personal Goals
            </h1>
            <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{{ store.level }} уровень</span>
              <span>·</span>
              <span class="truncate max-w-[140px] sm:max-w-none">{{ store.currentTitle }}</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Gold & Theme -->
        <div class="flex items-center gap-3">
          <!-- Clean Gold Counter -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Coins class="w-3.5 h-3.5" />
            <span>{{ store.gold.toLocaleString() }}</span>
            <span class="text-[11px] opacity-75 font-normal">золота</span>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            title="Переключить тему оформления"
            class="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <Sun v-if="store.settings.theme === 'dark'" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      <!-- Minimal Slim XP Progress Bar -->
      <div class="mt-3.5">
        <div class="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-medium">
          <span>Опыт: {{ store.currentXp }} / {{ store.xpNeededForNextLevel }} XP</span>
          <span>{{ store.xpPercentage }}%</span>
        </div>
        <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
            :style="{ width: `${store.xpPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Navigation Tabs with plenty of air -->
      <nav class="flex items-center gap-1 sm:gap-2 mt-4 pt-1 overflow-x-auto no-scrollbar">
        <button
          @click="emit('update:activeTab', 'tasks')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'tasks' 
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          ]"
        >
          <CheckSquare class="w-4 h-4" />
          Задачи
        </button>

        <button
          @click="emit('update:activeTab', 'rewards')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'rewards' 
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          ]"
        >
          <Gift class="w-4 h-4" />
          Награды
        </button>

        <button
          @click="emit('update:activeTab', 'stats')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'stats' 
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          ]"
        >
          <BarChart2 class="w-4 h-4" />
          Статистика
        </button>

        <button
          @click="emit('update:activeTab', 'settings')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'settings' 
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          ]"
        >
          <Settings class="w-4 h-4" />
          Настройки
        </button>
      </nav>
    </div>
  </header>
</template>
