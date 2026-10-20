<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../types'
import { DIFFICULTY_SETTINGS } from '../types'
import { useGameStore } from '../stores/gameStore'
import { 
  Check, 
  Flame, 
  Coins, 
  Sparkles, 
  Trash2, 
  Edit3, 
  CheckCircle2
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
      'group relative p-4 rounded-2xl border transition-all duration-200',
      isCompleted 
        ? 'bg-slate-900/40 dark:bg-slate-900/40 border-slate-800/80 opacity-75' 
        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/30'
    ]"
  >
    <div class="flex items-start gap-3.5">
      <!-- Checkbox Button -->
      <button
        @click="handleComplete"
        :disabled="isCompleted"
        :title="isCompleted ? 'Задача уже выполнена' : 'Отметить выполнение и получить награду'"
        :class="[
          'mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200',
          isCompleted 
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-default' 
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-500/10 text-transparent hover:text-indigo-400 cursor-pointer active:scale-90'
        ]"
      >
        <Check class="w-4 h-4 stroke-[3]" />
      </button>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h4 
            :class="[
              'text-sm font-semibold tracking-tight transition-colors line-clamp-2',
              isCompleted 
                ? 'line-through text-slate-400 dark:text-slate-500' 
                : 'text-slate-900 dark:text-slate-100'
            ]"
          >
            {{ task.title }}
          </h4>

          <!-- Actions (Edit/Delete) -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
            <button
              @click="emit('edit', task)"
              title="Редактировать"
              class="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

        <p 
          v-if="task.description" 
          :class="[
            'text-xs mt-1 line-clamp-2',
            isCompleted ? 'text-slate-500 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'
          ]"
        >
          {{ task.description }}
        </p>

        <!-- Footer Badges -->
        <div class="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <!-- Difficulty & Rewards -->
          <span 
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border text-[11px]',
              diffConfig.color
            ]"
          >
            {{ diffConfig.label }}
          </span>

          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-medium">
            <Sparkles class="w-3 h-3" />
            +{{ diffConfig.xp }} XP
          </span>

          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">
            <Coins class="w-3 h-3" />
            +{{ diffConfig.gold }}
          </span>

          <!-- Daily Streak Badge -->
          <span 
            v-if="task.type === 'daily'"
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border',
              task.streak > 0 
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
            ]"
          >
            <Flame :class="['w-3 h-3', task.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400']" />
            {{ task.streak }} {{ task.streak === 1 ? 'день' : (task.streak >= 2 && task.streak <= 4 ? 'дня' : 'дней') }}
          </span>

          <!-- Status Pill -->
          <span 
            v-if="isCompleted" 
            class="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span v-if="task.type === 'daily'">Выполнено</span>
            <span v-else>Завершено</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
