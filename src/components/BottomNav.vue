<script setup lang="ts">
import { 
  CheckSquare, 
  Gift, 
  BarChart2, 
  Settings 
} from '@lucide/vue'

defineProps<{
  activeTab: 'tasks' | 'rewards' | 'stats' | 'settings'
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'tasks' | 'rewards' | 'stats' | 'settings'): void
}>()
</script>

<template>
  <div class="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
    <nav class="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl sm:rounded-3xl shadow-xl shadow-zinc-900/5 dark:shadow-black/40 transition-all">
      <!-- Tab: Tasks -->
      <button
        @click="emit('update:activeTab', 'tasks')"
        :class="[
          'flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer',
          activeTab === 'tasks'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
        ]"
      >
        <CheckSquare class="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
        <span class="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5">Задачи</span>
      </button>

      <!-- Tab: Rewards -->
      <button
        @click="emit('update:activeTab', 'rewards')"
        :class="[
          'flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer',
          activeTab === 'rewards'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
        ]"
      >
        <Gift class="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
        <span class="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5">Награды</span>
      </button>

      <!-- Tab: Stats -->
      <button
        @click="emit('update:activeTab', 'stats')"
        :class="[
          'flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer',
          activeTab === 'stats'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
        ]"
      >
        <BarChart2 class="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
        <span class="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5">Статистика</span>
      </button>

      <!-- Tab: Settings -->
      <button
        @click="emit('update:activeTab', 'settings')"
        :class="[
          'flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer',
          activeTab === 'settings'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
        ]"
      >
        <Settings class="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
        <span class="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5">Настройки</span>
      </button>
    </nav>
  </div>
</template>
