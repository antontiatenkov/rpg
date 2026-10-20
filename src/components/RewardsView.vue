<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Reward } from '../types'
import { formatDateTimeRu } from '../utils/date'
import RewardCard from './RewardCard.vue'
import RewardModal from './RewardModal.vue'
import { 
  Plus, 
  Coins, 
  Gift, 
  History
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
  <div class="space-y-6">
    <!-- Header with Balance & Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Магазин наград</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
            {{ store.rewards.length }} наград
          </span>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Покупайте себе заслуженные удовольствия и отдых за заработанное золото
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Balance Pill -->
        <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-300 font-bold text-sm">
          <Coins class="w-4 h-4 text-amber-500 animate-bounce" />
          <span>{{ store.gold.toLocaleString() }} 🪙</span>
        </div>

        <!-- Add Button -->
        <button
          @click="openNewRewardModal"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus class="w-4 h-4" />
          <span>Новая награда</span>
        </button>
      </div>
    </div>

    <!-- Sub-tabs: Catalog vs History -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
      <button
        @click="currentSubTab = 'catalog'"
        :class="[
          'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
          currentSubTab === 'catalog'
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <Gift class="w-3.5 h-3.5" />
        Витрина наград ({{ store.rewards.length }})
      </button>

      <button
        @click="currentSubTab = 'history'"
        :class="[
          'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
          currentSubTab === 'history'
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <History class="w-3.5 h-3.5" />
        История покупок ({{ store.redeemedHistory.length }})
      </button>
    </div>

    <!-- CATALOG TAB -->
    <div v-if="currentSubTab === 'catalog'">
      <!-- Empty State -->
      <div 
        v-if="store.rewards.length === 0"
        class="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl">
          🎁
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          В магазине пока нет наград
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
          Создайте себе приятные стимулы: просмотр фильма, вкусный десерт, поход в кафе, покупка желанной вещи или день отдыха!
        </p>
        <button
          @click="openNewRewardModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
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
        class="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
          <History class="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          Покупок пока не совершалось
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Выполняйте задачи, копите золото и приобретайте награды на витрине!
        </p>
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="item in store.redeemedHistory"
          :key="item.id"
          class="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
              {{ item.icon || '🎁' }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100">
                {{ item.rewardTitle }}
              </h4>
              <p class="text-[11px] text-slate-400">
                {{ formatDateTimeRu(item.redeemedAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1 font-bold text-amber-500 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Coins class="w-3.5 h-3.5" />
            -{{ item.cost }}
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
