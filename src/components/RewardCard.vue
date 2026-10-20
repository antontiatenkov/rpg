<script setup lang="ts">
import { computed } from 'vue'
import type { Reward } from '../types'
import { useGameStore } from '../stores/gameStore'
import { Coins, Trash2, Edit3, ShoppingBag } from '@lucide/vue'

const props = defineProps<{
  reward: Reward
}>()

const emit = defineEmits<{
  (e: 'edit', reward: Reward): void
}>()

const store = useGameStore()

const canAfford = computed(() => store.gold >= props.reward.cost)
const missingGold = computed(() => Math.max(0, props.reward.cost - store.gold))

function handleRedeem() {
  if (!canAfford.value) return
  store.redeemReward(props.reward.id)
}

function handleDelete() {
  if (confirm(`Удалить награду «${props.reward.title}»?`)) {
    store.deleteReward(props.reward.id)
  }
}
</script>

<template>
  <div class="group relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all duration-200 flex flex-col justify-between">
    <div>
      <div class="flex items-start justify-between gap-3">
        <!-- Icon & Title -->
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {{ reward.icon || '🎁' }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {{ reward.title }}
            </h4>
            <p v-if="reward.description" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {{ reward.description }}
            </p>
          </div>
        </div>

        <!-- Action Buttons (Edit / Delete) -->
        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
          <button
            @click="emit('edit', reward)"
            title="Редактировать"
            class="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 class="w-3.5 h-3.5" />
          </button>
          <button
            @click="handleDelete"
            title="Удалить"
            class="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Price & Buy Button -->
    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
      <!-- Price & Count -->
      <div>
        <div class="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400 text-sm">
          <Coins class="w-4 h-4" />
          <span>{{ reward.cost }}</span>
          <span class="text-xs font-normal text-slate-400">золота</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">
          Куплено: {{ reward.redemptionCount }} раз
        </div>
      </div>

      <!-- Buy Button -->
      <button
        @click="handleRedeem"
        :disabled="!canAfford"
        :title="canAfford ? 'Получить награду' : `Недостаточно золота (нужно еще ${missingGold})`"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
          canAfford
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700/60'
        ]"
      >
        <ShoppingBag class="w-3.5 h-3.5" />
        <span v-if="canAfford">Забрать</span>
        <span v-else class="text-[11px]">-{{ missingGold }} 🪙</span>
      </button>
    </div>
  </div>
</template>
