<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { Coins, Check } from '@lucide/vue'

const store = useGameStore()
</script>

<template>
  <div 
    v-if="store.levelUpModal.show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
  >
    <div class="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 text-center shadow-xl">
      <!-- Minimal Level Badge -->
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center">
        <span class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Уровень</span>
        <span class="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mt-0.5">
          {{ store.levelUpModal.newLevel }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Новый уровень!
      </h3>
      
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
        Новое звание:
        <span class="font-semibold text-zinc-800 dark:text-zinc-200 block text-sm mt-0.5">
          {{ store.levelUpModal.levelTitle }}
        </span>
      </p>

      <!-- Bonus Box -->
      <div class="p-3.5 mb-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        <Coins class="w-4 h-4 text-amber-500" />
        <span>+{{ store.levelUpModal.goldBonus }} золота добавлено в казну</span>
      </div>

      <!-- Action Button -->
      <button
        @click="store.closeLevelUpModal"
        class="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Check class="w-4 h-4" />
        Продолжить
      </button>
    </div>
  </div>
</template>
