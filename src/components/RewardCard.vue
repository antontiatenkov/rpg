<script setup lang="ts">
import { computed } from 'vue'
import type { Reward } from '../types'
import { useGameStore } from '../stores/gameStore'
import { Trash2, Edit3 } from '@lucide/vue'

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
  <div class="group relative p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
    <div>
      <div class="flex items-start justify-between gap-3">
        <!-- Icon & Title -->
        <div class="flex items-start gap-3.5">
          <div class="text-2xl shrink-0 pt-0.5">
            {{ reward.icon || '🎁' }}
          </div>
          <div>
            <h4 class="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {{ reward.title }}
            </h4>
            <p v-if="reward.description" class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {{ reward.description }}
            </p>
          </div>
        </div>

        <!-- Action Buttons (Edit / Delete) -->
        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
          <button
            @click="emit('edit', reward)"
            title="Редактировать"
            class="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <Edit3 class="w-3.5 h-3.5" />
          </button>
          <button
            @click="handleDelete"
            title="Удалить"
            class="p-1 rounded-md text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Price & Redeem Button -->
    <div class="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
      <!-- Price & Count -->
      <div>
        <div class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
          {{ reward.cost }} 🪙
        </div>
        <div v-if="reward.redemptionCount > 0" class="text-[11px] text-zinc-400 mt-0.5">
          Использовано: {{ reward.redemptionCount }}
        </div>
      </div>

      <!-- Buy Button -->
      <button
        @click="handleRedeem"
        :disabled="!canAfford"
        :title="canAfford ? 'Получить награду' : `Недостаточно золота (нужно еще ${missingGold} 🪙)`"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          canAfford
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-xs'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
        ]"
      >
        <span v-if="canAfford">Забрать</span>
        <span v-else>Нужно еще {{ missingGold }} 🪙</span>
      </button>
    </div>
  </div>
</template>
