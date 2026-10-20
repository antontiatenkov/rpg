<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { 
  Swords, 
  Gift, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun, 
  Coins, 
  Sparkles,
  Shield
} from '@lucide/vue'

const props = defineProps<{
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
  <header class="sticky top-0 z-30 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors shadow-sm">
    <div class="max-w-5xl mx-auto px-4 py-3 sm:py-4">
      <!-- Top Row: Logo, Stats & Theme -->
      <div class="flex items-center justify-between gap-3">
        <!-- Logo & Level Badge -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            <Swords class="w-5 h-5 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold tracking-tight text-base sm:text-lg text-white">RPG Routine</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Shield class="w-3 h-3 text-indigo-400" />
                {{ store.level }} ур.
              </span>
            </div>
            <p class="text-xs text-slate-400 hidden sm:block font-medium">
              {{ store.currentTitle }}
            </p>
          </div>
        </div>

        <!-- Gold Counter & Theme Toggle -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Gold Badge -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm shadow-inner">
            <Coins class="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{{ store.gold.toLocaleString() }}</span>
            <span class="text-xs text-amber-500 font-normal">золота</span>
          </div>

          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            title="Переключить тему оформления"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors border border-slate-800/80"
          >
            <Sun v-if="store.settings.theme === 'dark'" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      <!-- XP Progress Bar Row -->
      <div class="mt-3 pt-2 border-t border-slate-800/60">
        <div class="flex items-center justify-between text-xs mb-1">
          <div class="flex items-center gap-1 text-slate-400 font-medium">
            <Sparkles class="w-3.5 h-3.5 text-indigo-400" />
            <span>Опыт (XP):</span>
            <span class="text-indigo-300 font-semibold">{{ store.currentXp }} / {{ store.xpNeededForNextLevel }}</span>
          </div>
          <span class="text-slate-400 font-medium">{{ store.xpPercentage }}% до ур. {{ store.level + 1 }}</span>
        </div>
        <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-sm"
            :style="{ width: `${store.xpPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center gap-1 sm:gap-2 mt-3 pt-2 overflow-x-auto no-scrollbar">
        <button
          @click="emit('update:activeTab', 'tasks')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap',
            activeTab === 'tasks' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          ]"
        >
          <Swords class="w-4 h-4" />
          Задачи
        </button>

        <button
          @click="emit('update:activeTab', 'rewards')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap',
            activeTab === 'rewards' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          ]"
        >
          <Gift class="w-4 h-4" />
          Магазин наград
        </button>

        <button
          @click="emit('update:activeTab', 'stats')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap',
            activeTab === 'stats' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          ]"
        >
          <BarChart3 class="w-4 h-4" />
          Статистика
        </button>

        <button
          @click="emit('update:activeTab', 'settings')"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap',
            activeTab === 'settings' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          ]"
        >
          <Settings class="w-4 h-4" />
          Настройки
        </button>
      </nav>
    </div>
  </header>
</template>
