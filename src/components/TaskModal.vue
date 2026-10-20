<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskType, Difficulty } from '../types'
import { DIFFICULTY_SETTINGS } from '../types'
import { X, Calendar, CheckSquare, Sparkles, Coins } from '@lucide/vue'

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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
  >
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          {{ editTask ? 'Редактировать задачу' : 'Новое испытание' }}
        </h3>
        <button
          @click="emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type Selection (Only when creating) -->
        <div v-if="!editTask">
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Тип задачи
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="type = 'daily'"
              :class="[
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                type === 'daily'
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              ]"
            >
              <Calendar class="w-4 h-4" />
              Ежедневная рутина
            </button>
            <button
              type="button"
              @click="type = 'quest'"
              :class="[
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                type === 'quest'
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              ]"
            >
              <CheckSquare class="w-4 h-4" />
              Разовый квест
            </button>
          </div>
        </div>

        <!-- Title Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Название задачи <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="Например: Утренняя пробежка 20 минут"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <!-- Description Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Описание (необязательно)
          </label>
          <textarea
            v-model="description"
            rows="2"
            placeholder="Детали или подсказки для выполнения..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Difficulty Selection -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Сложность и награда
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
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              ]"
            >
              <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {{ config.label }}
              </div>
              <div class="text-[11px] text-indigo-400 font-semibold flex items-center justify-center gap-0.5">
                <Sparkles class="w-3 h-3" />
                +{{ config.xp }}
              </div>
              <div class="text-[11px] text-amber-400 font-semibold flex items-center justify-center gap-0.5">
                <Coins class="w-3 h-3" />
                +{{ config.gold }}
              </div>
            </button>
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
            :disabled="!title.trim()"
            class="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            {{ editTask ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
