<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Reward } from '../types'
import { X, Coins, Gift } from '@lucide/vue'

const props = defineProps<{
  show: boolean
  editReward?: Reward | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: {
    id?: string
    title: string
    description?: string
    cost: number
    icon: string
  }): void
}>()

const EMOJI_PRESETS = [
  '🎮', '🎬', '🍿', '☕', '🍕', '🍣', '🍦', '🧁', '🎧', '📚', '🛌', '🛍️', '✈️', '🎯', '🍺', '🎨'
]

const title = ref('')
const description = ref('')
const cost = ref(30)
const icon = ref('🎮')

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      if (props.editReward) {
        title.value = props.editReward.title
        description.value = props.editReward.description || ''
        cost.value = props.editReward.cost
        icon.value = props.editReward.icon || '🎁'
      } else {
        title.value = ''
        description.value = ''
        cost.value = 30
        icon.value = '🎮'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!title.value.trim() || cost.value <= 0) return
  emit('save', {
    id: props.editReward?.id,
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    cost: Number(cost.value),
    icon: icon.value || '🎁'
  })
  emit('close')
}
</script>

<template>
  <div 
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
  >
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Gift class="w-5 h-5 text-amber-500" />
          {{ editReward ? 'Редактировать награду' : 'Создать награду' }}
        </h3>
        <button
          @click="emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Icon Selector -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Иконка награды
          </label>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {{ icon }}
            </div>
            <input
              v-model="icon"
              maxlength="4"
              class="w-20 px-3 py-2 text-center text-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Эмодзи"
            />
            <span class="text-xs text-slate-400">Выберите готовый или введите любой эмодзи</span>
          </div>
          <!-- Presets -->
          <div class="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <button
              v-for="preset in EMOJI_PRESETS"
              :key="preset"
              type="button"
              @click="icon = preset"
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform hover:scale-110 cursor-pointer',
                icon === preset ? 'bg-amber-500/20 border border-amber-500/40 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
              ]"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Название награды <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="Например: 1 час любимой видеоигры"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Описание (необязательно)
          </label>
          <textarea
            v-model="description"
            rows="2"
            placeholder="Условия или детали награды..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Cost -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Стоимость в золоте <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model.number="cost"
              type="number"
              min="1"
              required
              class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <Coins class="w-4 h-4 text-amber-500 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center gap-2 pt-3">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="!title.trim() || cost <= 0"
            class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            {{ editReward ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
