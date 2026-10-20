<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Reward } from '../types'
import { formatDateTimeRu } from '../utils/date'
import RewardCard from './RewardCard.vue'
import RewardModal from './RewardModal.vue'
import { 
  Plus, 
  Gift 
} from '@lucide/vue'

const store = useGameStore()

const currentSubTab = ref<'catalog' | 'history'>('catalog')
const isModalOpen = ref(false)
const rewardToEdit = ref<Reward | null>(null)

function openNewRewardModal() {
  rewardToEdit.value = null
  isModalOpen.value = true
}

function openEditRewardModal(reward: Reward) {
  rewardToEdit.value = reward
  isModalOpen.value = true
}

function handleSaveReward(payload: {
  id?: string
  title: string
  description?: string
  cost: number
  icon: string
}) {
  if (payload.id) {
    store.updateReward(payload.id, {
      title: payload.title,
      description: payload.description,
      cost: payload.cost,
      icon: payload.icon
    })
  } else {
    store.addReward({
      title: payload.title,
      description: payload.description,
      cost: payload.cost,
      icon: payload.icon
    })
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header with Balance & Action -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Награды
        </h2>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Поощрения за выполнение задач и целей
        </p>
      </div>

      <button
        @click="openNewRewardModal"
        class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
      >
        <Plus class="w-4 h-4" />
        <span>Новая награда</span>
      </button>
    </div>

    <!-- Sub-tabs: Catalog vs History -->
    <div class="flex items-center gap-2">
      <button
        @click="currentSubTab = 'catalog'"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          currentSubTab === 'catalog'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        Витрина ({{ store.rewards.length }})
      </button>

      <button
        @click="currentSubTab = 'history'"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          currentSubTab === 'history'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        История покупок ({{ store.redeemedHistory.length }})
      </button>
    </div>

    <!-- CATALOG TAB -->
    <div v-if="currentSubTab === 'catalog'">
      <!-- Empty State -->
      <div 
        v-if="store.rewards.length === 0"
        class="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30"
      >
        <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
          <Gift class="w-5 h-5 stroke-[1.5]" />
        </div>
        <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          Список наград пока пуст
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-5">
          Придумайте для себя приятные стимулы: просмотр фильма, десерт, видеоигра или покупка желанной вещи.
        </p>
        <button
          @click="openNewRewardModal"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Добавить первую награду
        </button>
      </div>

      <!-- Rewards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <RewardCard
          v-for="reward in store.rewards"
          :key="reward.id"
          :reward="reward"
          @edit="openEditRewardModal"
        />
      </div>
    </div>

    <!-- HISTORY TAB -->
    <div v-else>
      <div 
        v-if="store.redeemedHistory.length === 0"
        class="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30"
      >
        <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          Покупок пока не было
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Выполняйте задачи, копите золото и приобретайте награды на витрине!
        </p>
      </div>

      <div v-else class="space-y-2.5">
        <div 
          v-for="item in store.redeemedHistory"
          :key="item.id"
          class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
        >
          <div class="flex items-center gap-3.5">
            <div class="text-xl shrink-0">
              {{ item.icon || '🎁' }}
            </div>
            <div>
              <h4 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ item.rewardTitle }}
              </h4>
              <p class="text-[11px] text-zinc-400 mt-0.5">
                {{ formatDateTimeRu(item.redeemedAt) }}
              </p>
            </div>
          </div>

          <div class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            -{{ item.cost }} 🪙
          </div>
        </div>
      </div>
    </div>

    <!-- Reward Modal -->
    <RewardModal
      :show="isModalOpen"
      :edit-reward="rewardToEdit"
      @close="isModalOpen = false"
      @save="handleSaveReward"
    />
  </div>
</template>
