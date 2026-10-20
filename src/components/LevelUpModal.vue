<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { Trophy, Coins, Sparkles, Check } from '@lucide/vue'

const store = useGameStore()
</script>

<template>
  <div 
    v-if="store.levelUpModal.show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
  >
    <div class="relative w-full max-w-sm overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-6 text-center shadow-2xl shadow-indigo-500/20">
      <!-- Glow effect -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Icon & Level -->
      <div class="relative mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/30">
        <div class="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
          <Trophy class="w-8 h-8 text-amber-400 mb-0.5" />
          <span class="text-xs font-black text-amber-300 uppercase tracking-wider">Уровень</span>
          <span class="text-lg font-black text-white leading-none">{{ store.levelUpModal.newLevel }}</span>
        </div>
      </div>

      <!-- Heading -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
        <Sparkles class="w-3.5 h-3.5" />
        Новый рубеж достигнут!
      </div>
      
      <h3 class="text-2xl font-black text-white tracking-tight mb-1">
        Поздравляем!
      </h3>
      
      <p class="text-sm text-slate-300 mb-4">
        Ваше новое звание: 
        <strong class="text-amber-300 font-bold block text-base mt-0.5">{{ store.levelUpModal.levelTitle }}</strong>
      </p>

      <!-- Reward Box -->
      <div class="p-3 mb-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center gap-3">
        <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400">
          <Coins class="w-5 h-5" />
        </div>
        <div class="text-left">
          <p class="text-xs text-slate-400">Награда за уровень</p>
          <p class="text-sm font-bold text-amber-300">+{{ store.levelUpModal.goldBonus }} золота в казну</p>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="store.closeLevelUpModal"
        class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <Check class="w-4 h-4" />
        Продолжить путь
      </button>
    </div>
  </div>
</template>
