<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Reward } from '../types'
import { X } from '@lucide/vue'

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
  '🎮', '🎬', '🍿', '☕', '🍕', '🍣', '🍦', '🧁', '🎧', '📚', '🛌', '🛍️', '✈️', '🎯'
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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
  >
    <div class="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {{ editReward ? 'Редактировать награду' : 'Новая награда' }}
        </h3>
        <button
          @click="emit('close')"
          class="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Icon Selector -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Иконка
          </label>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0">
              {{ icon }}
            </div>
            <input
              v-model="icon"
              maxlength="4"
              class="w-16 px-2.5 py-2 text-center text-base rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              placeholder="Эмодзи"
            />
          </div>
          <!-- Presets -->
          <div class="flex flex-wrap gap-1.5 p-2 bg-zinc-50/60 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
            <button
              v-for="preset in EMOJI_PRESETS"
              :key="preset"
              type="button"
              @click="icon = preset"
              :class="[
                'w-7 h-7 rounded-lg flex items-center justify-center text-base transition-transform hover:scale-110 cursor-pointer',
                icon === preset ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
              ]"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Название награды
          </label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="Например: 1 час видеоигры"
            class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Описание
          </label>
          <textarea
            v-model="description"
            rows="2"
            placeholder="Детали..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Cost -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Стоимость в золоте (🪙)
          </label>
          <input
            v-model.number="cost"
            type="number"
            min="1"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center gap-2 pt-3">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="!title.trim() || cost <= 0"
            class="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-900 text-sm font-medium transition-all shadow-xs"
          >
            {{ editReward ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
