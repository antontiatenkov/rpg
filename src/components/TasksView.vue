<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Task, TaskType, Difficulty } from '../types'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare 
} from '@lucide/vue'

const store = useGameStore()

const currentFilter = ref<'all' | 'daily' | 'quest'>('all')
const isModalOpen = ref(false)
const taskToEdit = ref<Task | null>(null)
const defaultTypeForModal = ref<TaskType>('daily')
const showCompletedQuests = ref(false)

const dailyCompletedCount = computed(() => {
  return store.dailyTasks.filter(t => t.completedToday).length
})

const dailyTotalCount = computed(() => store.dailyTasks.length)

const dailyProgressPercent = computed(() => {
  if (dailyTotalCount.value === 0) return 0
  return Math.round((dailyCompletedCount.value / dailyTotalCount.value) * 100)
})

function openNewTaskModal(type: TaskType = 'daily') {
  taskToEdit.value = null
  defaultTypeForModal.value = type
  isModalOpen.value = true
}

function openEditTaskModal(task: Task) {
  taskToEdit.value = task
  isModalOpen.value = true
}

function handleSaveTask(payload: {
  id?: string
  title: string
  description?: string
  type: TaskType
  difficulty: Difficulty
}) {
  if (payload.id) {
    store.updateTask(payload.id, {
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty
    })
  } else {
    store.addTask({
      title: payload.title,
      description: payload.description,
      type: payload.type,
      difficulty: payload.difficulty
    })
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Задачи
        </h2>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Ежедневные привычки и текущие цели
        </p>
      </div>

      <button
        @click="openNewTaskModal('daily')"
        class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
      >
        <Plus class="w-4 h-4" />
        <span>Новая задача</span>
      </button>
    </div>

    <!-- Minimal Daily Progress (if daily tasks exist) -->
    <div 
      v-if="dailyTotalCount > 0"
      class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
    >
      <div class="flex items-center justify-between text-xs sm:text-sm mb-2">
        <span class="text-zinc-600 dark:text-zinc-400 font-medium">
          Прогресс рутин на сегодня
        </span>
        <span class="font-semibold text-zinc-900 dark:text-zinc-100">
          {{ dailyCompletedCount }} из {{ dailyTotalCount }}
        </span>
      </div>
      <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
          :style="{ width: `${dailyProgressPercent}%` }"
        ></div>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-2">
      <button
        @click="currentFilter = 'all'"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          currentFilter === 'all'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        Все ({{ store.tasks.length }})
      </button>

      <button
        @click="currentFilter = 'daily'"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          currentFilter === 'daily'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        Рутины ({{ store.dailyTasks.length }})
      </button>

      <button
        @click="currentFilter = 'quest'"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
          currentFilter === 'quest'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        Квесты ({{ store.questTasks.length }})
      </button>
    </div>

    <!-- Empty State -->
    <div 
      v-if="store.tasks.length === 0"
      class="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30"
    >
      <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
        <CheckSquare class="w-5 h-5 stroke-[1.5]" />
      </div>
      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
        Список задач пуст
      </h3>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-5">
        Добавьте свои ежедневные привычки или разовые дела, чтобы начать зарабатывать опыт и награды.
      </p>
      <button
        @click="openNewTaskModal('daily')"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        Добавить первую задачу
      </button>
    </div>

    <!-- Tasks Lists with relaxed air -->
    <div v-else class="space-y-8">
      <!-- Section: Dailies -->
      <section v-if="currentFilter === 'all' || currentFilter === 'daily'">
        <div class="flex items-center justify-between mb-3 px-1">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ежедневные рутины
          </h3>
          <span class="text-xs text-zinc-400">
            Сброс каждый день
          </span>
        </div>

        <div v-if="store.dailyTasks.length === 0" class="text-xs text-zinc-400 py-3 px-1">
          Нет добавленных рутин.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <TaskCard
            v-for="task in store.dailyTasks"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>

      <!-- Section: Active Quests -->
      <section v-if="currentFilter === 'all' || currentFilter === 'quest'">
        <div class="flex items-center justify-between mb-3 px-1">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Разовые квесты
          </h3>
          <span class="text-xs text-zinc-400">
            {{ store.activeQuests.length }} активных
          </span>
        </div>

        <div v-if="store.activeQuests.length === 0" class="text-xs text-zinc-400 py-3 px-1">
          Нет активных квестов.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <TaskCard
            v-for="task in store.activeQuests"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>

      <!-- Section: Completed Quests -->
      <section v-if="(currentFilter === 'all' || currentFilter === 'quest') && store.completedQuests.length > 0">
        <button
          @click="showCompletedQuests = !showCompletedQuests"
          class="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 py-1 transition-colors cursor-pointer"
        >
          <ChevronUp v-if="showCompletedQuests" class="w-3.5 h-3.5" />
          <ChevronDown v-else class="w-3.5 h-3.5" />
          <span>Завершенные квесты ({{ store.completedQuests.length }})</span>
        </button>

        <div v-if="showCompletedQuests" class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3">
          <TaskCard
            v-for="task in store.completedQuests"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :show="isModalOpen"
      :edit-task="taskToEdit"
      :default-type="defaultTypeForModal"
      @close="isModalOpen = false"
      @save="handleSaveTask"
    />
  </div>
</template>
