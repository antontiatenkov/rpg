<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskType, Difficulty } from '../types'
import { DIFFICULTY_SETTINGS } from '../types'
import { X } from '@lucide/vue'

const props = defineProps<{
  show: boolean
  editTask?: Task | null
  defaultType?: TaskType
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: {
    id?: string
    title: string
    description?: string
    type: TaskType
    difficulty: Difficulty
  }): void
}>()

const title = ref('')
const description = ref('')
const type = ref<TaskType>('daily')
const difficulty = ref<Difficulty>('medium')

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      if (props.editTask) {
        title.value = props.editTask.title
        description.value = props.editTask.description || ''
        type.value = props.editTask.type
        difficulty.value = props.editTask.difficulty
      } else {
        title.value = ''
        description.value = ''
        type.value = props.defaultType || 'daily'
        difficulty.value = 'medium'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!title.value.trim()) return
  emit('save', {
    id: props.editTask?.id,
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    type: type.value,
    difficulty: difficulty.value
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
          {{ editTask ? 'Редактировать задачу' : 'Новая задача' }}
        </h3>
        <button
          @click="emit('close')"
          class="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type Selection -->
        <div v-if="!editTask">
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Тип
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="type = 'daily'"
              :class="[
                'py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer',
                type === 'daily'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              ]"
            >
              Ежедневная рутина
            </button>
            <button
              type="button"
              @click="type = 'quest'"
              :class="[
                'py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer',
                type === 'quest'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              ]"
            >
              Разовый квест
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Название
          </label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="Например: Утренняя зарядка 15 мин"
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
            placeholder="Дополнительные детали..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Difficulty Selection -->
        <div>
          <label class="block text-xs font-medium text-zinc-500 mb-1.5">
            Сложность
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(config, key) in DIFFICULTY_SETTINGS"
              :key="key"
              type="button"
              @click="difficulty = key"
              :class="[
                'p-2.5 rounded-xl border text-center transition-all cursor-pointer',
                difficulty === key
                  ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              ]"
            >
              <div class="text-xs font-medium text-zinc-900 dark:text-zinc-100 mb-0.5">
                {{ config.label }}
              </div>
              <div class="text-[11px] text-zinc-400">
                +{{ config.xp }} XP · {{ config.gold }} 🪙
              </div>
            </button>
          </div>
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
            :disabled="!title.trim()"
            class="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-900 text-sm font-medium transition-all shadow-xs"
          >
            {{ editTask ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
