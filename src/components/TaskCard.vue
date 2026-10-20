<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../types'
import { DIFFICULTY_SETTINGS } from '../types'
import { useGameStore } from '../stores/gameStore'
import { 
  Check, 
  Flame, 
  Trash2, 
  Edit3 
} from '@lucide/vue'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'edit', task: Task): void
}>()

const store = useGameStore()

const diffConfig = computed(() => DIFFICULTY_SETTINGS[props.task.difficulty])

const isCompleted = computed(() => {
  if (props.task.type === 'daily') {
    return props.task.completedToday
  }
  return props.task.isCompleted
})

function handleComplete() {
  if (isCompleted.value) return
  store.completeTask(props.task.id)
}

function handleDelete() {
  if (confirm(`Удалить задачу «${props.task.title}»?`)) {
    store.deleteTask(props.task.id)
  }
}
</script>

<template>
  <div 
    :class="[
      'group relative p-4 sm:p-5 rounded-2xl border transition-all duration-150',
      isCompleted 
        ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/40 opacity-70' 
        : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700'
    ]"
  >
    <div class="flex items-start gap-3.5">
      <!-- Checkbox Button -->
      <button
        @click="handleComplete"
        :disabled="isCompleted"
        :title="isCompleted ? 'Задача выполнена' : 'Отметить выполнение'"
        :class="[
          'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer',
          isCompleted 
            ? 'bg-zinc-900 dark:bg-zinc-100 border-transparent text-white dark:text-zinc-900 cursor-default' 
            : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-600 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-transparent hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95'
        ]"
      >
        <Check class="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <h4 
            :class="[
              'text-sm font-medium tracking-tight transition-colors',
              isCompleted 
                ? 'line-through text-zinc-400 dark:text-zinc-500' 
                : 'text-zinc-900 dark:text-zinc-100'
            ]"
          >
            {{ task.title }}
          </h4>

          <!-- Edit & Delete buttons (discreet on hover) -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
            <button
              @click="emit('edit', task)"
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

        <p 
          v-if="task.description" 
          :class="[
            'text-xs mt-1 leading-relaxed',
            isCompleted ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          ]"
        >
          {{ task.description }}
        </p>

        <!-- Clean, calm metadata line (no noisy colored boxes) -->
        <div class="flex items-center gap-2.5 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          <!-- Difficulty & Rewards -->
          <span>{{ diffConfig.label }}</span>
          <span>·</span>
          <span>+{{ diffConfig.xp }} XP</span>
          <span>·</span>
          <span>{{ diffConfig.gold }} 🪙</span>

          <!-- Daily streak if active -->
          <template v-if="task.type === 'daily' && task.streak > 0">
            <span>·</span>
            <span class="inline-flex items-center gap-1 text-orange-500 font-medium">
              <Flame class="w-3 h-3 fill-orange-500 text-orange-500" />
              {{ task.streak }} дн.
            </span>
          </template>

          <!-- Done badge -->
          <span v-if="isCompleted" class="ml-auto text-zinc-400 dark:text-zinc-500 font-medium text-[11px]">
            Выполнено
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
